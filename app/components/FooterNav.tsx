"use client";

import { LayoutDashboard, BookOpen, Users, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function FooterNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, route: "/lms" },
    { name: "Courses", icon: BookOpen, route: "/courses" },
    { name: "Community", icon: Users, route: "#" },
    { name: "Profile", icon: User, route: "#" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, i) => {
          const active = pathname === item.route;
          return (
            <button
              key={i}
              onClick={() => router.push(item.route)}
              className={`flex flex-col items-center transition-all ${
                active ? "text-orange-500" : "text-gray-500 hover:text-orange-500"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
