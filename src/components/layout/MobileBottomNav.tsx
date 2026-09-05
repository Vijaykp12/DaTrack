'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, Plus, Target } from 'lucide-react';

export interface MobileBottomNavProps {
  onOpenAddEntry?: () => void;
}

export function MobileBottomNav({ onOpenAddEntry }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#141D26] text-white border-t border-slate-800/80 pb-safe-bottom shadow-2xl">
      <div className="grid grid-cols-3 items-center h-16 px-4 max-w-lg mx-auto relative">
        {/* Dashboard Tab */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 py-1 text-xs font-bold transition-colors select-none ${
            pathname === '/'
              ? 'text-[#C6F432]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard
            className={`w-5 h-5 transition-transform ${
              pathname === '/' ? 'scale-110' : ''
            }`}
          />
          <span>Tracker</span>
          {pathname === '/' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6F432] -mt-0.5" />
          )}
        </Link>

        {/* Center Floating Quick Log Action */}
        <div className="flex items-center justify-center -mt-6">
          <button
            onClick={onOpenAddEntry}
            aria-label="Log new activity"
            className="w-14 h-14 rounded-full bg-[#C6F432] text-[#141D26] flex items-center justify-center shadow-lg shadow-[#C6F432]/40 active:scale-95 transition-all border-4 border-[#E9F1EB] hover:brightness-110"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </button>
        </div>

        {/* Analytics Tab */}
        <Link
          href="/analytics"
          className={`flex flex-col items-center justify-center gap-1 py-1 text-xs font-bold transition-colors select-none ${
            pathname === '/analytics'
              ? 'text-[#C6F432]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3
            className={`w-5 h-5 transition-transform ${
              pathname === '/analytics' ? 'scale-110' : ''
            }`}
          />
          <span>Analytics</span>
          {pathname === '/analytics' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6F432] -mt-0.5" />
          )}
        </Link>
      </div>
    </div>
  );
}
