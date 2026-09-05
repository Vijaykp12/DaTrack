'use client';

import React from 'react';
import { format, subDays, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export interface HorizontalDateScheduleProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
}

export function HorizontalDateSchedule({
  selectedDate,
  onSelectDate,
}: HorizontalDateScheduleProps) {
  const [year, month, day] = selectedDate.split('-').map(Number);
  const currentObj = new Date(year, month - 1, day);

  // Generate 9 days around current selected date (4 before, current, 4 after)
  const days = [];
  for (let i = -4; i <= 4; i++) {
    const d = addDays(currentObj, i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    days.push({
      date: d,
      dateStr,
      dayName: format(d, 'EEE'), // Thu, Fri, Sat...
      dayNum: format(d, 'd'), // 15, 16, 17...
      isSelected: i === 0,
    });
  }

  return (
    <div className="game-card p-4 sm:p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-[#141D26]">
          Schedule
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) onSelectDate(e.target.value);
            }}
            className="text-xs text-slate-500 font-semibold bg-transparent border-0 cursor-pointer focus:outline-none"
          />
          <span className="text-xs text-slate-400 font-semibold cursor-pointer hover:text-slate-600">
            Show More
          </span>
        </div>
      </div>

      {/* Date Capsule Carousel */}
      <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {days.map((item) => {
          return (
            <button
              key={item.dateStr}
              onClick={() => onSelectDate(item.dateStr)}
              className={`flex flex-col items-center justify-center min-w-[42px] sm:min-w-[48px] py-2 px-1.5 rounded-full transition-all duration-200 select-none ${
                item.isSelected
                  ? 'bg-[#141D26] text-[#C6F432] ring-2 ring-[#C6F432] shadow-md scale-105'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80">
                {item.dayName}
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  item.isSelected
                    ? 'bg-[#C6F432] text-[#141D26]'
                    : 'text-slate-700'
                }`}
              >
                {item.dayNum}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
