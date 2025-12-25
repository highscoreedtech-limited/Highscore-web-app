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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
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
                <div className="text-gray-400">Contact Us</div>
                <div className="text-gray-400">Privacy Policy</div>
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
