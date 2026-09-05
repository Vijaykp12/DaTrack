'use client';

import React, { useState } from 'react';
import { ChevronDown, BarChart2 } from 'lucide-react';
import { formatMinutes } from '@/lib/formatters';

export interface DayActivityData {
  dayName: string;
  productiveMinutes: number;
  habitsMinutes: number;
  wastedMinutes: number;
  totalMinutes: number;
}

export interface CapsuleActivityChartProps {
  data?: DayActivityData[];
}

const defaultWeeklyData: DayActivityData[] = [
  { dayName: 'Thu', productiveMinutes: 240, habitsMinutes: 90, wastedMinutes: 45, totalMinutes: 375 },
  { dayName: 'Fri', productiveMinutes: 300, habitsMinutes: 60, wastedMinutes: 30, totalMinutes: 390 },
  { dayName: 'Sat', productiveMinutes: 120, habitsMinutes: 180, wastedMinutes: 90, totalMinutes: 390 },
  { dayName: 'Sun', productiveMinutes: 90, habitsMinutes: 210, wastedMinutes: 60, totalMinutes: 360 },
  { dayName: 'Mon', productiveMinutes: 330, habitsMinutes: 60, wastedMinutes: 30, totalMinutes: 420 },
  { dayName: 'Tue', productiveMinutes: 270, habitsMinutes: 90, wastedMinutes: 45, totalMinutes: 405 },
  { dayName: 'Wed', productiveMinutes: 240, habitsMinutes: 120, wastedMinutes: 60, totalMinutes: 420 },
];

export function CapsuleActivityChart({ data = defaultWeeklyData }: CapsuleActivityChartProps) {
  const [activeRange, setActiveRange] = useState<'thisWeek' | 'lastWeek'>('thisWeek');
  const [hoveredDay, setHoveredDay] = useState<DayActivityData | null>(null);

  const maxMinutes = 480; // 8 hours max scale

  return (
    <div className="game-card p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm sm:text-base font-bold text-[#141D26]">
            Weekly Activity Progression
          </h3>
        </div>
        <button
          onClick={() => setActiveRange((prev) => (prev === 'thisWeek' ? 'lastWeek' : 'thisWeek'))}
          className="flex items-center gap-1 text-xs text-slate-600 font-semibold bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/80 transition-colors"
        >
          <span>{activeRange === 'thisWeek' ? 'This Week' : 'Last Week'}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 7 Vertical Capsule Bars */}
      <div className="h-44 sm:h-48 flex items-end justify-between px-2 sm:px-4 pt-2">
        {data.map((day, idx) => {
          const prodPct = Math.min(65, (day.productiveMinutes / maxMinutes) * 100);
          const habitPct = Math.min(35, (day.habitsMinutes / maxMinutes) * 100);

          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 group cursor-pointer relative"
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {/* Tooltip on hover */}
              {hoveredDay?.dayName === day.dayName && (
                <div className="absolute -top-14 bg-[#141D26] text-white px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap shadow-2xl z-20 pointer-events-none animate-fade-in border border-slate-700">
                  <span className="text-[#C6F432]">Productive: {formatMinutes(day.productiveMinutes)}</span>
                  <br />
                  <span className="text-slate-300">Habits: {formatMinutes(day.habitsMinutes)}</span>
                </div>
              )}

              {/* Vertical Capsule Pillar */}
              <div className="w-3 sm:w-3.5 h-36 bg-slate-100 rounded-full flex flex-col justify-end overflow-hidden p-0.5 relative group-hover:scale-110 transition-transform">
                {/* Top Lime Segment (Personal Work & Habits) */}
                <div
                  className="w-full bg-[#C6F432] rounded-full transition-all duration-500"
                  style={{ height: `${habitPct}%` }}
                />
                {/* Bottom Dark Segment (Productive Work) */}
                <div
                  className="w-full bg-[#141D26] rounded-full mt-0.5 transition-all duration-500"
                  style={{ height: `${prodPct}%` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#141D26] transition-colors">
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Legend */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2 border-t border-slate-100 text-[10px] sm:text-[11px] font-semibold text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#141D26]" />
          <span>Productive Work</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C6F432]" />
          <span>Personal Habits</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <span>Daily Target</span>
        </div>
      </div>
    </div>
  );
}
