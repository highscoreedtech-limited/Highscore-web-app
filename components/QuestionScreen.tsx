"use client";

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/lib/providers/SocketProvider';
import { getFirebaseToken } from '@/lib/getFirebaseToken';
import { ArrowLeft, Clock, Zap, Trophy, Target } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

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

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  gameMode,
  subjects,
  onBack,
  onGameComplete,
}) => {
  const { socket } = useSocket();
  const [chatId, setChatId] = useState<number | null>(null);
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [opponentName, setOpponentName] = useState<string>('Opponent');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);

  // --- Fetch questions ---
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      console.log('[QuestionScreen] Fetching questions for subjects:', subjects);
      let query = supabase.from("questions").select("*");
      if (subjects && subjects.length > 0) {
        query = query.in("subject", subjects);
      }
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
      console.log('[QuestionScreen] Questions loaded:', formatted);
      setQuestions(formatted);
      setLoadingQuestions(false);
    };
    fetchQuestions();
  }, [subjects]);

  // --- Fetch chatId ---
  useEffect(() => {
    const fetchChatId = async () => {
      const token = await getFirebaseToken();
      console.log('[QuestionScreen] Fetching chatId with token:', token);
      const res = await fetch("https://chat-back-ymlq.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log('[QuestionScreen] chatId response:', data);
      if (data?.id) setChatId(Number(data.id));
    };
    fetchChatId();
  }, []);

  // --- Join game room ---
  useEffect(() => {
    if (!socket || !chatId || questions.length === 0) return;
    console.log('[QuestionScreen] Emitting game-join:', { userId: chatId, gameMode, subjects });
    socket.emit("game-join", { userId: chatId, gameMode, subjects });

    socket.on("game-room-assigned", (payload: any) => {
      console.log('[QuestionScreen] game-room-assigned:', payload);
      setOpponentId(payload.opponentId);
      setOpponentName(payload.opponentName || 'Opponent');
    });

    return () => {
      socket.off("game-room-assigned");
    };
  }, [socket, chatId, questions]);

  // --- Listen to opponent progress & game end ---
  useEffect(() => {
    if (!socket || !chatId) return;

    const handleProgress = (payload: any) => {
      console.log('[QuestionScreen] Received game-progress:', payload);
      if (payload.from !== chatId) {
        setOpponentProgress(payload.progress);
      }
    };

    const handleGameEnd = (payload: any) => {
      console.log('[QuestionScreen] Received game-end:', payload);
      setGameComplete(true);
    };

    socket.on("game-progress", handleProgress);
    socket.on("game-end", handleGameEnd);

    return () => {
      socket.off("game-progress", handleProgress);
      socket.off("game-end", handleGameEnd);
    };
  }, [socket, chatId]);

  // --- Timer ---
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameComplete) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        console.log('[QuestionScreen] Timer tick:', timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      console.log('[QuestionScreen] Time up!');
      handleTimeUp();
    }
  }, [timeLeft, showResult, gameComplete]);

  const handleTimeUp = () => {
    console.log('[QuestionScreen] handleTimeUp called');
    setShowResult(true);
    setStreak(0);
    setTimeout(() => {
      currentQuestion < questions.length - 1 ? nextQuestion() : endGame();
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    console.log('[QuestionScreen] handleAnswerSelect:', { answerIndex });
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    if (correct) {
      const points = questions[currentQuestion].points + (streak * 10);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      console.log('[QuestionScreen] Correct answer! Score:', score + points, 'Streak:', streak + 1);
    } else {
      setStreak(0);
      console.log('[QuestionScreen] Wrong answer. Streak reset.');
    }

    const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);
    setPlayerProgress(progress);
    console.log('[QuestionScreen] Emitting game-answer:', { from: chatId, to: opponentId, correct, progress });
    if (socket && chatId && opponentId) {
      socket.emit("game-answer", {
        from: chatId,
        to: opponentId,
        correct,
        progress,
      });
    }

    setTimeout(() => {
      currentQuestion < questions.length - 1 ? nextQuestion() : endGame();
    }, 2000);
  };

  const nextQuestion = () => {
    console.log('[QuestionScreen] Moving to next question:', currentQuestion + 1);
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
  };

  const endGame = () => {
    console.log('[QuestionScreen] endGame called. Final score:', score, 'Streak:', streak);
    setGameComplete(true);
    if (socket && chatId && opponentId) {
      console.log('[QuestionScreen] Emitting game-end:', { from: chatId, to: opponentId, score });
      socket.emit("game-end", { from: chatId, to: opponentId, score });
    }
    const coinsEarned = Math.floor(score / 10);
    const xpEarned = score + (streak * 5);
    setTimeout(() => {
      console.log('[QuestionScreen] onGameComplete called:', { coinsEarned, xpEarned });
      onGameComplete(coinsEarned, xpEarned);
    }, 3000);
  };

  const getOptionClass = (index: number) => {
    if (!showResult) return selectedAnswer === index
      ? 'border-orange-400 bg-orange-200/20 text-black'
      : 'border-yellow-400 bg-white/10 hover:border-yellow-400 text-black';
    if (index === questions[currentQuestion].correctAnswer) return 'border-green-400 bg-green-200/20 text-green-700';
    if (selectedAnswer === index && index !== questions[currentQuestion].correctAnswer) return 'border-red-400 bg-red-200/20 text-red-700';
    return 'border-gray-500/20 bg-gray-500/10 text-gray-700';
  };

  if (loadingQuestions) return (
    <div className="min-h-screen flex items-center justify-center bg-[#04101F] text-white">Loading questions...</div>
  );

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center bg-[#04101F] text-white">Subjects Not available.</div>
  );

  if (gameComplete) return (
    <div className="min-h-screen p-4 md:p-6 flex items-center justify-center bg-[#04101F]">
      <div className="bg-[#1B1B1B] backdrop-blur-md rounded-2xl p-8 text-center border border-yellow-400 max-w-md w-full">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Game Complete!</h2>
        <div className="space-y-4 mb-6 text-white">
          <div className="flex justify-between"><span>Final Score:</span><span className="text-yellow-400 font-bold text-2xl">{score}</span></div>
          <div className="flex justify-between"><span>Best Streak:</span><span className="text-yellow-400 font-bold">{streak}</span></div>
          <div className="flex justify-between"><span>Coins Earned:</span><span className="text-yellow-400 font-bold">{Math.floor(score / 10)}</span></div>
          <div className="flex justify-between"><span>XP Earned:</span><span className="text-yellow-400 font-bold">{score + (streak * 5)}</span></div>
        </div>
        <div className="animate-pulse text-yellow-400">Returning to dashboard...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#04101F]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-yellow-400">Playing against: {opponentName}</div>
          <button onClick={onBack} className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-medium">Quit</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-white" />
              <span className={`font-bold text-lg ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
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
                <div className="bg-gradient-to-r from-orange-400 to-yellow-400 h-3 rounded-full transition-all duration-500" style={{ width: `${playerProgress}%` }} />
              </div>
            </div>
            <div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500" style={{ width: `${opponentProgress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-[#1B1B1B] backdrop-blur-md rounded-2xl p-8 border border-yellow-400">
          <div className="flex justify-between items-center mb-6 text-white">
            <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{questions[currentQuestion].subject}</span>
              <span className="px-2 py-1 bg-yellow-400 text-black rounded text-xs">{questions[currentQuestion].difficulty}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">{questions[currentQuestion].question}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerSelect(index)} disabled={showResult} className={`p-4 rounded-lg border-2 transition-all duration-200 text-left transform hover:scale-102 ${getOptionClass(index)}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    showResult && index === questions[currentQuestion].correctAnswer
                      ? 'bg-green-400 text-black'
                      : showResult && selectedAnswer === index && index !== questions[currentQuestion].correctAnswer
                      ? 'bg-red-400 text-black'
                      : 'bg-yellow-400/20 text-black'
                  }`}>{String.fromCharCode(65 + index)}</div>
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
                  <p className="text-sm">+{questions[currentQuestion].points + (streak * 10)} points</p>
                  {streak > 0 && <p className="text-xs text-yellow-400">Streak bonus: +{streak * 10}</p>}
                </div>
              ) : (
                <div className="text-red-400">
                  <p className="text-xl font-bold mb-2">Wrong! 😞</p>
                  <p className="text-sm">The correct answer was: {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
