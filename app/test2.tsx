"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Brain,
  GamepadIcon,
  Play,
  Trophy,
  Users,
  Menu,
  X,
  Bot,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  function onHandleGameClick() {
    if (user) {
      router.push("/games1");
    } else {
      router.push("/login");
    }
    setIsMenuOpen(false);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/40 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-blue-200/50 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                <Image
                  src="/highscore-logo-final.png"
                  alt="HighScore Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              HighScore<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {["Tutorials", "CBT Practice", "Games"].map((item) => {
              const href = item === "Tutorials" ? "/courses" : 
                           item === "CBT Practice" ? "/courses/CBT-PRACTICE" : "/games1";
              
              if (item === "Games") {
                return (
                  <button
                    key={item}
                    onClick={onHandleGameClick}
                    className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative group py-2"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                  </button>
                );
              }
              return (
                <Link
                  key={item}
                  href={href}
                  className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative group py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}

            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all duration-300"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                  Log in
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform active:scale-95">
                    Sign up free
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                <Link href="/courses" className="text-lg font-semibold p-3 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>Tutorials</Link>
                <Link href="/courses/CBT-PRACTICE" className="text-lg font-semibold p-3 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>CBT Practice</Link>
                <button onClick={onHandleGameClick} className="text-lg font-semibold p-3 rounded-xl hover:bg-slate-50 text-left">Games</button>
                <hr className="my-2 border-slate-100" />
                {user ? (
                  <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 font-bold" onClick={() => setIsMenuOpen(false)}>
                    <User className="w-5 h-5" /> Dashboard
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl">Log in</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full rounded-xl bg-blue-600">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-32 pb-24 px-6 overflow-hidden z-20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7"
            >
              <motion.div 
                variants={itemVariants} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-200/50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Nigerian Exam Prep #1 Platform</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants} 
                className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter"
              >
                Conquer JAMB <br />
                <span className="relative">
                  With Precision<span className="text-blue-600">.</span>
                  <svg className="absolute -bottom-1 left-0 w-full h-2 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 2, 50 5 T 100 5" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p 
                variants={itemVariants} 
                className="text-lg lg:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl font-medium"
              >
                Advanced academic preparation for the modern age. Interactive tutorials, 
                CBT mastery, and gamified growth in one unified workspace.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
                <Link href="/signup">
                  <Button size="lg" className="rounded-2xl px-12 py-8 text-xl bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 font-bold group">
                    Start Your Path
                    <Zap className="w-5 h-5 ml-2 fill-white group-hover:animate-bounce" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="rounded-2xl px-12 py-8 text-xl border-2 border-slate-200 hover:bg-white hover:border-blue-600 transition-all backdrop-blur-sm font-bold">
                    <Play className="w-5 h-5 mr-3 fill-slate-900" />
                    See How It Works
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-16 flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-14 h-14 rounded-2xl border-4 border-white bg-slate-200 overflow-hidden shadow-xl rotate-3 first:rotate-0 last:-rotate-3 hover:rotate-0 transition-transform">
                      <Image src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Successful Student" width={56} height={56} />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => <Trophy key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                  </div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                    Empowering <span className="text-slate-900">50,000+</span> High Achievers
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "circOut", delay: 0.6 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(37,99,235,0.25)] border-[12px] border-white/80 backdrop-blur-sm">
                <Image
                  src="/hero-students-computers.png"
                  alt="HighScore Learning Environment"
                  width={600}
                  height={800}
                  className="object-cover w-full scale-105 hover:scale-100 transition-transform duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent" />
              </div>

              {/* Decorative Tech Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-12 -right-12 w-48 h-48 border-2 border-dashed border-blue-200 rounded-full -z-10"
              />
              
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-100/50 backdrop-blur-xl rounded-full -z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>


      {/* Premium Features Bento Grid */}
      <section className="py-32 px-6 bg-slate-50/50 relative z-10 transition-colors duration-500">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
              A Unified Ecosystem <br />
              <span className="text-blue-600">for Academic Growth.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              We've synthesized complex study patterns into a seamless, 
              high-performance toolkit designed for Nigerian students.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto lg:h-[900px]">
            {/* 1. Main Feature: Video Tutorials (Large) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[3rem] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-12 h-full flex flex-col relative z-20">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                  <Play className="w-7 h-7 text-white fill-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-4">Expert Video Tutorials</h3>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                  Immerse yourself in high-definition video lessons covering the entire JAMB & SSCE syllabus.
                </p>
                <div className="mt-auto">
                  <Link href="/courses">
                    <Button size="lg" className="rounded-2xl px-8 py-6 bg-slate-900 hover:bg-blue-600 transition-all font-bold">
                      Explore Library
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10 group-hover:bg-blue-200/50 transition-colors" />
            </motion.div>

            {/* 2. CBT Practice (Wide) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 group relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 p-10 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-700"
            >
              <div className="relative z-20">
                <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-400/30">
                  <Brain className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Precision CBT Simulation</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium">
                  Practice with the exact interface of the JAMB exam. 
                  Timed, realistic, and psychologically prepared.
                </p>
              </div>
              <Link href="/courses/CBT-PRACTICE" className="mt-8 relative z-20">
                <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all">
                  Start Simulation
                </Button>
              </Link>
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
            </motion.div>

            {/* 3. Gaming (Small) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-[3rem] bg-orange-100 border border-orange-200 p-8 flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 shadow-sm"
            >
              <div>
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-orange-200">
                  <GamepadIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-orange-950 mb-3">Quiz Arena</h3>
                <p className="text-orange-900/70 text-sm font-bold uppercase tracking-tight">Gamified learning</p>
              </div>
              <Link href="/games1">
                <Button variant="ghost" className="p-0 text-orange-600 font-black hover:bg-transparent hover:translate-x-1 transition-transform">
                  Play Now →
                </Button>
              </Link>
            </motion.div>

            {/* 4. LMS (Small) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative overflow-hidden rounded-[3rem] bg-emerald-50 border border-emerald-100 p-8 flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 shadow-sm"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-emerald-950 mb-3">LMS Groups</h3>
                <p className="text-emerald-900/70 text-sm font-bold uppercase tracking-tight">Collaborative space</p>
              </div>
              <Link href="/lms">
                <Button variant="ghost" className="p-0 text-emerald-600 font-black hover:bg-transparent hover:translate-x-1 transition-transform">
                  Join Peers →
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Refined Stats Section */}
      <section className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden z-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
                  Real Impact. <br />
                  <span className="text-blue-400 font-medium">Proven Success.</span>
                </h2>
                <p className="text-lg lg:text-xl text-slate-400 leading-relaxed mb-12 max-w-lg font-medium">
                  We engineer high-performance outcomes for Nigerian students.
                </p>
                
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: "Active Learners", value: "50,000+", icon: <Users className="w-6 h-6" /> },
                    { label: "Distinction Rate", value: "95%", icon: <Trophy className="w-6 h-6" /> },
                    { label: "HD Tutorials", value: "1,000+", icon: <Play className="w-6 h-6" /> },
                    { label: "CBT Bank", value: "20k+", icon: <Brain className="w-6 h-6" /> },
                  ].map((stat) => (
                    <div key={stat.label} className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-500">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-black mb-1 tracking-tighter">{stat.value}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-widest font-black">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-[4rem] overflow-hidden border-[16px] border-white/5 shadow-2xl relative group">
                  <Image 
                    src="/hero-students-computers.png" 
                    alt="HighScore Success Story" 
                    width={800} 
                    height={600} 
                    className="object-cover w-full h-full scale-110 group-hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                      <p className="text-lg italic text-white mb-6 font-medium leading-relaxed">
                        "HighScore transitioned my study habits from effort-based to result-based. The interface is elite."
                      </p>
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500 overflow-hidden ring-4 ring-white/10">
                          <Image src="https://i.pravatar.cc/100?img=32" alt="Top Student" width={56} height={56} />
                        </div>
                        <div>
                          <p className="font-black text-lg">Chidi Opara</p>
                          <p className="text-sm text-blue-400 font-bold uppercase tracking-widest">UTME Score: 312</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Modern Pricing */}
      <section className="py-32 px-6 bg-white relative z-20">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
              Invest in your <br />
              <span className="text-blue-600 font-medium whitespace-nowrap">Academic Future.</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 font-medium">
              Elite preparation, accessible price points.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Student Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[4rem] bg-slate-900 p-12 lg:p-16 shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)] shadow-blue-900/10 flex flex-col group border border-slate-800"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/20 transition-colors" />
              
              <div className="mb-10 relative z-10">
                <div className="inline-block px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                  For Individual Scholars
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-white mb-4">Mastery Pack</h3>
                <p className="text-lg text-slate-400 leading-relaxed font-medium">Empowering independent learners with professional-grade tools.</p>
              </div>

              <div className="space-y-4 mb-12 flex-grow relative z-10">
                {[
                  "Unlimited Video Library",
                  "Reality-Match CBT Mock Exams",
                  "Gamified Quiz Arena Access",
                  "Advanced Performance Analytics",
                  "Mobile-First Offline Access",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-300 text-base font-medium">
                    <div className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Zap className="w-3 h-3" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-3xl p-8 mb-10 border border-white/10 relative z-10 group-hover:bg-white/10 transition-all">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-3">Power User (3 Months)</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white">₦6,999</span>
                      <span className="text-slate-500 line-through text-lg font-medium">₦15,000</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 text-[11px] font-black bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">SAVE ₦8k+</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Monthly</p>
                    <p className="text-base font-black text-white">₦2,999</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-center">
                    <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">5 Months</p>
                    <p className="text-base font-black text-white">₦9,999</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] h-20 font-black text-xl shadow-2xl shadow-blue-600/30 group-hover:scale-[1.02] transition-all relative z-10">
                Unlock Excellence
              </Button>
            </motion.div>

            {/* School Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-[4rem] bg-white p-12 lg:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] flex flex-col group border border-slate-100"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="mb-10 relative z-10">
                <div className="inline-block px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                  Institutional Solutions
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Classboard LMS</h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">Hyper-scaling school productivity through superior EdTech infrastructure.</p>
              </div>

              <div className="space-y-4 mb-12 flex-grow relative z-10">
                {[
                  "Rapid Class Onboarding",
                  "Teacher Management Desktop",
                  "Proprietary Exam Authoring",
                  "Deep-Dive Cohort Analytics",
                  "Premium 24/7 Strategic Support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-600 text-base font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Zap className="w-3 h-3" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100 relative z-10">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Enterprise Partner</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">Custom Pricing</p>
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
                    <Image src="/highscore-logo-final.png" alt="Logo" width={28} height={28} />
                  </div>
                </div>
                <p className="text-slate-600 mt-4 text-sm font-medium italic">"The gold standard for Nigerian secondary institutions."</p>
              </div>

              <Button variant="outline" size="lg" className="w-full border-4 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 rounded-[2rem] h-16 font-black text-lg group-hover:scale-[1.02] transition-all relative z-10">
                Request Partnership
              </Button>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Premium Footer */}
      <footer className="bg-slate-900 text-white pt-32 pb-16 px-6 relative overflow-hidden z-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center gap-4 mb-8 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-2xl group-hover:scale-105 transition-transform">
                  <Image src="/highscore-logo-final.png" alt="Logo" width={40} height={40} className="object-contain" />
                </div>
                <span className="text-3xl font-black tracking-tighter">HighScore<span className="text-blue-500">.</span></span>
              </Link>
              <p className="text-xl text-slate-400 leading-relaxed mb-10 font-medium">
                Designing the future of Nigerian academic excellence. We bridge the gap between ambition and achievement.
              </p>
              <div className="flex gap-5">
                {[
                  { name: "Facebook", icon: "FB" },
                  { name: "Twitter", icon: "X" },
                  { name: "Instagram", icon: "IG" },
                  { name: "WhatsApp", icon: "WA" },
                ].map((social) => (
                  <a key={social.name} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1 transition-all duration-300">
                    <span className="text-xs font-black">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 lg:ml-auto">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-blue-500">Platform</h4>
              <ul className="space-y-5">
                <li><Link href="/courses" className="text-lg text-slate-400 hover:text-white transition-colors font-medium">Academy</Link></li>
                <li><Link href="/courses/CBT-PRACTICE" className="text-lg text-slate-400 hover:text-white transition-colors font-medium">CBT Hub</Link></li>
                <li><Link href="/games1" className="text-lg text-slate-400 hover:text-white transition-colors font-medium">Quiz Arena</Link></li>
                <li><Link href="/lms" className="text-lg text-slate-400 hover:text-white transition-colors font-medium">LMS Access</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-blue-500">Academics</h4>
              <ul className="space-y-5">
                <li><Link href="#" className="text-lg text-slate-400 hover:text-white transition-colors font-medium">Mathematics</Link></li>
                <li><Link href="#" className="text-lg text-slate-400 hover:text-white transition-colors font-medium">Science</Link></li>
                <li><Link href="#" className="text-lg text-slate-400 hover:text-white transition-colors font-medium">Humanities</Link></li>
                <li><Link href="#" className="text-lg text-slate-400 hover:text-white transition-colors font-medium">Languages</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-blue-500">Connect</h4>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-slate-400 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">08169133552</span>
                </li>
                <li className="flex items-center gap-4 text-slate-400 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">hello@highscore.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 text-sm font-medium">© 2025 HighScore EdTech Limited. Crafted for Excellence.</p>
            <div className="flex gap-10">
              <Link href="#" className="text-xs text-slate-500 hover:text-white font-black uppercase tracking-widest transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-xs text-slate-500 hover:text-white font-black uppercase tracking-widest transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
