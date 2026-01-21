"use client";

import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getFirebaseToken } from "@/lib/getFirebaseToken";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Clock, Zap, Trophy, Target, User, Circle, Trash2 } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: string;
  points: number;
}

interface QuestionScreenProps {
  gameMode: string;
  subjects: string[];
  onBack: () => void;
  onGameComplete: (coinsEarned: number, xpEarned: number) => void;
}

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

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  gameMode,
  subjects,
  onBack,
  onGameComplete,
}) => {
  const socketRef = useRef<Socket | null>(null);

  // --- User & opponent ---
  const [chatId, setChatId] = useState<number | null>(null);
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [opponentName, setOpponentName] = useState<string>("Opponent");

  // --- Game state ---
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameComplete, setGameComplete] = useState(false);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);

  // --- Chat state ---
  const [friends, setFriends] = useState<Friend[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  // ---------------------------
  // 1. Fetch user ID
  // ---------------------------
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await getFirebaseToken();
        const res = await fetch("https://chat-back-ymlq.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status && data.id) setChatId(Number(data.id));
      } catch (err) {
        console.error("Error fetching user ID:", err);
      }
    };
    fetchUserId();
  }, []);

  // ---------------------------
  // 2. Fetch questions
  // ---------------------------
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      let query = supabase.from("questions").select("*");
      if (subjects.length > 0) query = query.in("subject", subjects);
      const { data, error } = await query;
      if (error || !data) {
        console.error("Error fetching questions:", error);
        setLoadingQuestions(false);
        return;
      }
      const formatted = data.map((q: any) => ({
        id: q.id,
        question: q.question,
        options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
        correctAnswer: q.correct_answer,
        subject: q.subject,
        difficulty: q.difficulty,
        points: q.points,
      }));
      setQuestions(formatted);
      setLoadingQuestions(false);
    };
    fetchQuestions();
  }, [subjects]);

  // ---------------------------
  // 3. Connect socket
  // ---------------------------
  useEffect(() => {
    if (!chatId) return;

    const socket = io("https://chat-back-ymlq.onrender.com", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", chatId);
      socket.emit("add-user", chatId);
    });

    socket.on("online-users", (data) => {
      setOnlineUsers(data.onlineUsers ?? []);
    });

    socket.on("msg-recieve", (data) => {
      if (activeFriend && data.from === activeFriend.id) {
        setMessages((prev) => [...prev, { id: data.id, text: data.message, fromMe: false }]);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatId, activeFriend]);

  // ---------------------------
  // 4. Join game room
  // ---------------------------
  useEffect(() => {
    if (!socketRef.current || !chatId || questions.length === 0) return;

    socketRef.current.emit("game-join", { userId: chatId, gameMode, subjects });

    socketRef.current.on("game-room-assigned", (payload: any) => {
      setOpponentId(payload.opponentId);
      setOpponentName(payload.opponentName || "Opponent");
    });

    return () => {
      socketRef.current?.off("game-room-assigned");
    };
  }, [chatId, questions]);

  // ---------------------------
  // 5. Listen opponent progress & game-end
  // ---------------------------
  useEffect(() => {
    if (!socketRef.current || !chatId) return;

    const handleProgress = (payload: any) => {
      if (payload.from !== chatId) setOpponentProgress(payload.progress);
    };

    const handleGameEnd = () => setGameComplete(true);

    socketRef.current.on("game-progress", handleProgress);
    socketRef.current.on("game-end", handleGameEnd);

    return () => {
      socketRef.current?.off("game-progress", handleProgress);
      socketRef.current?.off("game-end", handleGameEnd);
    };
  }, [chatId]);

  // ---------------------------
  // 6. Timer
  // ---------------------------
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, gameComplete]);

  const handleTimeUp = () => {
    setShowResult(true);
    setStreak(0);
    setTimeout(() => (currentQuestion < questions.length - 1 ? nextQuestion() : endGame()), 2000);
  };

  // ---------------------------
  // 7. Handle answers
  // ---------------------------
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    if (correct) {
      setScore((prev) => prev + questions[currentQuestion].points + streak * 10);
      setStreak((prev) => prev + 1);
    } else setStreak(0);

    const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);
    setPlayerProgress(progress);

    if (socketRef.current && chatId && opponentId) {
      socketRef.current.emit("game-answer", {
        from: chatId,
        to: opponentId,
        correct,
        progress,
      });
    }

    setTimeout(() => (currentQuestion < questions.length - 1 ? nextQuestion() : endGame()), 2000);
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
  };

  const endGame = () => {
    setGameComplete(true);
    if (socketRef.current && chatId && opponentId) {
      socketRef.current.emit("game-end", { from: chatId, to: opponentId, score });
    }
    const coinsEarned = Math.floor(score / 10);
    const xpEarned = score + streak * 5;
    setTimeout(() => onGameComplete(coinsEarned, xpEarned), 3000);
  };

  // ---------------------------
  // 8. Chat helpers
  // ---------------------------
  const sendMessage = () => {
    if (!message.trim() || !activeFriend || !socketRef.current || !chatId) return;

    const newMsg: Message = { id: Date.now(), text: message, fromMe: true };
    setMessages((prev) => [...prev, newMsg]);

    socketRef.current.emit("send-msg", { to: activeFriend.id, from: chatId, message });
    setMessage("");
  };

  const deleteMessage = (msgId: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    if (socketRef.current && activeFriend) {
      socketRef.current.emit("delete-msg", { to: activeFriend.id, messageId: msgId });
    }
  };

  const getOptionClass = (index: number) => {
    if (!showResult) return selectedAnswer === index
      ? "border-orange-400 bg-orange-200/20 text-black"
      : "border-yellow-400 bg-white/10 hover:border-yellow-400 text-black";
    if (index === questions[currentQuestion].correctAnswer)
      return "border-green-400 bg-green-200/20 text-green-700";
    if (selectedAnswer === index && index !== questions[currentQuestion].correctAnswer)
      return "border-red-400 bg-red-200/20 text-red-700";
    return "border-gray-500/20 bg-gray-500/10 text-gray-700";
  };

  // ---------------------------
  // 9. Render
  // ---------------------------
  if (loadingQuestions)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04101F] text-white">
        Loading questions...
      </div>
    );

  if (!questions.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04101F] text-white">
        Subjects not available.
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#04101F] flex flex-col md:flex-row gap-4">
      {/* --- Left: Quiz --- */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-yellow-400">Playing against: {opponentName}</div>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="font-medium">Quit</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-white" />
              <span className={`font-bold text-lg ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-white"}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-bold">{streak}</span>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-[#1B1B1B] backdrop-blur-md rounded-xl p-4 mb-6 border border-yellow-400">
          <div className="flex justify-between items-center mb-4 text-white font-medium">
            <span>You</span>
            <span>{opponentName}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${playerProgress}%` }}
                />
              </div>
            </div>
            <div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${opponentProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#1B1B1B] backdrop-blur-md rounded-2xl p-8 border border-yellow-400">
          <div className="flex justify-between items-center mb-6 text-white">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{questions[currentQuestion].subject}</span>
              <span className="px-2 py-1 bg-yellow-400 text-black rounded text-xs">
                {questions[currentQuestion].difficulty}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
            {questions[currentQuestion].question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left transform hover:scale-102 ${getOptionClass(index)}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      showResult && index === questions[currentQuestion].correctAnswer
                        ? "bg-green-400 text-black"
                        : showResult && selectedAnswer === index && index !== questions[currentQuestion].correctAnswer
                        ? "bg-red-400 text-black"
                        : "bg-yellow-400/20 text-black"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-white">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6 text-center text-white">
              {selectedAnswer === questions[currentQuestion].correctAnswer ? (
                <div className="text-green-400">
                  <p className="text-xl font-bold mb-2">Correct! 🎉</p>
                  <p className="text-sm">+{questions[currentQuestion].points + streak * 10} points</p>
                </div>
              ) : (
                <div className="text-red-400">
                  <p className="text-xl font-bold mb-2">Wrong! 😞</p>
                  <p className="text-sm">
                    Correct answer: {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- Right: Live Chat --- */}
      <div className="w-full md:w-1/3 flex flex-col bg-white/80 backdrop-blur rounded-xl border overflow-hidden">
        <div className="p-4 font-bold text-lg border-b bg-gradient-to-r from-orange-400 to-pink-500 text-white">
          Live Chat
        </div>
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
          {!activeFriend && <div className="text-center text-gray-500 mt-20">Select a friend to chat</div>}
          {activeFriend &&
            messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-xs px-4 py-2 rounded-2xl shadow flex justify-between items-center break-words ${
                  m.fromMe ? "bg-blue-600 text-white ml-auto rounded-br-none" : "bg-white rounded-bl-none"
                }`}
              >
                <span>{m.text}</span>
                {m.fromMe && (
                  <button onClick={() => deleteMessage(m.id)} className="ml-2 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
        </div>
        {activeFriend && (
          <div className="p-3 border-t flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Type message..."
            />
            <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionScreen;
