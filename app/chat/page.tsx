"use client";

import { useEffect, useState, useRef } from "react";
import { User, Circle, Trash2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { getFirebaseToken } from "@/lib/getFirebaseToken";

interface Friend {
  id: number;
  name: string;
  email: string;
  online?: boolean;
}

interface Message {
  id: number;
  text: string;
  fromMe?: boolean;
}

export default function ChatModal({
  chatOpen,
  setChatOpen,
}: {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}) {
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // ---- FETCH USER ID ----
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await getFirebaseToken();
        const res = await fetch("https://chat-back-ymlq.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status && data.id) setUserId(Number(data.id));
      } catch (err) {
        console.error("Error fetching user ID:", err);
      }
    };
    fetchUserId();
  }, []);




  // ---- FETCH FRIENDS ----
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = await getFirebaseToken();
        const res = await fetch(
          "https://chat-back-ymlq.onrender.com/api/auth/get-contacts",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const mapped: Friend[] = data.users.U.map((u: any) => ({
          id: Number(u.id),
          name: u.email.split("@")[0],
          email: u.email,
          online: false,
        }));
        setFriends(mapped);
      } catch (err) {
        console.error("Error fe cnacs:", err);
      }
    };
    fetchContacts();
  }, []);

  // ---- FETCH ONLINE USERS ----
  const fetchOnlineUsers = async () => {
    try {
      const res = await fetch("https://chat-back-ymlq.onrender.com/api/auth/online-users");
      const data = await res.json();
      if (Array.isArray(data.onlineUsers)) setOnlineUsers(data.onlineUsers);
    } catch (err) {
      console.error("Error fetching online users:", err);
    }
  };

  useEffect(() => {
    if (!chatOpen) return;

    fetchOnlineUsers();
    let count = 1;
    const interval = setInterval(() => {
      if (count >= 3) {
        clearInterval(interval);
        return;
      }
      fetchOnlineUsers();
      count++;
    }, 1000);

    return () => clearInterval(interval);
  }, [chatOpen]);

  // ---- SOCKET CONNECTION ----
  useEffect(() => {
    if (!chatOpen || !userId) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://chat-back-ymlq.onrender.com", { transports: ["websocket"] } as any);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("add-user", userId);
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));

    // Real-time messages
    socket.on(
      "msg-recieve",
      (data: { from: number; message: string; id: number }) => {
        if (activeFriend && data.from === activeFriend.id) {
          setMessages((prev) => [
            ...prev,
            { id: data.id, text: data.message, fromMe: false },
          ]);
        }
      }
    );

    // Online users update
    socket.on("online-users", (data: { onlineUsers: number[] }) => {
      if (Array.isArray(data.onlineUsers)) setOnlineUsers(data.onlineUsers);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatOpen, userId, activeFriend]);

  // ---- UPDATE FRIEND ONLINE STATUS ----
  useEffect(() => {
    setFriends((prev) =>
      prev.map((f) => ({
        ...f,
        online: onlineUsers.includes(f.id),
      }))
    );
  }, [onlineUsers]);

  // ---- LOAD MESSAGES FROM LOCAL STORAGE OR FETCH ----
  useEffect(() => {
    if (!activeFriend || !userId) return;

    const stored = localStorage.getItem("chat_messages");
    if (stored) {
      try {
        const allMessages = JSON.parse(stored);
        if (allMessages[activeFriend.id]) {
          setMessages(allMessages[activeFriend.id]);
          return; // use local messages
        }
      } catch {
        localStorage.removeItem("chat_messages");
      }
    }

    // Fetch from server if no local messages
    const fetchMessages = async () => {
      try {
        const token = await getFirebaseToken();
        const res = await fetch(
          `https://chat-back-ymlq.onrender.com/api/messages/get-messages/7/${activeFriend.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const formatted = data.messages.map((m: any) => ({
          id: m.id,
          text: m.message,
          fromMe: m.senderId === userId,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [activeFriend, userId]);

  // ---- SAVE MESSAGES TO LOCAL STORAGE ----
  useEffect(() => {
    if (!activeFriend) return;

    const stored = localStorage.getItem("chat_messages");
    const allMessages = stored ? JSON.parse(stored) : {};
    allMessages[activeFriend.id] = messages;
    localStorage.setItem("chat_messages", JSON.stringify(allMessages));
  }, [messages, activeFriend]);

  // ---- SEND MESSAGE ----
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeFriend || !socketRef.current || !userId) return;

    const newMsg = { id: Date.now(), text: message, fromMe: true };
    setMessages((prev) => [...prev, newMsg]);

    socketRef.current.emit("send-msg", {
      to: activeFriend.id,
      from: userId,
      message: message,
    });

    setMessage("");
  };

  // ---- DELETE MESSAGE ----
  const deleteMessage = (msgId: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    // Optionally notify server
    if (socketRef.current && activeFriend) {
      socketRef.current.emit("delete-msg", {
        to: activeFriend.id,
        messageId: msgId,
      });
    }
  };

  if (!chatOpen) return null;

  return (
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-0"
  onClick={() => setChatOpen(false)}
>
  <div
    className="bg-gradient-to-br from-orange-200 via-white to-purple-200 w-full h-full sm:max-w-5xl sm:h-[650px] rounded-3xl shadow-2xl flex flex-col sm:flex-row overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    {/* LEFT – FRIEND LIST */}
    <div className="w-full sm:w-1/3 border-r bg-white/70 backdrop-blur flex flex-col">
      <div className="p-5 font-bold text-xl border-b bg-gradient-to-r from-orange-400 to-pink-500 text-white">
        Friends
      </div>
      <div className="flex-1 overflow-y-auto">
        {friends
          .filter((f) => f.online) // only online users on mobile
          .map((f) => (
            <div
              key={f.id}
              onClick={() => setActiveFriend(f)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                activeFriend?.id === f.id ? "bg-orange-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white shadow">
                <User size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{f.name}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Circle
                    size={10}
                    className={f.online ? "text-green-500" : "text-gray-400"}
                    fill={f.online ? "#22c55e" : "#9ca3af"}
                  />
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Save opponent for live game
                  localStorage.setItem('selectedGameOpponent', JSON.stringify({
                    id: f.id,
                    name: f.name,
                  }));
                  // Navigate to live game (you'll need to adjust this based on your routing)
                  window.location.href = '/games/math-champion'; // or your live games route
                }}
                className="text-xs px-2 py-1 bg-orange-400 hover:bg-orange-500 text-white rounded"
              >
                Play
              </button>
            </div>
          ))}
      </div>
    </div>

    {/* RIGHT – CHAT WINDOW */}
 {/* RIGHT – CHAT WINDOW */}
<div className="w-full sm:w-2/3 flex flex-col relative">
  {/* HEADER */}
  <div className="p-5 border-b bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex justify-between items-center">
    <div className="text-lg font-semibold flex items-center gap-2">
      {activeFriend ? (
        <>
          <span>{activeFriend.name}</span>
          <Circle
            size={10}
            className={activeFriend.online ? "text-green-500" : "text-gray-400"}
            fill={activeFriend.online ? "#22c55e" : "#9ca3af"}
          />
        </>
      ) : (
        "Select a friend"
      )}
    </div>
    <button
      className="text-sm px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30"
      onClick={() => setChatOpen(false)}
    >
      Close
    </button>
  </div>

  {/* MESSAGE LIST */}
{/* MESSAGE LIST */}
<div className="flex-1 overflow-y-auto p-4 sm:p-6 mb-20 flex flex-col gap-3">
  {!activeFriend && (
    <div className="text-center text-gray-500 mt-20">
      Select a friend to start chatting
    </div>
  )}
  {activeFriend &&
    messages.map((m) => (
      <div
        key={m.id}
        className={`max-w-xs px-4 py-2 rounded-2xl shadow flex justify-between items-center break-words ${
          m.fromMe
            ? "bg-blue-600 text-white ml-auto rounded-br-none"
            : "bg-white rounded-bl-none"
        }`}
      >
        <span>{m.text}</span>
        {m.fromMe && (
          <button
            onClick={() => deleteMessage(m.id)}
            className="ml-2 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    ))}
</div>


  {/* INPUT – FIXED ON MOBILE */}
  {activeFriend && (
    <form
      onSubmit={sendMessage}
      className="fixed bottom-0 left-0 w-full flex gap-2 p-2 sm:static sm:flex sm:p-4 border-t bg-white"
    >
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 border rounded-xl px-4 py-2 focus:outline-none"
        placeholder="Type a message…"
      />
      <button
        type="submit"
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow"
      >
        Send
      </button>
    </form>
  )}
</div>

  </div>
</div>

  );
}