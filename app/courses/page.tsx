"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  Atom,
  Book,
  BookOpenText,
  FlaskConical,
  Ruler,
  Search,
  BookOpen,
  Leaf,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";


import FooterNav from "../components/FooterNav";
import Sidebar from "../components/Sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("ControlEdu");
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDesktop = useMediaQuery({ minWidth: 1024 }); // lg breakpoint

  const isActive = (path: string) => pathname === path;

  const [isOpen, setIsOpen] = useState(false);

 const panelRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);





  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  // Example notifications
  const notifications = [
    "New message from John",
    "Your order has been shipped",
    "Update available for your app",
  ];


  const subjects = [
    {
      title: "Mathematics",
      color: "linear-gradient(180deg, #5EA7E4 0%, #08477C 100%)",
      icon: <Ruler className="w-24 h-24 text-white m-4" />,
      path: "/courses/mathematics",
    },
    {
      title: "English Language",
      color: "linear-gradient(180deg, #55C77F 0%, #006124 100%)",
      icon: <BookOpenText className="w-24 h-24 text-white m-4" />,
      path: "/courses/english",
    },
    {
      title: "Physics",
      color: "linear-gradient(180deg, #E1635E 0%, #80120E 100%)",
      icon: <Atom className="w-24 h-24 text-white m-4" />,
      path: "/courses/physics",
    },
    {
      title: "Chemistry",
      color: "linear-gradient(180deg, #F3AD59 0%, #A65A00 100%)",
      icon: <FlaskConical className="w-24 h-24 text-white m-4" />,
      path: "/courses/chemistry",
    },
    {
      title: "Biology",
      color: "linear-gradient(180deg, #55C77F 0%, #006124 100%)",
      icon: <Leaf className="w-24 h-24 text-white m-4" />,
      path: "/courses/biology",
    },
    {
      title: "Literature",
      color: "linear-gradient(180deg, #897DD2 0%, #211668 100%)",
      icon: <BookOpenText className="w-24 h-24 text-white m-4" />,
      path: "/courses/literature",
    },
  ];



  const backgroundStyle = isDesktop
    ? { background: 'linear-gradient(to bottom, white 7%, #f3f4f6 7%)' } // desktop: larger white top
    : { background: 'linear-gradient(to bottom, white 3%, #f3f4f6 3%)' }; // mobile: smaller white area

    
  // Close panel when clicking outside
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      panelRef.current &&
      !panelRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen"
      style={backgroundStyle}
    >
      {/* Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-[#001A33] text-white flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold text-center border-b border-white/10">
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

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 w-64 h-full bg-[#001A33] text-white z-50 transition-transform duration-300 translate-x-0">

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
      <div className="lg:hidden mt-4 ml-4 mb-4">
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

      <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
     <button
        ref={buttonRef}
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
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
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>



        <img
          src="/path/to/icon.png"
          alt="icon"
          className="w-8 h-8 rounded-full bg-black"
        />
        <span className="text-lg font-semibold">5 🔥</span>
      </div>

         {/* Notification Panel */}
      {isOpen && (
        <div 
           ref={panelRef} // <-- attach ref here
        
        className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 font-semibold">
            Notifications
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-4 text-gray-500">No notifications</li>
            ) : (
              notifications.map((note, index) => (
                <li
                  key={index}
                  className="p-4 hover:bg-gray-100 cursor-pointer"
                >
                  {note}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 pb-24 relative">
        {/* Greeting Section */}
        {/* Title Section (only visible on mobile/tablet) */}


        <div className="max-w-xl mx-auto mb-8 text-left space-y-4 lg:hidden">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search subject or topic..."
              className="w-full rounded-full border border-gray-200 bg-white shadow-sm py-3 pl-12 pr-4 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>


          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800">Videos Tutorials</h2>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm font-bold">
            Master WAEC & JAMB Subjects with bite-sized tutorials
          </p>

          {/* Button */}
          <button
            className="text-white text-sm font-medium px-5 py-2 rounded-lg shadow transition-all duration-300 hover:opacity-90"
            style={{
              background: "linear-gradient(180deg, #FF9053 0%, #DB5206 100%)",
            }}
          >
            Continue Watching
          </button>

        </div>


        <div className="bg-white p-3 sm:p-9 rounded-lg sm:bg-transparent">



          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-4">
            <div className="relative  hidden md:block">
              <input
                type="text"
                placeholder="Search subject or topic......"
                className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Title Section (hidden on small screens) */}
          <div className="max-w-xl mx-auto mb-6 text-left hidden md:block">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              Videos Tutorials
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Master WAEC & JAMB Subjects with bite-sized tutorials
            </p>
            <button
              className="text-white text-sm font-medium px-5 py-2 rounded-lg shadow transition-all duration-300 hover:opacity-90"
              style={{
                background: "linear-gradient(180deg, #FF9053 0%, #DB5206 100%)",
              }}
            >
              Continue Watching
            </button>

          </div>


          {/* Subject Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mt-1">
            {subjects.map((subject, index) => (
              <div
                key={index}
                onClick={() => router.push(subject.path)}
                className={`rounded-2xl overflow-hidden bg-white shadow-sm border hover:shadow-md transition cursor-pointer ${isActive(subject.path) ? "border-orange-500" : "border-gray-100"
                  }`}
              >
                <div
                  className="flex items-center justify-center h-32"
                  style={{
                    background: subject.color.startsWith("linear-gradient")
                      ? subject.color
                      : undefined,
                    backgroundColor: !subject.color.startsWith("linear-gradient")
                      ? subject.color
                      : undefined,
                  }}
                >
                  {subject.icon}
                </div>

                <div className="py-3 text-center">
                  <h3 className="text-gray-800 font-medium">{subject.title}</h3>
                </div>
              </div>

            ))}
          </div>
        </div>

        {/* Footer Navigation (Mobile Only) */}

        <FooterNav />
      </main>
    </div>
  );
}
