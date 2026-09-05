'use client';

import React from 'react';
import { Zap, Brain, Sparkles, Activity } from 'lucide-react';

export interface GamifiedPulseCardProps {
  score?: number;
  averageHours?: string;
}

export function GamifiedPulseCard({
  score = 78,
  averageHours = '5.4h',
}: GamifiedPulseCardProps) {
  return (
    <div className="game-card p-4 sm:p-5 flex flex-col justify-between space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm sm:text-base font-bold text-[#141D26]">
            Focus & Flow Pulse
          </h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C6F432] text-[#141D26]">
          Active
        </span>
      </div>

      {/* Radar Target Rings Graphic */}
      <div className="relative flex items-center justify-center py-2">
        {/* Outermost Ring */}
        <div className="w-32 h-32 rounded-full bg-[#E9F9C3]/40 border border-[#C6F432]/30 flex items-center justify-center animate-radar">
          {/* Middle Ring */}
          <div className="w-24 h-24 rounded-full bg-[#D6FA52]/60 flex items-center justify-center shadow-md shadow-[#C6F432]/20">
            {/* Inner Core */}
            <div className="w-16 h-16 rounded-full bg-[#C6F432] flex items-center justify-center text-[#141D26] shadow-lg shadow-[#C6F432]/40">
              <Brain className="w-8 h-8 stroke-[2.2] animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span>Average</span>
          </div>
          <p className="text-xs sm:text-sm font-black text-[#141D26] mt-0.5">
            {averageHours}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6F432]" />
            <span>Flow Index</span>
          </div>
          <p className="text-xs sm:text-sm font-black text-[#141D26] mt-0.5">
            {score}%
          </p>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            <span>Target</span>
          </div>
          <p className="text-xs sm:text-sm font-black text-[#141D26] mt-0.5">
            8.0h
          </p>
        </div>
      </div>
    </div>
  );
}
