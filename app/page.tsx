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
  Check,
  Phone,
  MessageCircle,
  CreditCard,
  ShieldCheck,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Premium loading logic
    const handleLoad = () => {
      const timer = setTimeout(() => {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }, 2000);
      return () => clearTimeout(timer);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

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
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
            }}
            className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-blue-900/20 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative mb-12"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-20px] border-2 border-dashed border-blue-500/20 rounded-full"
                  />
                  <div className="w-40 h-40 flex items-center justify-center p-5  relative z-10">
                    {/* shadow-[0_20px_50px_rgba(0,0,0,0.3)] */}
                    <Image src="/highscore-logo-final.png" alt="HighScore Logo" fill priority className="object-contain" />
                  </div>
                </div>
              </motion.div>

              <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative mb-4">
                <motion.div 
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 1.8, ease: "easeInOut" }}
                   className="absolute h-full left-0 top-0 bg-gradient-to-r from-blue-600 to-blue-400"
                />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white text-[10px] font-black tracking-[0.4em] uppercase"
              >
                Excellence Loading
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`min-h-screen bg-[#fafbfc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/40 blur-[120px] rounded-full" />
      </div>

      {/* Header - Transparent to Solid transition */}
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${
        (isScrolled || isMenuOpen)
          ? "bg-white py-2 shadow-xl" 
          : "bg-transparent py-2 md:py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-2 md:px-6 flex items-center justify-between relative">
          <Link href="/" className="flex items-center group z-10">
            <div className="relative w-16 h-16 transition-all duration-300">
              <Image
                src="/highscore-logo-final.png"
                alt="HighScore Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className={`mr-[-24px] text-base md:text-xl font-black tracking-tighter leading-none transition-colors duration-500 ${
                (isScrolled || isMenuOpen) ? "text-slate-700" : "text-white"
              }`}>
                HIGHSCORE<span className="text-blue-500">.</span>
              </span>
              {/* <span className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 mt-0.5 ${
                isScrolled ? "text-slate-400" : "text-white/60"
              }`}>
                Academic Elite
              </span> */}
            </div>
          </Link>

          {/* Desktop Navigation - Centered absolute */}
          <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {/* absolute left-1/2 -translate-x-1/2 */}
            {["Tutorials", "CBT Practice", "Games"].map((item) => {
              const href = item === "Tutorials" ? "/courses" : 
                           item === "CBT Practice" ? "/courses/CBT-PRACTICE" : "/games1";
              
              return (
                <Link
                  key={item}
                  href={href}
                  className={`text-[13px] font-bold uppercase tracking-widest transition-all relative group py-2 ${
                    isScrolled ? "text-slate-600 hover:text-blue-600" : "text-white hover:text-white/80"
                  }`}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-500 group-hover:w-full" />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Section - Right aligned via justify-between in container */}
          <div className="hidden lg:flex items-center gap-2 z-10">
            <Link href="/login">
              <Button variant="ghost" className={`text-white rounded-xl px-6 font-bold transition-all ${
                isScrolled ? "text-slate-700 hover:bg-slate-100 " : "hover:text-[#f97316] hover:bg-transparent"
              }`}>
                LOG IN
              </Button>
            </Link>
            <Link href="/signup">
              <Button className={`rounded-xl py-2 px-6 font-bold tracking-wider transition-all shadow-2xl ${
                isScrolled 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-white text-blue-900 hover:bg-blue-600 hover:text-white"
              }`}>
                {/* JOIN NOW */}
                SIGN UP
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-3 rounded-2xl transition-all ${
              (isScrolled || isMenuOpen) 
                ? "text-slate-900" 
                : "text-white"
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
              className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-2xl"
            >
              <div className="p-8 flex flex-col gap-6">
                {["Explainer Videos", "CBT Practice", "Educational Games", "Pricing"].map((item) => {
                  const href = item === "Explainer Videos" ? "/courses" : 
                               item === "CBT Practice" ? "/courses/CBT-PRACTICE" : 
                               item === "Educational Games" ? "/games1" : "#pricing";
                  return (
                    <Link 
                      key={item}
                      href={href} 
                      className="text-xl font-black uppercase tracking-widest p-4 rounded-2xl hover:bg-slate-50 text-slate-800" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  );
                })}
                <hr className="border-slate-100" />
                <div className="flex flex-col gap-4">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-14 rounded-xl font-bold">LOG IN</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full h-14 rounded-xl bg-blue-600 font-bold">JOIN NOW</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

        {/* Style Hero Section */}
      <section className="relative h-screen min-h-[700px] flex flex-col justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-students-computers.png"
            alt="HighScore"
            fill
            className="object-cover object-center scale-105 animate-slow-zoom"
            priority
          />
           {/* <div className="absolute inset-0 bg-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" /> */}
          {/* <div className="absolute inset-0 bg-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/65" /> */}
          <div className="absolute inset-0 bg-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/75" />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-6"
          > */}
            {/* <span className="text-blue-400 font-bold tracking-[0.4em] uppercase text-xs sm:text-sm">
              Nigeria&apos;s Premium Learning Ecosystem
            </span> */}
          {/* </motion.div> */}

          {/* Reference: Previous Brentwood Style Heading 
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-9xl text-white mb-8 leading-[1.1] tracking-tight max-w-5xl"
          >
            Nurturing the Whole <br />
            <span className="italic text-blue-100 opacity-90">Academic Person.</span>
          </motion.h1>
          */}

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-[1.1] tracking-tight max-w-5xl [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]"
          >
            Pass JAMB, SSCE & Post-UTME <br />
            <span className="text-[#f97316] drop-shadow-[0_4px_12px_rgba(249,115,22,0.3)]">with Confidence.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="max-w-2xl"
          >
            {/* Reference: Previous Paragraph 
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light tracking-wide mb-12">
              Beyond test scores. We build confidence, mastery, and future-ready skills through Nigerian-tailored academic excellence.
            </p>
            */}
            <p className="text-base md:text-lg text-white/95 leading-relaxed font-semibold tracking-wide mb-12 [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
              Smart video lessons, AI tutoring, real CBT simulations and <br className="hidden md:block"/> gamified practice — all built for Nigerian students.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-6"
          >
            <Link href="/signup">
              <Button size="lg" className="w-full h-12 px-6 rounded-xl bg-blue-600 hover:bg-white hover:text-blue-900 transition-all duration-500 font-bold tracking-widest text-sm">
                Start Practicing Now
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className=" w-full bg-transparent h-12 px-6 rounded-xl border-2 border-white text-white hover:bg-white hover:text-slate-950 transition-all duration-500 font-bold tracking-widest text-sm">
                See How It Works
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* The "Service Bar" at the Bottom */}
        <div className="absolute bottom-0 left-0 w-full z-20 grid grid-cols-2 md:grid-cols-6 h-32 md:h-24">
          {/* { title: "JAMB / UTME", subtitle: "CBT Simulations", color: "bg-blue-900", href: "/courses/CBT-PRACTICE" },
            { title: "WAEC / SSCE", subtitle: "Practice Mode", color: "bg-indigo-900", href: "/courses" },
            { title: "Post-UTME", subtitle: "Elite Coaching", color: "bg-slate-900", href: "/courses" },
            { title: "LMS Games", subtitle: "Gamified Learning", color: "bg-blue-800", href: "/games1" } */}
          
          {[
            { title: "Mathematics", subtitle: "Algebra", color: "bg-blue-900", href: "/courses/CBT-PRACTICE" },
            { title: "English", subtitle: "Grammar", color: "bg-indigo-900", href: "/courses" },
            { title: "Physics", subtitle: "Mechanics", color: "bg-slate-900", href: "/courses" },
            { title: "Chemistry", subtitle: "Reactions", color: "bg-blue-800", href: "/courses" },
             { title: "Biology", subtitle: "Life", color: "bg-blue-900", href: "/courses" },
             { title: "Literature", subtitle: "Poetry", color: "bg-slate-900", href: "/courses" }
          ].map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href}
              className={`relative group overflow-hidden flex flex-col justify-center px-8 transition-all duration-500 ${item.color} hover:bg-blue-600`}
            >
              <div className="relative z-10">
                <p className="text-white font-black text-sm md:text-lg tracking-tighter leading-tight group-hover:-translate-y-1 transition-transform duration-500">
                  {item.title}
                </p>
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mt-1 group-hover:text-white/80 transition-colors">
                  {item.subtitle}
                </p>
              </div>
              {/* Hover highlight effect */}
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          ))}
        </div>
      </section>



      {/* Features Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 md:px-10 lg:px-20 bg-white relative z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-10 md:mb-15 lg:mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              A complete toolkit <br />
              <span className="text-blue-600">for academic excellence.</span>
            </h2>
            <p className="text-base md:text-xl text-slate-600 leading-relaxed">
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
                    className={`p-3 h-auto font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-2 ${feat.disabled ? 'opacity-50 cursor-not-allowed' : ``}`}
                    disabled={feat.disabled}
                    style={{border: `1px solid ${feat.bg}`}}
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
      <section className="bg-slate-900 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
            </div>

        <div className="max-w-7xl mx-auto py-16 md:py-20 lg:py-24 px-4 md:px-10 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">
                Our numbers speak <br />
                  <span className="text-blue-400">for themselves.</span>
                </h2>
              <p className="text-base md:text-xl text-slate-400 leading-relaxed mb-12 max-w-lg">
                We've helped thousands of Nigerian students transform their preparation into top-percentile results.
                </p>
              
              <div className="grid grid-cols-2 gap-4 md:gap-8">
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
                    <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400 uppercase tracking-widest font-bold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[400px] lg:h-full min-h-[400px]">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden border-0 border-white/10 shadow-2xl">
                <Image 
                  src="/hero-students-computers.png" 
                  alt="Students learning" 
                  fill
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
      <section className="py-16 md:py-20 lg:py-24 px-4 md:px-10 lg:px-20 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-15 lg:mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Invest in your <br />
              <span className="text-blue-600">academic future.</span>
            </h2>
            <p className="text-base md:text-xl text-slate-600 leading-relaxed">
              Flexible options built for Nigerian students and modern institutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 transition-all duration-500 hover:shadow-xl group"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Basic Starter</h3>
                <p className="text-slate-500 text-xs">Essential tools for quick practice.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₦2,999</span>
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">/ Month</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-grow text-sm">
                {[
                  "Reality CBT Mock Exams",
                  "Performance Analytics",
                  "2 Subject Areas",
                  "Basic Support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-600 font-medium">
                    <Check className="w-4 h-4 text-blue-500" />
                    {item}
                  </div>
                ))}
              </div>

              <Button className="w-full h-14 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 font-bold">
                Start for Free
              </Button>
            </motion.div>

            {/* Premium Success Kit - Recommended */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col p-10 rounded-[2.5rem] bg-slate-900 border-4 border-blue-500 shadow-md shadow-blue-500/20 relative items-stretch transform lg:-translate-y-4 mt-6 md:mt-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-black tracking-[0.2em] uppercase shadow-lg text-center">
                Most Popular
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Premium Success Kit</h3>
                <p className="text-slate-400 text-xs">Loved by parents and learners with proven academic outcomes.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">₦6,999</span>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/ Term (3 Mo)</span>
                </div>
                <div className="inline-block bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/20">
                  Save ₦8,000 on termly plan
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-grow text-sm">
                {[
                  "Interactive Video Tutorials",
                  "Reality CBT Mock Exams",
                  "Gamified Quiz Access",
                  "AI Tutor & Progress Tracking",
                  "Group Study Collaboration",
                  "Expert Support Access",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-300 font-medium">
                    <Check className="w-4 h-4 text-blue-400" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Monthly Plan</span>
                    <div className="text-right">
                      <span className="line-through text-slate-500 mr-2 text-[10px]">₦5,000</span>
                      <span className="font-bold text-white">₦2,999</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">2 Months Plan</span>
                    <div className="text-right">
                      <span className="line-through text-slate-500 mr-2 text-[10px]">₦10,000</span>
                      <span className="font-bold text-white">₦4,999</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-blue-200 font-bold p-1 bg-blue-500/10 rounded">
                    <span>5 Months (Best Value)</span>
                    <div className="text-right">
                      <span className="line-through text-slate-500 mr-2 text-[10px]">₦25,000</span>
                      <span className="text-emerald-400">₦9,999</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-white hover:text-blue-900 transition-all duration-500 font-black shadow-xl mb-4">
                Get Premium Access
              </Button>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-4 opacity-60">
                  <CreditCard className="w-5 h-5 text-white" />
                  <div className="h-4 w-px bg-white/20" />
                  <div className="flex gap-2 text-[8px] font-bold uppercase tracking-tighter text-white/80">
                    <span>Visa</span>
                    <span>Mastercard</span>
                    <span>Verve</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    SSL SECURED PAYMENT
                  </div>
                </div>
              </div>
            </motion.div>

            {/* School / Institutional Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 transition-all duration-500 hover:shadow-xl group"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Classboard LMS</h3>
                <p className="text-slate-500 text-xs">Super human power for teachers. Making school 100× more productive.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 leading-none">Custom Group</span>
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Contact for bulk pricing</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow text-sm">
                {[
                  "Bulk Onboarding & Demo",
                  "Teacher Management Hub",
                  "Custom Exam Creation",
                  "School-wide Analytics",
                  "Classroom Collaboration",
                  "Dedicated Support Agent",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-600 font-medium">
                    <Check className="w-4 h-4 text-blue-500" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-slate-100 rounded-2xl p-5 mb-6 border border-slate-200">
                <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest mb-2">Institutional Account Details</p>
                <div className="space-y-1">
                  <p className="text-slate-900 font-bold text-xs">HighScore EdTech Limited</p>
                  <p className="text-blue-600 font-black text-base tracking-tight leading-tight">08169133552</p>
                  <p className="text-slate-500 text-[10px] font-medium uppercase">Moniepoint MFB</p>
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 font-bold">
                Contact Sales Office
              </Button>
            </motion.div>
          </div>
          
          <div className="mt-20 text-center">
            <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Trusted by 50,000+ students across Nigeria
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 px-4 md:px-10 lg:px-20 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                  <Image src="/highscore-logo-final.png" alt="Logo" width={40} height={40} className="object-contain" />
                </div>
                <span className="text-base md:text-xl font-black tracking-tight uppercase">HighScore</span>
              </Link>
              <p className="text-slate-400 leading-relaxed mb-8">
                {/* Nigeria's #1 digital learning platform for academic excellence. We bridge the gap between effort and results. */}
                Nigeria’s Smartest Way to Prepare for JAMB & SSCE. We bridge the gap between effort and results.
              </p>
              <div className="flex gap-4">
                {[
                  { name: "Facebook", icon: <Facebook className="w-5 h-5" /> },
                  { name: "Twitter", icon: <Twitter className="w-5 h-5" /> },
                  { name: "Instagram", icon: <Instagram className="w-5 h-5" /> },
                  { name: "WhatsApp", icon: <MessageCircle className="w-5 h-5" /> },
                ].map((social) => (
                  <a key={social.name} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                    {social.icon}
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
                    <Phone className="w-4 h-4" />
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
  </>
);
}
