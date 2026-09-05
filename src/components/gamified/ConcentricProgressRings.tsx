'use client';

import React from 'react';
import { ChevronDown, Target } from 'lucide-react';
import { DailySummary } from '@/types';

export interface ConcentricProgressRingsProps {
  summary?: DailySummary;
}

export function ConcentricProgressRings({ summary }: ConcentricProgressRingsProps) {
  const total = summary?.totalMinutes || 1;
  const prodPct = summary ? Math.min(100, Math.round((summary.productiveMinutes / total) * 100)) : 65;
  const persPct = summary ? Math.min(100, Math.round((summary.personalMinutes / total) * 100)) : 45;
  const necPct = summary ? Math.min(100, Math.round((summary.necessitiesMinutes / total) * 100)) : 30;
  const score = summary?.productivityScore || 70;

  // SVG Ring Calculations
  const r1 = 44;
  const c1 = 2 * Math.PI * r1;
  const offset1 = c1 - (Math.max(10, prodPct) / 100) * c1;

  const r2 = 33;
  const c2 = 2 * Math.PI * r2;
  const offset2 = c2 - (Math.max(10, persPct) / 100) * c2;

  const r3 = 22;
  const c3 = 2 * Math.PI * r3;
  const offset3 = c3 - (Math.max(10, necPct) / 100) * c3;

  return (
    <div className="game-card p-4 sm:p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm sm:text-base font-bold text-[#141D26]">
            Life Balance Rings
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-semibold">
          Daily Goal
        </span>
      </div>

      <div>
        <div className="text-xl sm:text-2xl font-black text-[#141D26] tracking-tight">
          {score}%
        </div>
        <p className="text-[11px] text-slate-400 font-semibold">
          Overall Habit Completion
        </p>
      </div>

      {/* Concentric Rings + Legend Grid */}
      <div className="flex items-center gap-4 pt-1">
        {/* Triple Rings SVG */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background tracks */}
            <circle
              cx="50"
              cy="50"
              r={r1}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r={r2}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r={r3}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="6"
            />

            {/* Active Outer Ring (Lime) */}
            <circle
              cx="50"
              cy="50"
              r={r1}
              fill="none"
              stroke="#C6F432"
              strokeWidth="6"
              strokeDasharray={c1}
              strokeDashoffset={offset1}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />

            {/* Active Middle Ring (Dark Charcoal) */}
            <circle
              cx="50"
              cy="50"
              r={r2}
              fill="none"
              stroke="#141D26"
              strokeWidth="6"
              strokeDasharray={c2}
              strokeDashoffset={offset2}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />

            {/* Active Inner Ring (Olive) */}
            <circle
              cx="50"
              cy="50"
              r={r3}
              fill="none"
              stroke="#84CC16"
              strokeWidth="6"
              strokeDasharray={c3}
              strokeDashoffset={offset3}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C6F432] shrink-0" />
            <span className="truncate">Productive: <span className="font-bold text-[#141D26]">{prodPct}%</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#141D26] shrink-0" />
            <span className="truncate">Personal: <span className="font-bold text-[#141D26]">{persPct}%</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#84CC16] shrink-0" />
            <span className="truncate">Necessities: <span className="font-bold text-[#141D26]">{necPct}%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
