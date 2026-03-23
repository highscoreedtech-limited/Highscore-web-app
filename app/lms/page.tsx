
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
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-all">
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
      <div
        className="fixed sm:hidden top-0 left-0 right-0 z-50 
  bg-white/80 
  backdrop-blur-md  
  border-b border-gray-200 
  flex items-center justify-between 
  px-4 sm:px-6 py-3 transition-all duration-200"
      >


        {/* Hamburger button (Mobile only) */}
        <div className="lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Spacer for center alignment */}
        <div>



        </div>

        {/* Notifications + Profile + XP */}
        {/* Notification + Profile (Mobile Only) */}
        <div className="flex sm:hidden items-center gap-4">
          {/* Notification icon */}
          <button className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.163-1.31A8.967 8.967 0 0019.5 8.25V7.5a7.5 7.5 0 10-15 0v.75a8.967 8.967 0 00-.52 7.522c1.233.51 2.58.91 4.02 1.203m6.857 0a24.255 24.255 0 01-6.857 0m6.857 0v.918a2.25 2.25 0 11-4.5 0v-.918"
              />
            </svg>
            {/* Red dot */}
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile + XP */}
          <div className="flex items-center gap-3">
            <img
              src="/path/to/icon.png"
              alt="icon"
              className="w-8 h-8 rounded-full bg-black"
            />
            <span className="text-base font-semibold text-gray-700">5 🔥</span>
          </div>
        </div>

      </div>



      {/* Main Content */}

      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 pb-24 pt-20">


        {/* Greeting Section */}
        <div className="absolute top-4 right-4 flex items-center gap-4 z-7">

          {/* Notification icon */}
          <button className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.163-1.31A8.967 8.967 0 0019.5 8.25V7.5a7.5 7.5 0 10-15 0v.75a8.967 8.967 0 00-.52 7.522c1.233.51 2.58.91 4.02 1.203m6.857 0a24.255 24.255 0 01-6.857 0m6.857 0v.918a2.25 2.25 0 11-4.5 0v-.918"
              />
            </svg>
            {/* Red notification dot */}
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <img
            src="/icon.png"
            alt="icon"
            className="w-8 h-8 rounded-full bg-black"
          />
          <span className="text-lg font-semibold">5 🔥</span>
        </div>



        <div className="mb-5 -mt-2 sm:mt-2 lg:mt-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Hello {username}👋🏼
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Ready to smash today’s goals?
          </p>

          <div className="max-w-xs mt-4 mx-auto bg-gradient-to-b from-orange-200 to-orange-400 rounded-2xl p-5 text-center shadow-lg block sm:hidden">
            <div className="text-orange-600 font-semibold flex items-center justify-center text-lg mb-2">
              <span className="text-xl mr-1">🔥</span>
              DAY 5 STREAK
            </div>

            <p className="text-sm text-gray-700 mb-4">Keep the fire burning!</p>

            {/* Centered and reduced SVG circle */}
            <div className="relative flex items-center justify-center mx-auto w-28 h-28 mb-4">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                {/* Background Circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="55"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  fill="none"
                />
                {/* Progress Circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="55"
                  stroke="#F97316"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 55}`}
                  strokeDashoffset={`${2 * Math.PI * 55 * (1 - 0.5)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>

              <div className="absolute flex items-center justify-center font-semibold text-gray-700 text-2xl">
                50%
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-5">
              20 questions to complete today’s goal
            </p>

            <button
              className="w-full bg-[#FC7B24] hover:bg-[#e86f20] text-white font-[500] py-2 rounded-xl transition-colors 
  text-[12px] leading-[20px] tracking-[0.1px] font-poppins text-center align-middle"
            >
              Tap to continue your streak
            </button>

          </div>

        </div>










        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="space-y-8 hidden sm:block">
            {/* Streak On Fire */}
            <p className="font-medium flex font-bold mt-4 items-center justify-start gap-1 ml-4 sm:ml-0">
              <Flame className="w-4 h-4 text-orange-500" /> Streak On Fire!
            </p>

            <div className="relative w-40 h-40 sm:w-48 sm:h-48 ml-20">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                {/* Background Circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="#E5E7EB"
                  strokeWidth="2"  // thinner background stroke
                  fill="none"
                />
                {/* Progress Circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="#F97316"
                  strokeWidth="2"  // thinner progress stroke
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - 0.5)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center font-semibold text-gray-700 text-3xl">
                50%
              </div>
            </div>

            <div className=" rounded-2xl p-6  flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">






                <p className="text-sm  mt-4  text-gray-500 mt-4 leading-relaxed">
                  50% of your daily study goal achieved 🔥 <br />
                  Just 20 more questions to hit 100%! 💪🏽 <br />
                  Almost there... Don’t break your streak 🔥
                </p>
              </div>


            </div>

            {/* only visible on larger screen */}
            <div className="rounded-2xl p-6 bg-white hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-800">🔴 Daily Challenge</h2>
              <p className="text-sm text-gray-500 mb-4">
                Complete today’s task and earn rewards!
              </p>

              <p className="text-sm text-gray-700 font-medium mb-2">
                Answer 20 English Questions
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "50%" }} />
              </div>

              <p className="text-xs text-gray-500 mb-4">10/20 Completed</p>

              {/* center button horizontally on every screen size where visible */}
              <div className="flex justify-center">
                <button
                  className="text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-300 hover:opacity-90"
                  style={{
                    background: "linear-gradient(180deg, #FF9053 0%, #DB5206 100%)",
                  }}
                >
                  Start Challenge
                </button>

              </div>
            </div>


          </div>

          {/* Right Section */}
          <div className="space-y-8  min-h-[800px]">
            {/* Daily Challenge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { title: "Video Tutorials", img: "/tutorials.jpg", link: "/courses" },
                { title: "CBT Practice", img: "/cbt.jpg", link: "courses/CBT-PRACTICE" },   // ✅ add link here
                { title: "AI Tutor", img: "/ai.jpg" },
                { title: "Quiz Games", img: "/quiz.jpg" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (item.link) router.push(item.link);   // ✅ navigate when link exists
                  }}
                  className="relative group rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] group-hover:bg-black/30 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-base sm:text-lg font-semibold">
                    {item.title}
                  </div>
                </button>
              ))}

            </div>

            <div className="rounded-2xl p-6 bg-white block sm:hidden">
              <h2 className="text-lg font-semibold text-gray-800">🔴 Daily Challenge</h2>
              <p className="text-sm text-gray-500 mb-4">
                Complete today’s task and earn rewards!
              </p>

              <p className="text-sm text-gray-700 font-medium mb-2">
                Answer 20 English Questions
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "50%" }} />
              </div>

              <p className="text-xs text-gray-500 mb-4">10/20 Completed</p>

              {/* Center button horizontally */}
              <div className="flex justify-center">
                <button
                  className="text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-300 hover:opacity-90"
                  style={{
                    background: "linear-gradient(180deg, #FF9053 0%, #DB5206 100%)",
                  }}
                >
                  Start Challenge
                </button>

              </div>
            </div>







            <div className="rounded-2xl bg-white shadow p-4">


              <p className="text-sm text-gray-500 mb-3">
                You’re ranked{" "}
                <span className="font-semibold text-gray-700">#12</span> in Lagos — keep climbing!
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">🏆 Leaderboard</h2>



              <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                {leaderboard.map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between text-sm rounded-lg px-4 py-2 ${index < 3 ? "bg-yellow-50" : "bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <span
                        className={`font-bold w-5 text-center ${index === 0
                          ? "text-yellow-600"
                          : index === 1
                            ? "text-gray-600"
                            : index === 2
                              ? "text-amber-700"
                              : "text-gray-700"
                          }`}
                      >
                        {index + 1}
                      </span>

                      {/* Avatar (Tailwind only) */}
                      <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200 flex items-center justify-center">
                        <img
                          src={user.image || "https://i.pravatar.cc/40?u=default"}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "https://i.pravatar.cc/40?u=fallback";
                          }}
                        />
                      </div>


                      {/* Name */}
                      <span className="text-gray-800 font-medium">{user.name}</span>
                    </div>

                    <span className="font-semibold text-gray-700">{user.xp} XP</span>
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
