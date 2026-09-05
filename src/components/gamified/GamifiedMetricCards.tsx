'use client';

import React from 'react';
import { DailySummary } from '@/types';
import { formatMinutes } from '@/lib/formatters';
import { Zap, Clock, AlertTriangle, Flame, ArrowUp } from 'lucide-react';

export interface GamifiedMetricCardsProps {
  summary?: DailySummary;
}

export function GamifiedMetricCards({ summary }: GamifiedMetricCardsProps) {
  const totalMinutes = summary?.totalMinutes || 0;
  const productiveMinutes = summary?.productiveMinutes || 0;
  const productivityScore = summary?.productivityScore || 0;
  const distractionMinutes = summary?.distractionMinutes || 0;
  const entertainmentMinutes = summary?.entertainmentMinutes || 0;
  const personalMinutes = summary?.personalMinutes || 0;
  const entriesCount = summary?.entriesCount || 0;

  const wastedMinutes = distractionMinutes + entertainmentMinutes;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* Card 1: Productivity Score */}
      <div className="game-card p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#C6F432] flex items-center justify-center text-[#141D26] shrink-0">
            <Zap className="w-4 h-4 fill-current stroke-none" />
          </div>
          <span className="text-xs font-bold text-slate-700 truncate">
            Productivity Score
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-[#141D26] tracking-tight">
            {productivityScore}%
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-1">
            <span className="text-emerald-600 flex items-center">
              <ArrowUp className="w-3 h-3 stroke-[3]" /> {productivityScore >= 60 ? 'Optimal' : 'Active'}
            </span>
            <span>Focus Ratio</span>
          </div>
        </div>
      </div>

      {/* Card 2: Productive Focus Time */}
      <div className="game-card p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#141D26] flex items-center justify-center text-[#C6F432] shrink-0">
            <Clock className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-slate-700 truncate">
            Productive Work
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-[#141D26] tracking-tight">
            {formatMinutes(productiveMinutes)}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-1">
            <span className="text-emerald-600 font-bold">
              +{formatMinutes(personalMinutes)}
            </span>
            <span>Personal habits</span>
          </div>
        </div>
      </div>

      {/* Card 3: Wasted Time (Distractions + Entertainment) */}
      <div className="game-card p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#C6F432] flex items-center justify-center text-[#141D26] shrink-0">
            <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-slate-700 truncate">
            Wasted Time
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-[#141D26] tracking-tight">
            {formatMinutes(wastedMinutes)}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-1">
            <span className="text-rose-500 font-bold">
              {formatMinutes(distractionMinutes)}
            </span>
            <span>Distractions</span>
          </div>
        </div>
      </div>

      {/* Card 4: Total Tracked Time & Streak */}
      <div className="game-card p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#141D26] flex items-center justify-center text-[#C6F432] shrink-0">
            <Flame className="w-4 h-4 fill-current stroke-none text-[#C6F432]" />
          </div>
          <span className="text-xs font-bold text-slate-700 truncate">
            Total Logged
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-[#141D26] tracking-tight">
            {formatMinutes(totalMinutes)}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-1">
            <span className="text-amber-500 font-bold">🔥 14-Day Streak</span>
            <span>({entriesCount} logs)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
