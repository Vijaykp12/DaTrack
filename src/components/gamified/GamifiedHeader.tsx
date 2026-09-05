'use client';

import React, { useState } from 'react';
import { Search, Settings, Bell, Sparkles, Menu } from 'lucide-react';
import { toast } from 'sonner';

export interface GamifiedHeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenAdd?: () => void;
}

export function GamifiedHeader({ onOpenMobileMenu, onOpenAdd }: GamifiedHeaderProps) {
  const [search, setSearch] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Sample data loaded!');
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to seed');
      }
    } catch {
      toast.error('Could not connect to database.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Subtitle */}
      <div className="flex items-center justify-between sm:block">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141D26] tracking-tight">
            Overview Your Life
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Let&apos;s do Some Productive Work Today.....
          </p>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenAdd}
            className="w-9 h-9 rounded-full bg-[#C6F432] text-[#141D26] flex items-center justify-center font-bold shadow-sm"
            aria-label="Quick Add"
          >
            +
          </button>
        </div>
      </div>

      {/* Right Search Bar & Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Pill Search Bar */}
        <div className="relative flex items-center bg-white rounded-full px-2 py-1.5 shadow-sm border border-slate-200/60 w-full sm:w-64 max-w-xs">
          <div className="w-7 h-7 rounded-full bg-[#C6F432] flex items-center justify-center text-[#141D26] shrink-0 mr-2 shadow-xs">
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none w-full font-medium"
          />
        </div>

        {/* Settings Pill */}
        <button
          onClick={handleSeed}
          title="Seed Sample Data"
          className="w-10 h-10 rounded-full bg-[#C6F432] hover:bg-[#b8f018] text-[#141D26] flex items-center justify-center shadow-xs transition-transform active:scale-95 shrink-0"
        >
          <Settings className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Notification Pill */}
        <div className="relative shrink-0">
          <button
            onClick={() => toast.info('You are on a 14-day productivity streak!')}
            className="w-10 h-10 rounded-full bg-[#C6F432] hover:bg-[#b8f018] text-[#141D26] flex items-center justify-center shadow-xs transition-transform active:scale-95"
          >
            <Bell className="w-4 h-4 stroke-[2.2]" />
          </button>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white" />
        </div>

        {/* User Avatar with Level 12 Ring */}
        <div className="relative w-10 h-10 rounded-full border-2 border-[#C6F432] overflow-hidden shrink-0 shadow-xs cursor-pointer bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-xs">
          <span>JD</span>
        </div>
      </div>
    </header>
  );
}
