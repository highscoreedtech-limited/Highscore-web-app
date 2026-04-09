
"use client";

import { useMediaQuery } from 'react-responsive'; // at the top of your file
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  Flame,
} from "lucide-react";
import FooterNav from "../components/FooterNav";
import Sidebar from "../components/Sidebar";



import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  StreakCard, 
  DailyChallengeCard, 
  CategoryCard 
} from "../components/DashboardCards";
import { Bell, Trophy, Zap, Star, Search, Menu } from "lucide-react";





export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  


  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);



  // Inside the component:

  const backgroundStyle = isDesktop
    ? { background: 'linear-gradient(to bottom, white 7%, #f3f4f6 7%)' } // desktop: larger white top
    : { background: 'linear-gradient(to bottom, white 3%, #f3f4f6 3%)' }; // mobile: smaller white area


    const [username, setUsername] = useState("");

useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user;
    console.log("Supabase user:", user);
    if (user) {
      const name = user.user_metadata?.display_name || user.email?.split("@")[0] || "User";
      console.log("Resolved username:", name);
      setUsername(name);
    }
  });
  return () => subscription.unsubscribe();
}, []);




  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);


  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);
  const leaderboard = [
    { name: "Bryan", xp: 650, image: "/images/bryan.jpg" },
    { name: "PeterInspo", xp: 500, image: "/images/peter.jpg" },
    { name: "Genesislibrary", xp: 450, image: "/images/genesis.jpg" },
    { name: "ControlEdu", xp: 320, image: "/images/control.jpg" },
    { name: "MataC", xp: 310, image: "/images/mata.jpg" },
    { name: "Bryan", xp: 650, image: "/images/bryan.jpg" },
    { name: "PeterInspo", xp: 500, image: "/images/peter.jpg" },
    { name: "Genesislibrary", xp: 450, image: "/images/genesis.jpg" },
    { name: "ControlEdu", xp: 320, image: "/images/control.jpg" },
    { name: "MataC", xp: 310, image: "/images/mata.jpg" },
  ]


  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen"
      style={backgroundStyle}
    >
      {/* Sidebar */}

      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-[#001A33] text-white flex flex-col">

        <div
          onClick={() => router.push("/")}
          className="px-6 py-4 text-2xl font-bold text-center border-b border-white/10 cursor-pointer hover:text-orange-400 transition-colors"
        >
          <span className="text-orange-500">HIGH</span>SCORE
        </div>


        <div className="p-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 rounded-lg bg-white placeholder-gray-300 text-sm focus:outline-none"
          />
        </div>

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />



        <div className="p-4 border-t border-white/10 mt-auto">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-all text-white/70 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>


      <div className="lg:hidden">
        {/* Mobile Sidebar Overlay - Must be outside scrolling content */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[55]"
              onClick={() => setSidebarOpen(false)}
            />


            {/* Sidebar Panel */}
            <div className="fixed top-0 left-0 w-64 h-full bg-[#001A33] text-white z-[60] transition-transform duration-300 translate-x-0">


              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />



              <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-all">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Hamburger button for mobile */}
      {/* Fixed Top Bar (Visible on all screens) */}
      {/* Fixed Top Nav for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-orange-600" />
        </button>
        
        <img src="/logo.png" alt="Highscore" className="h-7 w-auto" />
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
            <span className="text-sm font-bold text-orange-600">5 🔥</span>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>



      {/* Main Content */}

      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 pb-24 pt-20">


        {/* Desktop Header area */}
        <div className="hidden lg:flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-lg font-black text-gray-900 tracking-tight">
              Hello, {username || "Scholar"}👋🏼
            </h1>
            <p className="text-gray-500 font-medium">Ready to smash today’s goals?</p>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Rank</span>
              <span className="text-xl font-black text-orange-600">#12</span>
            </div>
            
            <div className="h-10 w-[1px] bg-gray-200" />
            
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-orange-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              
              <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                  {username?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">5,420 XP</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-bold text-yellow-600">Pro Member</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Greeting (Inline) */}
        <div className="lg:hidden mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Hello, {username || "Scholar"}!
          </h1>
          <p className="text-sm text-gray-500 font-medium">Continue your learning journey.</p>
        </div>










        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Left Column (Adaptive) */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-6 lg:space-y-10">
            <StreakCard streakCount={5} progress={50} />
            <DailyChallengeCard />
            
            {/* Leaderboard Podiums (New High-Visual Section) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hidden lg:block">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black text-gray-800 tracking-tight flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" /> LEADERBOARD
                </h2>
                <button className="text-xs font-bold text-orange-600 hover:underline">VIEW ALL</button>
              </div>

              {/* Podium UI */}
              <div className="flex items-end justify-center gap-4 mb-10 h-32">
                {/* 2nd Place */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden mb-2">
                    <img src={leaderboard[1].image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full bg-gray-100 h-16 rounded-t-xl flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gray-500">2nd</span>
                    <span className="text-[10px] font-bold text-gray-400 truncate w-full text-center px-1">
                      {leaderboard[1].name}
                    </span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 ring-4 ring-yellow-400/20">
                    <img src={leaderboard[0].image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 h-24 rounded-t-xl flex flex-col items-center justify-center relative shadow-lg">
                    <span className="absolute -top-3 flex items-center justify-center w-6 h-6 bg-yellow-400 rounded-full border-2 border-white text-[10px] font-black">1</span>
                    <span className="text-xs font-black text-white drop-shadow-sm">Winner</span>
                    <span className="text-[10px] font-black text-white/90 truncate w-full text-center px-1">
                      {leaderboard[0].name}
                    </span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full border-2 border-orange-300 overflow-hidden mb-2">
                    <img src={leaderboard[2].image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full bg-orange-100 h-12 rounded-t-xl flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">3rd</span>
                    <span className="text-[10px] font-bold text-orange-400 truncate w-full text-center px-1">
                      {leaderboard[2].name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini List */}
              <div className="space-y-4">
                {leaderboard.slice(3, 7).map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-gray-400 w-4">{i + 4}</span>
                      <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-gray-100">
                         <img src={user.image} alt="" className="w-full h-full object-cover rounded-[6px]" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{user.name}</span>
                    </div>
                    <span className="text-xs font-black text-orange-600">{user.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Cards) */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Video Tutorials", img: "/tutorials.jpg", link: "/courses" },
                { title: "CBT Practice", img: "/cbt.jpg", link: "courses/CBT-PRACTICE" },
                { title: "AI Tutor", img: "/ai.jpg" },
                { title: "Quiz Games", img: "/quiz.jpg" },
              ].map((item, i) => (
                <CategoryCard 
                  key={i} 
                  {...item} 
                  onClick={() => item.link && router.push(item.link)} 
                />
              ))}
            </div>

            {/* Recently Viewed or Recommended Section (New placeholder) */}
            <div className="bg-[#001A33] rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-sm">
                  <h2 className="text-2xl font-black mb-2">Ready to start?</h2>
                  <p className="text-white/60 text-sm mb-6">Complete your profile to unlock personalized question banks and track your progress better.</p>
                  <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-orange-500/30">
                    Sync Profile Now
                  </button>
                </div>
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-10 translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
            </div>

            {/* Mobile Leaderboard (Simplified) */}
            <div className="lg:hidden bg-white rounded-3xl p-6 border border-gray-100">
               <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500 fill-orange-500" /> Leaderboard
                </h2>
                <div className="space-y-4">
                {leaderboard.slice(0, 5).map((user, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black ${i < 3 ? 'text-orange-500' : 'text-gray-300'}`}>{i + 1}</span>
                      <div className="w-10 h-10 rounded-full border border-gray-100 overflow-hidden">
                        <img src={user.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{user.name}</span>
                    </div>
                    <span className="text-sm font-black text-gray-400">{user.xp} XP</span>
                  </div>
                ))}
                </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}

        <FooterNav />
      </main>
    </div>
  );
}
