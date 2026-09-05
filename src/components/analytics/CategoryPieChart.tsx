'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CategoryBreakdownData } from '@/types';
import { formatMinutes } from '@/lib/formatters';
import { PieChart as PieChartIcon } from 'lucide-react';

export interface CategoryPieChartProps {
  breakdown: CategoryBreakdownData[];
  totalMinutes: number;
}

export function CategoryPieChart({
  breakdown,
  totalMinutes,
}: CategoryPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = breakdown
    .filter((item) => item.totalMinutes > 0)
    .map((item) => ({
      name: item.label,
      value: item.totalMinutes,
      color: item.color,
      category: item.category,
      percentage: item.percentage,
    }));

  const activeItem = activeIndex !== null ? chartData[activeIndex] : null;

  return (
    <div className="game-card p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#141D26] flex items-center justify-center text-[#C6F432]">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#141D26]">
              Time Distribution by Category
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Proportional breakdown of tracked activities
            </p>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="relative">
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      className="cursor-pointer transition-all duration-200 hover:opacity-85"
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#141D26] text-white border border-slate-700 p-3 rounded-2xl shadow-2xl space-y-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            <span className="text-xs font-bold text-white">
                              {data.name}
                            </span>
                          </div>
                          <div className="text-sm font-extrabold text-[#C6F432]">
                            {formatMinutes(data.value)}
                          </div>
                          <div className="text-[11px] text-slate-300">
                            {data.percentage}% of total tracked
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
            {activeItem ? (
              <div className="text-center space-y-0.5 animate-fade-in px-2">
                <span className="text-[11px] font-bold text-slate-400 block truncate max-w-[130px]">
                  {activeItem.name}
                </span>
                <span
                  className="text-lg sm:text-xl font-black block"
                  style={{ color: activeItem.color }}
                >
                  {formatMinutes(activeItem.value)}
                </span>
                <span className="text-[10px] text-slate-500 font-bold block">
                  {activeItem.percentage}%
                </span>
              </div>
            ) : (
              <div className="text-center space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Total
                </span>
                <span className="text-lg sm:text-xl font-black text-[#141D26] block">
                  {formatMinutes(totalMinutes)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold block">
                  100%
                </span>
              </div>
            )}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100">
            {breakdown.map((item) => (
              <div
                key={item.category}
                onMouseEnter={() => {
                  const idx = chartData.findIndex((c) => c.category === item.category);
                  if (idx !== -1) setActiveIndex(idx);
                }}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center gap-2 p-2 rounded-2xl border transition-all cursor-pointer ${
                  activeItem?.category === item.category
                    ? 'bg-slate-100 border-slate-400'
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="truncate flex-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#141D26] truncate">
                      {item.label}
                    </span>
                    <span className="font-black ml-1" style={{ color: item.color }}>
                      {item.percentage}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatMinutes(item.totalMinutes)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
          <PieChartIcon className="w-8 h-8 opacity-40" />
          <p className="text-xs">No activity entries recorded for this range.</p>
        </div>
      )}
    </div>
  );
}
