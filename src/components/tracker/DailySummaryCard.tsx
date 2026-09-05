'use client';

import React from 'react';
import { DailySummary } from '@/types';
import { formatMinutes } from '@/lib/formatters';
import { CATEGORIES } from '@/lib/categories';
import { Zap, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export interface DailySummaryCardProps {
  summary: DailySummary;
}

export function DailySummaryCard({ summary }: DailySummaryCardProps) {
  const {
    totalMinutes,
    productiveMinutes,
    distractionMinutes,
    entertainmentMinutes,
    necessitiesMinutes,
    personalMinutes,
    productivityScore,
    entriesCount,
  } = summary;

  // Percentage of 24h tracked
  const totalDayMinutes = 24 * 60;
  const dayProgressPct = Math.min(100, Math.round((totalMinutes / totalDayMinutes) * 100));

  // Category percentage shares of the tracked time
  const prodPct = totalMinutes > 0 ? (productiveMinutes / totalMinutes) * 100 : 0;
  const persPct = totalMinutes > 0 ? (personalMinutes / totalMinutes) * 100 : 0;
  const necPct = totalMinutes > 0 ? (necessitiesMinutes / totalMinutes) * 100 : 0;
  const entPct = totalMinutes > 0 ? (entertainmentMinutes / totalMinutes) * 100 : 0;
  const distPct = totalMinutes > 0 ? (distractionMinutes / totalMinutes) * 100 : 0;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-4">
      {/* Top Stat Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Total Logged Today
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {formatMinutes(totalMinutes)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({entriesCount} {entriesCount === 1 ? 'activity' : 'activities'})
              </span>
            </div>
          </div>
        </div>

        {/* Productivity Score Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-card/80 border border-white/10 px-3.5 py-2 rounded-xl">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground font-medium">
              Productivity Score:
            </span>
          </div>
          <span
            className={`text-sm font-bold ${
              productivityScore >= 60
                ? 'text-emerald-400'
                : productivityScore >= 40
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {productivityScore}%
          </span>
        </div>
      </div>

      {/* Multi-segment Proportional Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>Time Distribution Breakdown</span>
          <span>{dayProgressPct}% of 24 Hours</span>
        </div>

        {totalMinutes > 0 ? (
          <div className="h-3 w-full rounded-full bg-secondary/80 overflow-hidden flex shadow-inner">
            {prodPct > 0 && (
              <div
                style={{ width: `${prodPct}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Productive Work: ${formatMinutes(productiveMinutes)} (${Math.round(prodPct)}%)`}
              />
            )}
            {persPct > 0 && (
              <div
                style={{ width: `${persPct}%` }}
                className="bg-violet-500 h-full transition-all duration-300"
                title={`Personal Work: ${formatMinutes(personalMinutes)} (${Math.round(persPct)}%)`}
              />
            )}
            {necPct > 0 && (
              <div
                style={{ width: `${necPct}%` }}
                className="bg-sky-500 h-full transition-all duration-300"
                title={`Daily Necessities: ${formatMinutes(necessitiesMinutes)} (${Math.round(necPct)}%)`}
              />
            )}
            {entPct > 0 && (
              <div
                style={{ width: `${entPct}%` }}
                className="bg-amber-500 h-full transition-all duration-300"
                title={`Entertainment: ${formatMinutes(entertainmentMinutes)} (${Math.round(entPct)}%)`}
              />
            )}
            {distPct > 0 && (
              <div
                style={{ width: `${distPct}%` }}
                className="bg-rose-500 h-full transition-all duration-300"
                title={`Distractions: ${formatMinutes(distractionMinutes)} (${Math.round(distPct)}%)`}
              />
            )}
          </div>
        ) : (
          <div className="h-3 w-full rounded-full bg-secondary/50 flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground">No activities logged yet</span>
          </div>
        )}
      </div>

      {/* Mini category stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <div className="truncate">
            <p className="text-[10px] text-muted-foreground truncate">Productive</p>
            <p className="text-xs font-bold text-emerald-400">{formatMinutes(productiveMinutes)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
          <div className="truncate">
            <p className="text-[10px] text-muted-foreground truncate">Personal</p>
            <p className="text-xs font-bold text-violet-400">{formatMinutes(personalMinutes)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
          <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
          <div className="truncate">
            <p className="text-[10px] text-muted-foreground truncate">Necessities</p>
            <p className="text-xs font-bold text-sky-400">{formatMinutes(necessitiesMinutes)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <div className="truncate">
            <p className="text-[10px] text-muted-foreground truncate">Entertainment</p>
            <p className="text-xs font-bold text-amber-400">{formatMinutes(entertainmentMinutes)}</p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <div className="truncate">
            <p className="text-[10px] text-muted-foreground truncate">Distractions</p>
            <p className="text-xs font-bold text-rose-400">{formatMinutes(distractionMinutes)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
