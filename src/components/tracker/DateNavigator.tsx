'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { formatDateLabel, getTodayDateString } from '@/lib/formatters';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { subDays, addDays, format, parseISO } from 'date-fns';

export interface DateNavigatorProps {
  currentDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
}

export function DateNavigator({ currentDate, onDateChange }: DateNavigatorProps) {
  const isToday = currentDate === getTodayDateString();

  const handlePrevDay = () => {
    const [year, month, day] = currentDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const prev = subDays(dateObj, 1);
    onDateChange(format(prev, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const [year, month, day] = currentDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const next = addDays(dateObj, 1);
    onDateChange(format(next, 'yyyy-MM-dd'));
  };

  const handleToday = () => {
    onDateChange(getTodayDateString());
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 glass-card rounded-2xl p-3 sm:p-4">
      {/* Date Navigation Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevDay}
          aria-label="Previous day"
          className="h-9 w-9 p-0 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="relative flex items-center">
          <input
            type="date"
            value={currentDate}
            onChange={(e) => {
              if (e.target.value) {
                onDateChange(e.target.value);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            aria-label="Select custom date"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card/80 border border-white/10 rounded-xl hover:border-white/20 transition-colors cursor-pointer">
            <CalendarIcon className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-semibold tracking-tight text-foreground whitespace-nowrap">
              {formatDateLabel(currentDate)}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextDay}
          aria-label="Next day"
          className="h-9 w-9 p-0 rounded-xl"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Jump to Today if not on today */}
      {!isToday && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleToday}
          className="text-xs text-primary hover:text-primary-foreground hover:bg-primary font-medium rounded-xl gap-1.5 h-9"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Jump to Today</span>
        </Button>
      )}
    </div>
  );
}
