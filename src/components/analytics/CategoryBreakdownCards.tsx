'use client';

import React from 'react';
import { CategoryBreakdownData } from '@/types';
import { CATEGORIES } from '@/lib/categories';
import { formatMinutes } from '@/lib/formatters';
import { CategoryIcon } from '@/components/ui/Badge';
import { Layers, Trophy } from 'lucide-react';

export interface CategoryBreakdownCardsProps {
  breakdown: CategoryBreakdownData[];
}

export function CategoryBreakdownCards({
  breakdown,
}: CategoryBreakdownCardsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#141D26] flex items-center justify-center text-[#C6F432]">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#141D26]">
            Category Breakdown & Top Activities
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Granular analysis of your top time-consumers per category
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {breakdown.map((item) => {
          const meta = CATEGORIES[item.category];

          return (
            <div
              key={item.category}
              className="game-card p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all space-y-4"
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: meta.color }}
              />

              {/* Category Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: meta.color }}
                    >
                      <CategoryIcon
                        category={item.category}
                        className="w-4 h-4"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-[#141D26]">
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        {item.entryCount} {item.entryCount === 1 ? 'log' : 'logs'} recorded
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className="text-base sm:text-lg font-black block"
                      style={{ color: meta.color }}
                    >
                      {formatMinutes(item.totalMinutes)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 block -mt-1">
                      {item.percentage}% of total
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, item.percentage)}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
              </div>

              {/* Top Activities */}
              <div className="space-y-2 pt-1 border-t border-slate-100 flex-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Top Activities</span>
                  </span>
                  <span>Time Spent</span>
                </div>

                {item.topActivities.length > 0 ? (
                  <div className="space-y-1.5">
                    {item.topActivities.map((act, idx) => {
                      const activityShare =
                        item.totalMinutes > 0
                          ? Math.round((act.duration / item.totalMinutes) * 100)
                          : 0;

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs border border-slate-100"
                        >
                          <div className="truncate mr-2">
                            <span className="font-bold text-[#141D26] block truncate">
                              {act.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {act.count}x logged ({activityShare}% of {item.label.toLowerCase()})
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-black text-[#141D26]">
                              {formatMinutes(act.duration)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                    No activities logged in this category
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
