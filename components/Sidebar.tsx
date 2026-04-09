"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Play, Clock, BarChart3, List, Lightbulb } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/practice", label: "Practice", icon: Play },
    { href: "/exam", label: "Mock Exam", icon: Clock },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/history", label: "History", icon: List },
  ];

  return (
    <div className="w-64 bg-[#16213e] border-r border-[#2d3561] flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#2d3561]">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="text-[#D97706]" size={24} />
          <span className="text-2xl font-bold text-white">CCA Exam Prep</span>
        </div>
        <p className="text-xs text-[#A1A5B4] mt-2">Claude Certified Architect</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                  active
                    ? "bg-[#8B5CF6] text-white"
                    : "text-[#A1A5B4] hover:text-white hover:bg-[#2d3561]"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#2d3561]">
        <p className="text-xs text-[#A1A5B4] text-center">
          Powered by <span className="font-bold text-white">Claude</span>
        </p>
      </div>
    </div>
  );
}
