"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* LMS Hero Banner */}

      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 relative">
              <Image
                src="/highscore-logo-final.png"
                alt="HighScore Logo"
                width={64}
                height={64}
                className="object-contain rounded-lg"
              />
            </div>
            <span className="text-2xl font-bold text-blue-900">HighScore</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
            >
              Tutorials
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/courses/CBT-PRACTICE"
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
            >
              CBT Practice
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <button
              // href="/games"
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
              onClick={onHandleGameClick}
            >
              Games
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            {/* <Link
              href="/leaderboard"
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
            >
              Leaderboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link> */}
            {user ? (
              <button
                className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                onClick={() => router.push("/games1")}
              >
                <User className="w-7 h-7 text-blue-600" />
              </button>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/courses"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Tutorials
              </Link>
              <Link
                href="/courses/CBT-PRACTICE"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                CBT Practice
              </Link>
              {/* <Link
                href="/games"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Games
              </Link> */}
              <button
                // href="/games"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
                onClick={onHandleGameClick}
              >
                Games
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              {/* <Link
                href="/leaderboard"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link> */}


              {user ? (
                <button
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors w-full"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard <User className="w-7 h-7 text-blue-600" />
                </button>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-students-computers.png"
            alt="Students in school uniforms working on laptops in computer lab"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-blue-900/70"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Master JAMB, SSCE, & PTUME
            <span className="text-orange-400 block">With Confidence</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Access comprehensive tutorial videos, practice CBT exams, and play
            gamified quizzes to excel in your Nigerian educational examinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-8 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-2 border-white text-white hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-transparent backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                Explore Subjects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Everything You Need to Succeed
          </h2>


          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border-l-4 border-l-blue-600">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-all duration-300">
                  <Play className="w-8 h-8 text-blue-600 group-hover:text-white transition-all duration-300" />
                </div>
                <CardTitle className="text-gray-900">Video Tutorials</CardTitle>
                <CardDescription>
                  Expert-led video lessons covering all JAMB, SSCE, and PTUME
                  subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/courses">
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 bg-transparent"
                  >
                    Browse Tutorials
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border-l-4 border-l-red-600">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-all duration-300">
                  <Brain className="w-8 h-8 text-red-600 group-hover:text-white transition-all duration-300" />
                </div>
                <CardTitle className="text-gray-900">CBT Practice</CardTitle>
                <CardDescription>
                  Realistic computer-based test simulations with instant
                  feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/courses/CBT-PRACTICE">
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 bg-transparent"
                  >
                    Start Practice
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-all duration-300">
                  <GamepadIcon className="w-8 h-8 text-orange-500 group-hover:text-white transition-all duration-300" />
                </div>
                <CardTitle className="text-gray-900">Quiz Games</CardTitle>
                <CardDescription>
                  Gamified learning experience with leaderboards and
                  achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/games1">
                  <Button
                    variant="outline"
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 bg-transparent"
                  >
                    Play Games
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-6">
            <Card className="text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border-l-4 border-l-indigo-600">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 transition-all duration-300">
                  {/* <Play className="w-8 h-8 text-blue-600 group-hover:text-white transition-all duration-300" />
                   */}
                  <Bot className="bg-indigo-100 text-indigo-600 border-l-indigo-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-gray-900">AI Tutor</CardTitle>
                <CardDescription>
                  Personalized AI-powered guidance and instant answers to your
                  study questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Link href="/tutorials"> */}
                <Button
                  variant="outline"
                  className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  Coming Soon
                </Button>
                {/* </Link> */}
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border-l-4 border-l-emerald-600">
              <CardHeader>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-all duration-300">
                  {/* <Brain className="w-8 h-8 text-red-600 group-hover:text-white transition-all duration-300" /> */}
                  <Users className=" text-emerald-600  group-hover:text-white" />
                </div>
                <CardTitle className="text-gray-900"> LMS Group</CardTitle>
               

                <CardDescription>
                  {" "}
                  Join or create study groups to learn and collaborate with
                  peers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Link href="/lms">
                <Button
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  Learning Management System
                </Button>
               </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border-l-4 border-l-amber-500">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-all duration-300">
                  {/* <GamepadIcon className="w-8 h-8 text-orange-500 group-hover:text-white transition-all duration-300" /> */}
                  <Zap className="w-8 h-8 text-orange-500 group-hover:text-white transition-all duration-300" />
                </div>
                <CardTitle className="text-gray-900">
                  Real-time competition
                </CardTitle>
                <CardDescription>
                  Compete live with other students, and see your ranking
                  instantly on the leaderboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Link href="/games"> */}
                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  Coming Soon
                </Button>
                {/* </Link> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group cursor-pointer">
              <div className="transform transition-all duration-300 group-hover:scale-110">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">50,000+</div>
                <div className="text-blue-100">Active Students</div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="transform transition-all duration-300 group-hover:scale-110">
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="transform transition-all duration-300 group-hover:scale-110">
                <BookOpen className="w-12 h-12 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">1,000+</div>
                <div className="text-blue-100">Video Lessons</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Ready to Excel in Your Exams?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their scores with our
            comprehensive learning platform.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="text-lg px-8 bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Payment Section */}
<section className="py-20 px-4 bg-[#f6f7fb]">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

    {/* STUDENTS CARD */}
    <div className="relative overflow-hidden rounded-3xl bg-[#2a124a] text-white p-10 shadow-xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-300 rounded-full opacity-30 translate-x-16 -translate-y-16" />

      <h4 className="text-sm uppercase tracking-wide text-gray-300 mb-2">
        The HighScoreApp for Students
      </h4>

      <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">
        Loved by parents and learners with proven academic outcomes
      </h2>

      <p className="text-gray-300 mb-6 max-w-md">
        Coming Soon on web and mobile..
      </p>


     

      {/* Pricing Options Tag */}
      <div className="mb-6 mt-2 bg-white/10 rounded-xl p-4">
        <ul className="space-y-3 text-sm md:text-base">
          <li className="flex justify-between items-center">
            <span>Monthly</span>
            <span>
              <span className="line-through text-gray-400 mr-2">₦5,000</span>
              <span className="font-semibold text-orange-300">₦2,999</span>
              <span className="text-xs text-green-300 ml-2">(Save ₦2,001)</span>
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>2 Months</span>
            <span>
              <span className="line-through text-gray-400 mr-2">₦10,000</span>
              <span className="font-semibold text-orange-300">₦4,999</span>
              <span className="text-xs text-green-300 ml-2">(Save ₦5,001)</span>
            </span>
          </li>
          <li className="flex justify-between items-center bg-orange-500/20 px-3 py-2 rounded-lg">
            <span className="font-semibold">3 Months (Most Popular)</span>
            <span>
              <span className="line-through text-gray-300 mr-2">₦15,000</span>
              <span className="font-bold text-orange-400">₦6,999</span>
              <span className="text-xs text-green-300 ml-2">(Save ₦8,001)</span>
            </span>
          </li>
          <li className="flex justify-between items-center bg-green-500/20 px-3 py-2 rounded-lg">
            <span className="font-semibold">5 Months (Best Value)</span>
            <span>
              <span className="line-through text-gray-300 mr-2">₦25,000</span>
              <span className="font-bold text-green-300">₦9,999</span>
              <span className="text-xs text-green-300 ml-2">(Save ₦15,001)</span>
            </span>
          </li>
        </ul>
      </div>

      <button className="mt-4 w-full md:w-auto px-10 py-4 rounded-full bg-orange-400 text-[#2a124a] font-semibold text-lg hover:bg-orange-300 transition">
        Buy Now
      </button>

      {/* Contact for Confirmation & WhatsApp */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-white">
          <span>Contact: <span className="font-bold">08169133552</span> for confirmation</span>
        </div>
        <a href="https://wa.me/2348169133552" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:underline text-sm font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.7 0-3.36-.44-4.8-1.28l-.34-.2-3.67.96.98-3.58-.22-.36A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 5.02 4.22.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>

    {/* CLASSROOM CARD */}
    <div className="relative overflow-hidden rounded-3xl bg-[#2a124a] text-white p-10 shadow-xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-green-300 rounded-full opacity-30 translate-x-16 -translate-y-16" />

      <h4 className="text-sm uppercase tracking-wide text-gray-300 mb-2">
       HighScore Classboard for Classrooms
      </h4>

      <h2 className="text-2xl md:text-3xl font-bold text-green-300 mb-4">
        Super human power for teachers. Making school 100× more productive
      </h2>

      <p className="text-gray-300 mb-6 max-w-md">
        Harness the power of superior hardware and industry-leading academic
        content for seamless teaching and learning.
      </p>

      <div className="mb-6">
        <p className="text-gray-300 mb-2">
          Contact a sales agent to purchase
        </p>
        <p className="text-2xl font-bold tracking-wide">
          08169133552
        </p>
        <div className="mt-2 text-left">
          <div className="text-sm text-gray-300 font-semibold">Account Name: <span className="text-white">HighScore EdTech Limited</span></div>
          <div className="text-sm text-gray-300 font-semibold">Bank Name: <span className="text-white">Monipoint MFB</span></div>
        </div>
      </div>

      <button className="mt-4 w-full md:w-auto px-10 py-4 rounded-full bg-green-400 text-[#2a124a] font-semibold text-lg hover:bg-green-300 transition">
        Learn more
      </button>

      {/* Contact for Confirmation & WhatsApp */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-white">
          <span>Contact: <span className="font-bold">08169133552</span> for confirmation</span>
        </div>
        <a href="https://wa.me/2348169133552" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:underline text-sm font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.7 0-3.36-.44-4.8-1.28l-.34-.2-3.67.96.98-3.58-.22-.36A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 5.02 4.22.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
          Chat on WhatsApp
        </a>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Installmental Payment Plans Available
      </p>
    </div>

  </div>
</section>


      {/* Beautiful Payment Section with Sprinkler Effect and LMS Features */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 to-orange-50 overflow-hidden">
        {/* Sprinkler SVG Animation */}
        <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-0" width="100%" height="100%" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="100" r="6" fill="#fbbf24">
            <animate attributeName="cy" values="100;120;100" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="400" cy="180" r="4" fill="#60a5fa">
            <animate attributeName="cy" values="180;200;180" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="800" cy="60" r="5" fill="#34d399">
            <animate attributeName="cy" values="60;90;60" dur="2.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="1200" cy="150" r="7" fill="#f472b6">
            <animate attributeName="cy" values="150;180;150" dur="2.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="1000" cy="300" r="4" fill="#fbbf24">
            <animate attributeName="cy" values="300;320;300" dur="2.1s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STUDENT PREMIUM CARD */}
          <div className="relative overflow-hidden rounded-3xl bg-blue-900 text-white p-10 shadow-xl flex flex-col">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-300 rounded-full opacity-20 translate-x-16 -translate-y-16" />
            <h4 className="text-sm uppercase tracking-wide text-blue-200 mb-2">
              HighScore LMS for Students
            </h4>
            <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">
              Unlock Interactive Learning & Progress
            </h2>
            <ul className="mb-6 space-y-2 text-blue-100 text-base">
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span> Interactive video lessons & quizzes</li>
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span> Real-time progress tracking</li>
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span> Group study & peer collaboration</li>
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span> Expert tutor support</li>
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-orange-400 rounded-full"></span> Gamified achievements & leaderboards</li>
            </ul>
            {/* Detailed Pricing Options */}
            <div className="mb-6 mt-2 bg-white/10 rounded-xl p-4">
              <ul className="space-y-3 text-sm md:text-base">
                <li className="flex justify-between items-center">
                  <span>Monthly</span>
                  <span>
                    <span className="line-through text-blue-200 mr-2">₦5,000</span>
                    <span className="font-semibold text-orange-300">₦2,500</span>
                    <span className="text-xs text-green-300 ml-2">(50% launch discount)</span>
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>2 Months</span>
                  <span>
                    <span className="line-through text-blue-200 mr-2">₦10,000</span>
                    <span className="font-semibold text-orange-300">₦4,999</span>
                    <span className="text-xs text-green-300 ml-2">(Save ₦5,001)</span>
                  </span>
                </li>
                <li className="flex justify-between items-center bg-orange-500/20 px-3 py-2 rounded-lg">
                  <span className="font-semibold">3 Months (Most Popular)</span>
                  <span>
                    <span className="line-through text-blue-200 mr-2">₦15,000</span>
                    <span className="font-bold text-orange-400">₦6,999</span>
                    <span className="text-xs text-green-300 ml-2">(Save ₦8,001)</span>
                  </span>
                </li>
                <li className="flex justify-between items-center bg-green-500/20 px-3 py-2 rounded-lg">
                  <span className="font-semibold">5 Months (Best Value)</span>
                  <span>
                    <span className="line-through text-blue-200 mr-2">₦25,000</span>
                    <span className="font-bold text-green-300">₦9,999</span>
                    <span className="text-xs text-green-300 ml-2">(Save ₦15,001)</span>
                  </span>
                </li>
              </ul>
            </div>
            <button className="mt-4 w-full md:w-auto px-10 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg hover:bg-orange-400 transition">
              Subscribe Now
            </button>
            <div className="flex items-center gap-2 mt-6">
              <Image src="/visa.svg" alt="Visa" width={32} height={20} />
              <Image src="/mastercard.svg" alt="Mastercard" width={32} height={20} />
              <Image src="/verve.svg" alt="Verve" width={32} height={20} />
              <Image src="/paypal.svg" alt="PayPal" width={32} height={20} />
            </div>
            <div className="text-xs text-blue-200 mt-2">SSL Secured Payment</div>

            {/* Contact for Confirmation & WhatsApp */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-white">
                <span>Contact: <span className="font-bold">08169133552</span> for confirmation</span>
              </div>
              <a href="https://wa.me/2348169133552" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:underline text-sm font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.7 0-3.36-.44-4.8-1.28l-.34-.2-3.67.96.98-3.58-.22-.36A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 5.02 4.22.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* SCHOOL/CLASSROOM CARD */}
          <div className="relative overflow-hidden rounded-3xl bg-blue-900 text-white p-10 shadow-xl flex flex-col">
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-300 rounded-full opacity-20 translate-x-16 -translate-y-16" />
            <h4 className="text-sm uppercase tracking-wide text-blue-200 mb-2">
              HighScore LMS for Schools & Groups
            </h4>
            <h2 className="text-2xl md:text-3xl font-bold text-green-300 mb-4">
              Empower Classrooms with Digital Tools
            </h2>
            <ul className="mb-6 space-y-2 text-blue-100 text-base">
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-green-300 rounded-full"></span> Bulk student & teacher access</li>
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-green-300 rounded-full"></span> Class management & analytics</li>
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-green-300 rounded-full"></span> Customizable lesson plans</li>
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-green-300 rounded-full"></span> Group assignments & collaboration</li>
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-green-300 rounded-full"></span> Dedicated support & onboarding</li>
            </ul>
            <div className="mb-6">
              <p className="text-blue-100 mb-2">Contact our team for a custom quote</p>
              <p className="text-2xl font-bold tracking-wide">08169133552</p>
            </div>
            <button className="mt-4 w-full md:w-auto px-10 py-4 rounded-full bg-green-400 text-blue-900 font-semibold text-lg hover:bg-green-300 transition">
              Request Demo
            </button>
            <p className="mt-6 text-sm text-blue-200">
              Installment Payment Plans Available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/highscore-logo-final.png"
                    alt="HighScore Logo"
                    width={64}
                    height={64}
                    className="object-contain rounded-lg"
                  />
                </div>
                <span className="text-xl font-bold">HighScore</span>
              </div>
              <p className="text-gray-400">
                Empowering Nigerian students to excel in JAMB, SSCE, and PTUME
                examinations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-blue-400">Platform</h3>
              <div className="space-y-2">
                <Link
                  href="/courses"
                  className="block text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Video Tutorials
                </Link>
                <Link
                  href="/cbt"
                  className="block text-gray-400 hover:text-red-400 transition-colors duration-300"
                >
                  CBT Practice
                </Link>
                <Link
                  href="/games"
                  className="block text-gray-400 hover:text-orange-400 transition-colors duration-300"
                >
                  Quiz Games
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-blue-400">Subjects</h3>
              <div className="space-y-2">
                <div className="text-gray-400">Mathematics</div>
                <div className="text-gray-400">English Language</div>
                <div className="text-gray-400">Physics</div>
                <div className="text-gray-400">Chemistry</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-blue-400">Support</h3>
              <div className="space-y-2">
                <div className="text-gray-400">Help Center</div>
                <a href="mailto:support@highscore.com" className="text-gray-400 hover:text-green-400 transition-colors duration-300">Contact Us</a>
                <div className="text-gray-400">Privacy Policy</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-blue-400">Follow Us</h3>
              <div className="flex gap-4 mt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="22" height="22" fill="#1877F3" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <svg width="22" height="22" fill="#1DA1F2" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="22" height="22" fill="#E4405F" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.414 3.678 1.395c-.98.98-1.263 2.092-1.322 3.374C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.282.342 2.394 1.322 3.374.98.98 2.092 1.263 3.374 1.322C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.059 2.394-.342 3.374-1.322.98-.98 1.263-2.092 1.322-3.374.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.282-.342-2.394-1.322-3.374-.98-.98-2.092-1.263-3.374-1.322C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
                <a href="https://wa.me/2348169133552" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg width="22" height="22" fill="#25D366" viewBox="0 0 24 24"><path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.7 0-3.36-.44-4.8-1.28l-.34-.2-3.67.96.98-3.58-.22-.36A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 5.02 4.22.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HighScore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
