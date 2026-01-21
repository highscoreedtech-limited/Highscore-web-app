import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, Zap, Trophy } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { io, Socket } from "socket.io-client";
import type { User } from './types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getFirebaseToken } from '@/lib/getFirebaseToken';

interface MatchSimulationProps {
  user: User;

  authid: string;
  gameMode: string;
  subjects: string[];
  onGameStart: (opponentId: number) => void;
  onBack: () => void;
}

const MatchSimulation: React.FC<MatchSimulationProps> = ({
  user,
  authid,
  gameMode,
  subjects,
  onGameStart,
  onBack
}) => {
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [foundMatch, setFoundMatch] = useState(false);
  const [opponents, setOpponents] = useState<Array<{
    name: string;
    avatar: string;
    rank: string;
    rating: number;
    id?: number;
  }>>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [username, setUsername] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [friends, setFriends] = useState<Array<{ id: number; name: string; email: string }>>([]);
  const [selectedOpponentId, setSelectedOpponentId] = useState<number | null>(null);




  // ---- FETCH NUMERIC CHAT USER ID (same as chat page) ----
useEffect(() => {
  const fetchChatId = async () => {
    try {
      const token = await getFirebaseToken(); // ✅ gets fresh token, refreshes if expired
      const res = await fetch("https://chat-back-ymlq.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status && data.id) {
        setChatId(Number(data.id));
        console.log("[MatchSimulation] Got chatId from backend:", data.id);
      }
    } catch (err) {
      console.error("[MatchSimulation] Error fetching chat user ID:", err);
    }
  };

  fetchChatId();
}, []);


  // ---- SOCKET.IO REAL-TIME ONLINE USERS (same logic as chat) ----
  useEffect(() => {
    if (!chatId) {
      console.warn("[MatchSimulation] No chatId for socket connection!");
      return;
    }

    const socket = io("https://chat-back-ymlq.onrender.com", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[MatchSimulation] Socket connected, emitting add-user:", chatId);
      socket.emit("add-user", chatId);
    });

    socket.on("online-users", (data) => {
      console.log("[MatchSimulation] Socket online-users event:", data);
      if (Array.isArray(data.onlineUsers)) {
        setOnlineUsers(data.onlineUsers);
      } else {
        setOnlineUsers([]);
        console.warn("[MatchSimulation] online-users event did not return an array:", data.onlineUsers);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("[MatchSimulation] Socket disconnected:", reason);
    });
    socket.on("reconnect", (attempt) => {
      console.log("[MatchSimulation] Socket reconnected:", attempt);
      socket.emit("add-user", chatId);
    });

    // Log socket initialization for debugging
    console.log("[MatchSimulation] Socket connection effect initialized. chatId:", chatId);

    return () => {
      console.log("[MatchSimulation] Disconnecting socket...");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatId]);

  // Show online users for debugging
  useEffect(() => {
    console.log("[MatchSimulation] Current online users:", onlineUsers);
  }, [onlineUsers]);

  function formatRank(rank: string) {
  if (!rank) return "Bronze";
  return rank.charAt(0).toUpperCase() + rank.slice(1).toLowerCase();
}

  // Set opponents directly from online users (excluding self)
  const socketInitialized = useRef(false);
useEffect(() => {
  if (!chatId || socketInitialized.current) return;

  socketInitialized.current = true; // mark socket as initialized

  const socket = io("https://chat-back-ymlq.onrender.com", {
    transports: ["websocket"],
  });

  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("[MatchSimulation] Socket connected, emitting add-user:", chatId);
    socket.emit("add-user", chatId);
  });

  socket.on("online-users", (data) => {
    if (Array.isArray(data.onlineUsers)) {
      setOnlineUsers(data.onlineUsers);
    } else {
      console.warn("[MatchSimulation] online-users event did not return array:", data.onlineUsers);
      setOnlineUsers([]);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("[MatchSimulation] Socket disconnected:", reason);
  });

  socket.on("reconnect", () => {
    console.log("[MatchSimulation] Socket reconnected, re-emitting add-user:", chatId);
    socket.emit("add-user", chatId);
  });

  return () => {
    console.log("[MatchSimulation] Disconnecting socket...");
    socket.disconnect();
    socketRef.current = null;
    socketInitialized.current = false;
  };
}, [chatId]);


useEffect(() => {
  if (!chatId || onlineUsers.length === 0 || friends.length === 0) return;

  const filtered = onlineUsers
    .filter(id => id !== chatId)
    .map(id => {
      const friend = friends.find(f => f.id === id);
      return {
        id,
        name: friend ? friend.name : `User ID: ${id}`,
        avatar: "🙂",
        rank: "Unknown",
        rating: 0,
      };
    });

  setOpponents(filtered);
  console.log("[MatchSimulation] Mapped opponents from online users:", filtered);
}, [chatId, onlineUsers, friends]);




  

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return 'text-orange-400';
      case 'silver': return 'text-gray-300';
      case 'gold': return 'text-yellow-400';
      case 'platinum': return 'text-amber-400';
      case 'diamond': return 'text-orange-300';
      case 'master': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
    
  };
function getRank(xp: number) {
  if (xp >= 3500) return "Legend";
  if (xp >= 2500) return "Grandmaster";
  if (xp >= 1500) return "Master";
  if (xp >= 800) return "Diamond";
  if (xp >= 500) return "Gold";
  if (xp >= 300) return "Silver";
  return "Bronze";
}

  // Fetch friends (contacts) for mapping chatId to username
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(
          "https://chat-back-ymlq.onrender.com/api/auth/get-contacts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        const mapped = data.users.U.map((u: any) => ({
          id: Number(u.id),
          name: u.email.split("@")[0],
          email: u.email,
        }));
        setFriends(mapped);
        console.log("[MatchSimulation] Fetched friends for username mapping:", mapped);
      } catch (err) {
        console.error("[MatchSimulation] Error fetching friends:", err);
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#04101F]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Finding Match</h1>
          <div></div>
        </div>

        {/* Game Info */}
        <div className="bg-[#1B1B1B] backdrop-blur-md rounded-2xl p-6 mb-8 border border-orange-400/30">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-orange-300 mb-2">
              Game Mode: {gameMode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <div className="flex justify-center flex-wrap gap-2">
              {subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-br from-orange-400 to-yellow-400 text-black rounded-full text-sm font-semibold"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Your Profile */}
          <div className="bg-[#1B1B1B]/60 rounded-xl p-4 mb-6 border border-orange-400/30">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" />

              {username}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-xl">
                {user.avatar}
              </div>
              <div>
                <p className="text-white font-medium">{user.displayName}</p>
                <p className={`text-sm ${getRankColor(user.rank)}`}>{user.rank}</p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{user.xp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Show online users for debugging (display usernames, not just IDs) */}
   

        {/* Opponents (now always from online users) */}
        <div className="bg-[#1B1B1B] backdrop-blur-md rounded-2xl p-8 border border-orange-400/30">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {opponents.length > 0 ? "Online Opponents" : "No Opponents Online"}
            </h2>
            <p className="text-gray-300">
              {opponents.length > 0
                ? "Get ready to battle these online users"
                : "Waiting for other users to come online..."}
            </p>
          </div>

          {/* Opponents List */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {opponents.length > 0 ? (
              opponents.map((opponent, idx) => (
                <button
                  key={idx}
                  className={`bg-[#232323] rounded-xl p-4 flex flex-col items-center w-40 border transition-all duration-200
                    border-orange-400/20
                    ${selectedOpponentId === opponent.id ? 'ring-2 ring-orange-400 scale-105' : ''}`}
                  onClick={() => setSelectedOpponentId(opponent.id ?? null)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-xl mb-2">
                    {opponent.avatar}
                  </div>
                  <p className="text-white font-medium mb-1">{opponent.name}</p>
                  <p className={`text-sm ${getRankColor(opponent.rank)}`}>{formatRank(opponent.rank)}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{opponent.rating}</span>
                  </div>
                  <span className="mt-2 text-xs text-orange-400">ID: {opponent.id}</span>
                  {selectedOpponentId === opponent.id && (
                    <span className="mt-1 text-green-400 font-bold">Selected</span>
                  )}
                </button>
              ))
            ) : (
              <span className="text-gray-400">No opponents online</span>
            )}
          </div>
        </div>
        
           
          </div>

           <div className="text-center">
              <button
                onClick={() => selectedOpponentId && onGameStart(selectedOpponentId)}
                className={`bg-gradient-to-br from-orange-400 to-yellow-400 text-black font-bold py-4 px-8 rounded-xl transition-all duration-200 transform shadow-lg hover:scale-105 hover:from-orange-500 hover:to-yellow-500 hover:shadow-2xl ${selectedOpponentId ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!selectedOpponentId}
              >
                {selectedOpponentId ? 'Start Battle' : 'Select Opponent'}
              </button>
            </div>
      </div>

  );
}

export default MatchSimulation;



