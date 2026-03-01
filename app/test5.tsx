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
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* Header - Fixed to ensure it stays on top and handles transparency transition */}
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled 
          ? "bg-white backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-md" 
          : "bg-transparent py-6"
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className={`relative w-16 h-16 overflow-hidden rounded-xl p-0.5 shadow-lg transition-all duration-300 ${
              isScrolled ? "bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-200/50" : "bg-white shadow-black/20"
            }`}>
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                <Image
                  src="/highscore-logo-final.png"
                  alt="HighScore Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black tracking-tighter transition-colors duration-500 ${
                isScrolled ? "text-slate-900" : "text-white"
              }`}>
                HIGHSCORE<span className="text-blue-500">.</span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 ${
                isScrolled ? "text-slate-400" : "text-white/60"
              }`}>
                Academic Elite
              </span>
            </div>
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
                    className={`text-sm font-semibold transition-colors relative group py-2 ${
                      isScrolled ? "text-slate-600 hover:text-blue-600" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                  </button>
                );
              }
              return (
                <Link
                  key={item}
                  href={href}
                  className={`text-sm font-semibold transition-colors relative group py-2 ${
                    isScrolled ? "text-slate-600 hover:text-blue-600" : "text-white/80 hover:text-white"
                  }`}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}

            <div className={`h-6 w-[1px] mx-2 transition-colors duration-300 ${
              isScrolled ? "bg-slate-200" : "bg-white/20"
            }`} />

            {user ? (
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all duration-300 ${
                  isScrolled 
                    ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/login" className={`text-sm font-bold transition-colors ${
                  isScrolled ? "text-slate-600 hover:text-blue-600" : "text-white/80 hover:text-white"
                }`}>
                  Log in
                </Link>
                <Link href="/signup">
                  <Button className={`rounded-full px-8 h-12 transition-all active:scale-95 ${
                    isScrolled 
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200" 
                      : "bg-white text-blue-600 hover:bg-blue-50 shadow-xl shadow-black/20"
                  }`}>
                    Sign up free
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2.5 rounded-xl transition-all ${
              isScrolled 
                ? "bg-slate-100 text-slate-900 border border-slate-200" 
                : "bg-white/10 text-white border border-white/20 backdrop-blur-md"
            }`}
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

      {/* Hero Section with Image Background & Asymmetric Layout */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background Image & Overlay Layering */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-students-computers.png"
            alt="Students studying"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Multi-layered overlay for perfect contrast */}
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-transparent h-40" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.div 
                variants={itemVariants} 
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.25em] mb-12 shadow-2xl"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Nigerian Academic Infrastructure v2.0</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants} 
                className="text-5xl lg:text-8xl font-black text-white leading-[1.05] mb-10 tracking-[ -0.04em]"
              >
                The Architecture <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  of High Performance.
                </span>
              </motion.h1>

              <motion.div variants={itemVariants} className="lg:pl-20 border-l-4 border-blue-500/30 mb-12">
                <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed font-medium max-w-xl">
                  We don't just provide practice—we engineer results. Access the gold standard of JAMB, SSCE, and Post-UTME preparation.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-start lg:ml-20">
                <Link href="/signup">
                  <Button size="lg" className="rounded-2xl px-12 py-9 text-xl bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all hover:scale-[1.05] active:scale-95 font-black uppercase tracking-widest">
                    Begin Your Ascent
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="ghost" className="rounded-2xl px-10 py-9 text-xl text-white hover:bg-white/10 backdrop-blur-sm border-2 border-white/20 transition-all font-bold">
                    <Play className="w-6 h-6 mr-3 fill-white" />
                    Our Methodology
                  </Button>
                </Link>
              </motion.div>

              {/* Floating Social Proof in Asymmetric Area */}
              <motion.div variants={itemVariants} className="mt-20 flex items-center gap-10 lg:ml-[15%]">
                <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                  <p className="text-4xl font-black text-white">50k+</p>
                  <p className="text-4xl font-black text-blue-400">95%</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">Active Scholars</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">Success Velocity</p>
                </div>
                <div className="h-16 w-px bg-white/10 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-4 group cursor-pointer">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-blue-600/40 transition-colors shadow-2xl">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Join the Collective</p>
                    <p className="text-xs text-slate-400">Real-time collaboration</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Empty space for asymmetry in LG+ */}
            <div className="flex-grow" />
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-24 px-6 bg-white relative z-10 transition-colors duration-500">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              A complete toolkit <br />
              <span className="text-blue-600">for academic excellence.</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Everything you need to crush your exams, from expert tutorials to real-time competition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Video Tutorials",
                desc: "High-definition video lessons covering the entire JAMB & SSCE syllabus by top-tier educators.",
                icon: <Play className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-50",
                link: "/courses",
                btnText: "Explore Tutorials"
              },
              {
                title: "Real CBT Simulations",
                desc: "Practice with timed, realistic exam environments that mirror the actual JAMB interface.",
                icon: <Brain className="w-6 h-6 text-indigo-600" />,
                bg: "bg-indigo-50",
                link: "/courses/CBT-PRACTICE",
                btnText: "Start Practice"
              },
              {
                title: "Gamified Quiz Hub",
                desc: "Turn study into play. Compete for high scores and earn rewards while you learn.",
                icon: <GamepadIcon className="w-6 h-6 text-orange-600" />,
                bg: "bg-orange-50",
                link: "/games1",
                btnText: "Play Now"
              },
              {
                title: "AI Study Tutor",
                desc: "Get instant answers to complex questions and personalized study paths powered by AI.",
                icon: <Bot className="w-6 h-6 text-emerald-600" />,
                bg: "bg-emerald-50",
                link: "#",
                btnText: "Coming Soon",
                disabled: true
              },
              {
                title: "LMS Group Learning",
                desc: "Collaborate with peers, share notes, and join virtual study rooms in our modern LMS.",
                icon: <Users className="w-6 h-6 text-violet-600" />,
                bg: "bg-violet-50",
                link: "/lms",
                btnText: "Join Groups"
              },
              {
                title: "Live Leaderboards",
                desc: "See how you rank against students nationwide in real-time. Stay motivated and sharp.",
                icon: <Zap className="w-6 h-6 text-amber-600" />,
                bg: "bg-amber-50",
                link: "#",
                btnText: "Coming Soon",
                disabled: true
              }
            ].map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
              >
                <div className={`w-14 h-14 ${feat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {feat.desc}
                </p>
                <Link href={feat.link}>
                  <Button 
                    variant="ghost" 
                    className={`p-0 h-auto font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-2 ${feat.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={feat.disabled}
                  >
                    {feat.btnText}
                    {!feat.disabled && <X className="w-4 h-4 rotate-45" />}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Social Proof */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">
                Our numbers speak <br />
                <span className="text-blue-400">for themselves.</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-lg">
                We've helped thousands of Nigerian students transform their preparation into top-percentile results.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Active Students", value: "50,000+", icon: <Users className="w-5 h-5" /> },
                  { label: "Success Rate", value: "95%", icon: <Trophy className="w-5 h-5" /> },
                  { label: "Video Lessons", value: "1,000+", icon: <Play className="w-5 h-5" /> },
                  { label: "CBT Questions", value: "20,000+", icon: <Brain className="w-5 h-5" /> },
                ].map((stat) => (
                  <div key={stat.label} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400 uppercase tracking-widest font-bold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-[2rem] overflow-hidden border-8 border-white/10 shadow-2xl relative">
                <Image 
                  src="/hero-students-computers.png" 
                  alt="Students learning" 
                  width={800} 
                  height={500} 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                    <p className="text-lg italic text-white mb-4">
                      "HighScore completely changed how I studied for JAMB. The CBT practice was identical to the real exam!"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 overflow-hidden">
                        <Image src="https://i.pravatar.cc/100?img=32" alt="Student" width={40} height={40} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Chidi Opara</p>
                        <p className="text-xs text-blue-300">Scored 312 in JAMB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Access Plans Section */}
      <section className="py-24 px-6 bg-slate-50 relative z-10">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Simple, transparent <br />
              <span className="text-blue-600">plans for everyone.</span>
            </h2>
            <p className="text-xl text-slate-600">
              Whether you're an individual student or a school, we have a plan that fits your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Student Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 shadow-2xl flex flex-col group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -translate-y-24 translate-x-24" />
              <div className="mb-8">
                <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold tracking-wider uppercase mb-4 inline-block">
                  For Students
                </span>
                <h3 className="text-3xl font-bold text-white mb-4">Complete Success Kit</h3>
                <p className="text-slate-400 leading-relaxed">Everything you need to study independently and crush your exam.</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
                  "Unlimited Video Tutorials",
                  "Reality CBT Mock Exams",
                  "Gamified Quiz Access",
                  "Performance Analytics",
                  "AI Tutor (Coming Soon)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Zap className="w-3 h-3" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/10">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest font-bold">Best Value (3 Mo)</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-white">₦6,999</span>
                      <span className="text-slate-500 line-through">₦15,000</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-3 py-1 rounded-lg">Save ₦8,001</span>
                  </div>
                </div>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• Monthly: ₦2,999 (Save ₦2k)</li>
                  <li>• 5 Months: ₦9,999 (Save ₦15k)</li>
                </ul>
              </div>

              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 font-bold text-lg shadow-lg shadow-blue-500/25 group-hover:scale-[1.02] transition-transform">
                Get Instant Access
              </Button>
            </motion.div>

            {/* School Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-xl border border-slate-100 flex flex-col group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -translate-y-24 translate-x-24" />
              <div className="mb-8">
                <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold tracking-wider uppercase mb-4 inline-block">
                  For Schools & Groups
                </span>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Classboard LMS</h3>
                <p className="text-slate-600 leading-relaxed">Empower your teachers with superhuman tools and digital curriculum.</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
                  "Bulk Student Onboarding",
                  "Teacher Management Hub",
                  "Custom Exam Creation",
                  "Class-wide Analytics",
                  "Dedicated Support Rep",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Zap className="w-3 h-3" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                <p className="text-slate-500 text-sm mb-2 uppercase tracking-widest font-bold">Contact for Custom Quote</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">Moniepoint MFB</p>
                <p className="text-sm text-slate-600">Acct Name: HighScore EdTech Ltd</p>
              </div>

              <Button variant="outline" size="lg" className="w-full border-2 border-slate-200 hover:bg-slate-50 text-slate-900 rounded-2xl h-14 font-bold text-lg group-hover:scale-[1.02] transition-transform">
                Request a Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 px-6 relative overflow-hidden z-10">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                  <Image src="/highscore-logo-final.png" alt="Logo" width={32} height={32} className="object-contain" />
                </div>
                <span className="text-2xl font-black tracking-tight">HighScore</span>
              </Link>
              <p className="text-slate-400 leading-relaxed mb-8">
                {/* Nigeria's #1 digital learning platform for academic excellence. We bridge the gap between effort and results. */}
                Nigeria’s Smartest Way to Prepare for JAMB & SSCE. We bridge the gap between effort and results.
              </p>
              <div className="flex gap-4">
                {[
                  { name: "Facebook", icon: "F" },
                  { name: "Twitter", icon: "T" },
                  { name: "Instagram", icon: "I" },
                  { name: "WhatsApp", icon: "W" },
                ].map((social) => (
                  <a key={social.name} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                    <span className="text-sm font-bold">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/courses" className="text-slate-400 hover:text-blue-400 transition-colors">Video Tutorials</Link></li>
                <li><Link href="/courses/CBT-PRACTICE" className="text-slate-400 hover:text-blue-400 transition-colors">CBT Practice</Link></li>
                <li><Link href="/games1" className="text-slate-400 hover:text-blue-400 transition-colors">Interactive Games</Link></li>
                <li><Link href="/lms" className="text-slate-400 hover:text-blue-400 transition-colors">LMS Access</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Subjects</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Mathematics</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition-colors">English Language</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Physics & Chemistry</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Government & Literature</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  08169133552
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  support@highscore.com
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2025 HighScore EdTech Limited. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="text-xs text-slate-500 hover:text-slate-300">Privacy Policy</Link>
              <Link href="#" className="text-xs text-slate-500 hover:text-slate-300">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
