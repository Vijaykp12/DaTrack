'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  Activity,
  Target,
  Calendar,
  Users,
  FileText,
  LogOut,
  Sparkles,
  Zap,
  Plus,
} from 'lucide-react';

export interface GamifiedSidebarProps {
  onOpenAdd?: () => void;
}

export function GamifiedSidebar({ onOpenAdd }: GamifiedSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: Activity,
      active: pathname === '/analytics',
    },
    {
      label: 'Workouts',
      href: '#',
      icon: Dumbbell,
      active: false,
    },
    {
      label: 'Nutrition',
      href: '#',
      icon: Apple,
      active: false,
    },
    {
      label: 'Goals',
      href: '#',
      icon: Target,
      active: false,
    },
    {
      label: 'Schedule',
      href: '#',
      icon: Calendar,
      active: false,
    },
    {
      label: 'Community',
      href: '#',
      icon: Users,
      active: false,
    },
    {
      label: 'Reports',
      href: '#',
      icon: FileText,
      active: false,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 min-h-screen game-sidebar p-6 select-none shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Brand / Logo */}
      <div className="space-y-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-[#C6F432] flex items-center justify-center text-[#141D26] font-black text-xl shadow-lg shadow-[#C6F432]/30 group-hover:scale-105 transition-transform">
            <span>D</span>
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              <span>DaTrack</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Level 12 Master
            </p>
          </div>
        </Link>

        {/* Quick Log Action Button */}
        {onOpenAdd && (
          <button
            onClick={onOpenAdd}
            className="w-full py-3 px-4 rounded-2xl bg-[#C6F432] text-[#141D26] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b8f018] active:scale-[0.98] transition-all shadow-md shadow-[#C6F432]/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Activity</span>
          </button>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  item.active
                    ? 'bg-[#1F2C38] text-[#C6F432] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#1A2530]'
                }`}
              >
                <div
                  className={`w-5 h-5 flex items-center justify-center transition-transform ${
                    item.active ? 'text-[#C6F432] scale-110' : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Level Progress & Logout */}
      <div className="space-y-4 pt-6 border-t border-slate-800/80">
        {/* Level XP Card */}
        <div className="p-3.5 rounded-2xl bg-[#19242F] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1 text-[#C6F432]">
              <Zap className="w-3.5 h-3.5" />
              <span>Level 12</span>
            </span>
            <span>4,850 / 5,000 XP</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-[#C6F432] rounded-full w-[85%]" />
          </div>
        </div>

        {/* Logout / Profile */}
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-[#1A2530] transition-colors w-full">
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
