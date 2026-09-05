'use client';

import React from 'react';
import { DateRangePreset } from '@/types';
import { Input } from '@/components/ui/Input';
import { Filter } from 'lucide-react';
import { subDays, format, startOfMonth } from 'date-fns';
import { getTodayDateString } from '@/lib/formatters';

export interface DateRangePickerProps {
  activePreset: DateRangePreset;
  startDate: string;
  endDate: string;
  onRangeChange: (preset: DateRangePreset, start: string, end: string) => void;
}

export function DateRangePicker({
  activePreset,
  startDate,
  endDate,
  onRangeChange,
}: DateRangePickerProps) {
  const handleSelectPreset = (preset: DateRangePreset) => {
    const now = new Date();
    const today = getTodayDateString();

    switch (preset) {
      case 'today':
        onRangeChange('today', today, today);
        break;
      case '7d': {
        const start = format(subDays(now, 6), 'yyyy-MM-dd');
        onRangeChange('7d', start, today);
        break;
      }
      case '30d': {
        const start = format(subDays(now, 29), 'yyyy-MM-dd');
        onRangeChange('30d', start, today);
        break;
      }
      case 'month': {
        const start = format(startOfMonth(now), 'yyyy-MM-dd');
        onRangeChange('month', start, today);
        break;
      }
      case 'custom':
        onRangeChange('custom', startDate, endDate);
        break;
    }
  };

  return (
    <div className="game-card p-4 sm:p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#141D26]" />
          <span className="text-xs sm:text-sm font-bold text-[#141D26]">
            Analytics Time Range
          </span>
        </div>

        {/* Range preset tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {(['today', '7d', '30d', 'month', 'custom'] as DateRangePreset[]).map((preset) => {
            const labels: Record<DateRangePreset, string> = {
              today: 'Today',
              '7d': 'Last 7 Days',
              '30d': 'Last 30 Days',
              month: 'This Month',
              all: 'All Time',
              custom: 'Custom',
            };
            const isSelected = activePreset === preset;

            return (
              <button
                key={preset}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-[#141D26] text-[#C6F432] shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {labels[preset]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Date inputs */}
      {activePreset === 'custom' && (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100 animate-fade-in">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap">From:</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onRangeChange('custom', e.target.value, endDate)}
              className="h-9 text-xs bg-slate-50 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap">To:</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onRangeChange('custom', startDate, e.target.value)}
              className="h-9 text-xs bg-slate-50 rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
