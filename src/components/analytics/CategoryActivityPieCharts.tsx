'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CategoryBreakdownData, ActivityCategory } from '@/types';
import { CATEGORIES } from '@/lib/categories';
import { formatMinutes } from '@/lib/formatters';
import { CategoryIcon } from '@/components/ui/Badge';
import { PieChart as PieIcon, Layers, Trophy, Clock, Plus } from 'lucide-react';

export interface CategoryActivityPieChartsProps {
  breakdown: CategoryBreakdownData[];
  onOpenAddEntry?: () => void;
}

// Harmonious monochromatic shades for each category's activity slices
const CATEGORY_SLICE_PALETTES: Record<ActivityCategory, string[]> = {
  PRODUCTIVE_WORK: ['#10B981', '#059669', '#34D399', '#6EE7B7', '#047857', '#A7F3D0'],
  PERSONAL_WORK: ['#8B5CF6', '#7C3AED', '#A78BFA', '#6D28D9', '#C4B5FD', '#5B21B6'],
  DAILY_NECESSITIES: ['#0EA5E9', '#0284C7', '#38BDF8', '#0369A1', '#7DD3FC', '#075985'],
  ENTERTAINMENT: ['#F59E0B', '#D97706', '#FBBF24', '#B45309', '#FCD34D', '#92400E'],
  DISTRACTIONS: ['#F43F5E', '#E11D48', '#FB7185', '#BE123C', '#FDA4AF', '#9F1239'],
};

export function CategoryActivityPieCharts({
  breakdown,
  onOpenAddEntry,
}: CategoryActivityPieChartsProps) {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#141D26] flex items-center justify-center text-[#C6F432] shadow-xs">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-[#141D26]">
              Activity Contribution Breakdown by Category
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              See exactly which activities contributed how much to each category score
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Individual Category Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {breakdown.map((item) => (
          <SingleCategoryPieCard
            key={item.category}
            data={item}
            onOpenAddEntry={onOpenAddEntry}
          />
        ))}
      </div>
    </div>
  );
}

function SingleCategoryPieCard({
  data,
  onOpenAddEntry,
}: {
  data: CategoryBreakdownData;
  onOpenAddEntry?: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const meta = CATEGORIES[data.category];
  const palette = CATEGORY_SLICE_PALETTES[data.category] || CATEGORY_SLICE_PALETTES.PRODUCTIVE_WORK;

  // Prepare chart items
  const chartData = data.topActivities.map((act, index) => {
    const activityShare =
      data.totalMinutes > 0
        ? Math.round((act.duration / data.totalMinutes) * 100)
        : 0;

    return {
      name: act.title,
      value: act.duration,
      percentage: activityShare,
      count: act.count,
      color: palette[index % palette.length],
    };
  });

  const activeItem = activeIdx !== null ? chartData[activeIdx] : null;

  return (
    <div className="game-card p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all space-y-4 border border-slate-200/80">
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: meta.color }}
      />

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
            style={{ backgroundColor: meta.color }}
          >
            <CategoryIcon category={data.category} className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-[#141D26]">
              {data.label}
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold">
              {data.entryCount} {data.entryCount === 1 ? 'activity' : 'activities'} logged
            </p>
          </div>
        </div>

        <div className="text-right">
          <span
            className="text-base sm:text-lg font-black block"
            style={{ color: meta.color }}
          >
            {formatMinutes(data.totalMinutes)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 block -mt-1">
            {data.percentage}% of overall time
          </span>
        </div>
      </div>

      {/* Pie Chart Representation */}
      {chartData.length > 0 && data.totalMinutes > 0 ? (
        <div className="space-y-3">
          <div className="relative h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, idx) => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(null)}
                  animationDuration={600}
                >
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      className="cursor-pointer transition-all duration-200 hover:opacity-85"
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#141D26] text-white border border-slate-700 p-2.5 rounded-xl shadow-2xl space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: d.color }}
                            />
                            <span className="text-xs font-bold text-white truncate max-w-[140px]">
                              {d.name}
                            </span>
                          </div>
                          <div className="text-xs font-extrabold text-[#C6F432]">
                            {formatMinutes(d.value)}
                          </div>
                          <div className="text-[10px] text-slate-300">
                            {d.percentage}% of {data.label}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Overlay Stats */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {activeItem ? (
                <div className="text-center space-y-0.5 animate-fade-in px-2">
                  <span className="text-[10px] font-bold text-slate-400 block truncate max-w-[90px]">
                    {activeItem.name}
                  </span>
                  <span
                    className="text-xs sm:text-sm font-black block"
                    style={{ color: activeItem.color }}
                  >
                    {activeItem.percentage}%
                  </span>
                </div>
              ) : (
                <div className="text-center space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                    Total
                  </span>
                  <span
                    className="text-xs sm:text-sm font-black block"
                    style={{ color: meta.color }}
                  >
                    {formatMinutes(data.totalMinutes)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Breakdown Item List */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Contribution to {data.label}:
            </span>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {chartData.map((act, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(null)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    activeIdx === idx
                      ? 'bg-slate-100 ring-1 ring-slate-400'
                      : 'bg-slate-50/70 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: act.color }}
                    />
                    <span className="font-bold text-[#141D26] truncate">
                      {act.name}
                    </span>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span className="font-semibold text-slate-500">
                      {formatMinutes(act.value)}
                    </span>
                    <span
                      className="font-extrabold text-[11px] px-1.5 py-0.5 rounded-md text-white min-w-[36px] text-center"
                      style={{ backgroundColor: act.color }}
                    >
                      {act.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10 text-center flex flex-col items-center justify-center space-y-2 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-500">
            No activities logged under {data.label} yet
          </p>
          {onOpenAddEntry && (
            <button
              onClick={onOpenAddEntry}
              className="px-3 py-1.5 rounded-xl bg-[#141D26] text-[#C6F432] text-xs font-bold flex items-center gap-1 hover:bg-slate-800 active:scale-95 transition-all mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log {data.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
