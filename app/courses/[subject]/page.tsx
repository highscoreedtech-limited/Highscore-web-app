"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut,
  Search,
  ArrowLeft,
  ChevronRight,
  Atom,
  FlaskConical,
  BookOpen,
  Sigma,
  Leaf,
  BookOpenText,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";
import Sidebar from "@/app/components/Sidebar";
import FooterNav from "@/app/components/FooterNav";
import { supabase } from "@/lib/supabaseClient";

// -----------------------------
// Hardcoded subjects
// -----------------------------
const scienceSubjects = [
  { name: "Mathematics", slug: "mathematics", icon: Sigma, color: "bg-gradient-to-b from-[#5EA7E4] to-[#08477C]" },
  { name: "English Language", slug: "english", icon: BookOpen, color: "bg-gradient-to-b from-[#55C77F] to-[#006124]" },
  { name: "Physics", slug: "physics", icon: Atom, color: "bg-gradient-to-b from-[#E1635E] to-[#8D1A16]" },
  { name: "Chemistry", slug: "chemistry", icon: FlaskConical, color: "bg-gradient-to-b from-[#E7A100] to-[#8A4B00]" },
  { name: "Biology", slug: "biology", icon: Leaf, color: "bg-gradient-to-b from-green-700 to-green-500" },
  { name: "Literature", slug: "literature", icon: BookOpenText, color: "bg-gradient-to-b from-[#897DD2] to-[#211668]" },
];

export default function CourseSubjectPage() {
  const router = useRouter();
  const params = useParams();
  const { subject } = params;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topics, setTopics] = useState<any[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Get subject data from hardcoded subjects
  const subjectData = scienceSubjects.find((s) => s.slug === subject);

  if (!subjectData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Subject not found 😢</p>
      </div>
    );
  }

  // Fetch topics from Supabase using subject_slug
  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);

      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .eq("subject_slug", subjectData.slug);

      if (error) {
        console.error("Error fetching topics:", error);
        setTopics([]);
      } else {
        setTopics(data);
      }

      setLoadingTopics(false);
    };

    fetchTopics();
  }, [subjectData]);

  if (loadingTopics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading topics...</p>
      </div>
    );
  }

  const Icon = subjectData.icon;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-[#001A33] text-white flex-col">
        <div className="px-6 py-5 text-2xl font-bold text-center border-b border-white/10">
          <span className="text-orange-500">HIGH</span>SCORE
        </div>
        <div className="p-4">
          <input type="text" placeholder="Search..." className="w-full px-3 py-2 rounded-md bg-white text-gray-700 text-sm focus:outline-none"/>
        </div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="mt-auto p-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
            <div className="fixed top-0 left-0 w-64 h-full bg-[#001A33] text-white z-50 flex flex-col transition-transform">
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 flex justify-center pb-32">
        <div className="w-full max-w-6xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${subjectData.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">{subjectData.name}</h1>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder={`Search topics in ${subjectData.name}...`}
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>

          {/* Topics */}
          <h2 className="text-2xl font-semibold text-gray-800">Topics</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm p-5 flex flex-col gap-4">
            {topics.map((topic: any) => (
              <div
                key={topic.id}
                onClick={() =>
                  router.push(`/courses/${subjectData.slug}/${topic.slug}`)
                }
                className="flex justify-between items-center py-4 px-2 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">{topic.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 ml-4">
                  {/* Optional: show number of videos if stored */}
                  {topic.video_src ? "Video available" : null}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-center lg:justify-start">
              <button
                className="text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow transition-all duration-300 hover:opacity-90"
                style={{ background: "linear-gradient(180deg, #FF9053 0%, #DB5206 100%)" }}
              >
                View all Lessons
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50">
        <FooterNav />
      </div>
    </div>
  );
}
