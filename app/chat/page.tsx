"use client";

import { useEffect, useState } from "react";
import { User, Circle } from "lucide-react";

interface Friend {
  id: string | number;
  name: string;
  online?: boolean;
}

interface Message {
  text: string;
  fromMe?: boolean;
}

export default function ChatModal({
  chatOpen,
  setChatOpen
}: {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}) {




  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  
  const [friends, setFriends] = useState<Friend[]>([]);


    // 🔥 FETCH CONTACTS FROM BACKEND
  useEffect(() => {
    if (!chatOpen) return;

    const fetchContacts = async () => {
      try {
        const res = await fetch(
          "https://chat-back-ymlq.onrender.com/api/auth/get-contacts"
        );

        const data = await res.json();

        // data.users.U is the array
 const mappedFriends: Friend[] = data.users.U.map((u: any) => ({
  id: u.id,
  name: u.email.split("@")[0],   // 👈 only text before @
  email: u.email,
  online: false
}));


        setFriends(mappedFriends);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, [chatOpen]);



  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages(prev => [...prev, { text: message, fromMe: true }]);
    setMessage("");
  };

  if (!chatOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => setChatOpen(false)}
    >
      <div
        className="bg-gradient-to-br from-orange-200 via-white to-purple-200 w-full max-w-5xl h-[650px] rounded-3xl shadow-2xl flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT – FRIEND LIST */}
{/* LEFT – FRIEND LIST */}
<div className="w-1/3 border-r bg-white/70 rounded-l-3xl backdrop-blur flex flex-col">
  <div className="p-5 font-bold text-xl border-b bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-tl-3xl">
    Friends
  </div>

  {/* Scrollable area */}
  <div className="flex-1 overflow-y-auto">
    {friends.length === 0 && (
      <div className="p-6 text-center text-gray-500">
        No friends yet
      </div>
    )}

    {friends.map(f => (
      <div
        key={f.id}
        onClick={() => setActiveFriend(f)}
        className={`p-4 flex items-center gap-3 cursor-pointer transition ${
          activeFriend?.id === f.id
            ? "bg-orange-100"
            : "hover:bg-gray-100"
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
            {f.online ? "Online" : "Offline"}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* RIGHT – CHAT WINDOW */}
        <div className="w-2/3 flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b bg-gradient-to-r from-purple-500 to-indigo-500 rounded-tr-3xl text-white flex justify-between items-center">
            <div className="text-lg font-semibold">
              {activeFriend ? activeFriend.name : "Select a friend"}
            </div>

            <button
              className="text-sm px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30"
              onClick={() => setChatOpen(false)}
            >
              Close
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {!activeFriend && (
              <div className="text-center text-gray-500 mt-20">
                Select a friend to start chatting
              </div>
            )}

            {activeFriend && messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-xs p-3 rounded-2xl shadow ${
                  m.fromMe
                    ? "bg-blue-600 text-white ml-auto rounded-br-none"
                    : "bg-white rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          {activeFriend && (
            <form onSubmit={sendMessage} className="p-4 border-t bg-white rounded-b-3xl flex gap-2">
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
