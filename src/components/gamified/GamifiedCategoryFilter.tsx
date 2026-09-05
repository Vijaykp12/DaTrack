'use client';

import React from 'react';
import { ActivityCategory, DailySummary } from '@/types';
import { CATEGORIES, CATEGORY_LIST } from '@/lib/categories';
import { formatMinutes } from '@/lib/formatters';
import { Briefcase, Dumbbell, Utensils, Film, AlertTriangle, Layers } from 'lucide-react';

export interface GamifiedCategoryFilterProps {
  summary?: DailySummary;
  selectedCategory: ActivityCategory | 'ALL';
  onSelectCategory: (cat: ActivityCategory | 'ALL') => void;
  onOpenAddCategory?: (cat: ActivityCategory) => void;
}

export function GamifiedCategoryFilter({
  summary,
  selectedCategory,
  onSelectCategory,
  onOpenAddCategory,
}: GamifiedCategoryFilterProps) {
  const getMinutesForCategory = (cat: ActivityCategory): number => {
    if (!summary) return 0;
    switch (cat) {
      case 'PRODUCTIVE_WORK':
        return summary.productiveMinutes || 0;
      case 'PERSONAL_WORK':
        return summary.personalMinutes || 0;
      case 'DAILY_NECESSITIES':
        return summary.necessitiesMinutes || 0;
      case 'ENTERTAINMENT':
        return summary.entertainmentMinutes || 0;
      case 'DISTRACTIONS':
        return summary.distractionMinutes || 0;
      default:
        return 0;
    }
  };

  const getCategoryIcon = (cat: ActivityCategory) => {
    switch (cat) {
      case 'PRODUCTIVE_WORK':
        return <Briefcase className="w-4 h-4" />;
      case 'PERSONAL_WORK':
        return <Dumbbell className="w-4 h-4" />;
      case 'DAILY_NECESSITIES':
        return <Utensils className="w-4 h-4" />;
      case 'ENTERTAINMENT':
        return <Film className="w-4 h-4" />;
      case 'DISTRACTIONS':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="game-card p-4 sm:p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm sm:text-base font-bold text-[#141D26]">
            Categories
          </h3>
        </div>
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`text-xs font-semibold px-2 py-0.5 rounded-lg transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-[#141D26] text-[#C6F432]'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          View All
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
        {CATEGORY_LIST.slice(0, 4).map((catKey) => {
          const meta = CATEGORIES[catKey];
          const minutes = getMinutesForCategory(catKey);
          const isSelected = selectedCategory === catKey;

          return (
            <button
              key={catKey}
              onClick={() => onSelectCategory(isSelected ? 'ALL' : catKey)}
              className={`flex items-center justify-between p-2.5 rounded-2xl text-left transition-all ${
                isSelected
                  ? 'bg-slate-100 ring-2 ring-[#C6F432] shadow-sm'
                  : 'bg-slate-50/60 hover:bg-slate-100/80 border border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs"
                  style={{
                    backgroundColor: isSelected ? '#141D26' : `${meta.color}20`,
                    color: isSelected ? '#C6F432' : meta.color,
                  }}
                >
                  {getCategoryIcon(catKey)}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#141D26] truncate">
                    {meta.label}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold truncate">
                    {formatMinutes(minutes)}
                  </p>
                </div>
              </div>

              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: meta.color }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
