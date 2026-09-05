'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DailyTrendPoint } from '@/types';
import { CATEGORIES } from '@/lib/categories';
import { formatMinutes } from '@/lib/formatters';
import { TrendingUp } from 'lucide-react';

export interface DailyTrendChartProps {
  trends: DailyTrendPoint[];
}

export function DailyTrendChart({ trends }: DailyTrendChartProps) {
  // Convert minutes into decimal hours for Y axis display
  const formattedData = trends.map((item) => ({
    ...item,
    productiveHours: Number((item.PRODUCTIVE_WORK / 60).toFixed(1)),
    personalHours: Number((item.PERSONAL_WORK / 60).toFixed(1)),
    necessitiesHours: Number((item.DAILY_NECESSITIES / 60).toFixed(1)),
    entertainmentHours: Number((item.ENTERTAINMENT / 60).toFixed(1)),
    distractionsHours: Number((item.DISTRACTIONS / 60).toFixed(1)),
  }));

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground">
              Daily Progression Trend
            </h3>
            <p className="text-xs text-muted-foreground">
              Day-by-day stacked category time allocation
            </p>
          </div>
        </div>
      </div>

      {trends.length > 0 ? (
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="displayDate"
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                unit="h"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const rawItem = trends.find((t) => t.displayDate === label);
                    const totalMins = rawItem ? rawItem.totalMinutes : 0;

                    return (
                      <div className="glass-card bg-[#0b101f]/95 border border-white/20 p-3 rounded-xl shadow-2xl space-y-2 min-w-[180px]">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                          <span className="text-xs font-bold text-white">
                            {label}
                          </span>
                          <span className="text-xs font-extrabold text-primary">
                            {formatMinutes(totalMins)}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          {payload.map((entry, idx) => {
                            const mins = Math.round(Number(entry.value) * 60);
                            if (mins <= 0) return null;
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px]"
                              >
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span>{entry.name}</span>
                                </span>
                                <span className="font-semibold text-foreground">
                                  {formatMinutes(mins)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Stacked Bars with Category Colors */}
              <Bar
                dataKey="productiveHours"
                name="Productive Work"
                stackId="a"
                fill={CATEGORIES.PRODUCTIVE_WORK.color}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="personalHours"
                name="Personal Work"
                stackId="a"
                fill={CATEGORIES.PERSONAL_WORK.color}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="necessitiesHours"
                name="Daily Necessities"
                stackId="a"
                fill={CATEGORIES.DAILY_NECESSITIES.color}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="entertainmentHours"
                name="Entertainment"
                stackId="a"
                fill={CATEGORIES.ENTERTAINMENT.color}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="distractionsHours"
                name="Distractions"
                stackId="a"
                fill={CATEGORIES.DISTRACTIONS.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-muted-foreground">
          <TrendingUp className="w-8 h-8 opacity-40" />
          <p className="text-xs">No daily trend data available.</p>
        </div>
      )}
    </div>
  );
}
