'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types';
import { formatMinutes } from '@/lib/formatters';
import { Clock, Briefcase, AlertTriangle, Zap, Flame, ArrowUp } from 'lucide-react';

export interface MetricCardsProps {
  summary: AnalyticsSummary;
}

export function MetricCards({ summary }: MetricCardsProps) {
  const {
    totalMinutes,
    productiveMinutes,
    wastedMinutes,
    productivityScore,
    dailyAverageMinutes,
    totalEntriesCount,
  } = summary;

  const productivePct =
    totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 0;
  const wastedPct =
    totalMinutes > 0 ? Math.round((wastedMinutes / totalMinutes) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* Total Time Tracked Card */}
      <div className="game-card p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Total Tracked
          </span>
          <div className="w-8 h-8 rounded-full bg-[#141D26] flex items-center justify-center text-[#C6F432]">
            <Clock className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-[#141D26] tracking-tight">
            {formatMinutes(totalMinutes)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-100 mt-1">
            <span>Avg / day:</span>
            <span className="font-bold text-slate-700">{formatMinutes(dailyAverageMinutes)}</span>
          </div>
        </div>
      </div>

      {/* Productive Work Card */}
      <div className="game-card p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Productive Work
          </span>
          <div className="w-8 h-8 rounded-full bg-[#C6F432] flex items-center justify-center text-[#141D26]">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-[#141D26] tracking-tight">
            {formatMinutes(productiveMinutes)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-100 mt-1">
            <span>Share of Total:</span>
            <span className="font-bold text-emerald-600">{productivePct}%</span>
          </div>
        </div>
      </div>

      {/* Wasted Time Card */}
      <div className="game-card p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Wasted Time
          </span>
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-[#141D26] tracking-tight">
            {formatMinutes(wastedMinutes)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-100 mt-1">
            <span>Distractions + Rec:</span>
            <span className="font-bold text-rose-600">{wastedPct}%</span>
          </div>
        </div>
      </div>

      {/* Productivity Score Card */}
      <div className="game-card p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Productivity Score
          </span>
          <div className="w-8 h-8 rounded-full bg-[#141D26] flex items-center justify-center text-[#C6F432]">
            <Zap className="w-4 h-4 fill-current stroke-none" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#141D26] tracking-tight">
              {productivityScore}%
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {productivityScore >= 60 ? 'High Focus' : 'Moderate'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-100 mt-1">
            <span>Logged items:</span>
            <span className="font-bold text-slate-700">{totalEntriesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
