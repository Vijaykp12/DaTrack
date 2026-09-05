'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Target } from 'lucide-react';
import { toast } from 'sonner';

export function GamifiedTaskQuest() {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleToggle = () => {
    const next = !isCompleted;
    setIsCompleted(next);
    if (next) {
      toast.success('🎉 Quest Completed! +50 XP earned!', {
        description: 'Deep Focus Block logged for today. Level 12 Progress updated!',
      });
    }
  };

  return (
    <div className="game-card p-4 sm:p-5 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <Target className="w-3.5 h-3.5 text-[#141D26]" />
          <span>Daily Habit Quest</span>
        </div>
        <h4 className={`text-sm sm:text-base font-extrabold text-[#141D26] ${isCompleted ? 'line-through opacity-50' : ''}`}>
          Deep Focus Coding Block
        </h4>
        <p className="text-[11px] font-semibold text-slate-400">
          Daily Goal &nbsp;|&nbsp; 90 mins target
        </p>
      </div>

      <button
        onClick={handleToggle}
        aria-label="Complete task"
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md shrink-0 ${
          isCompleted
            ? 'bg-[#C6F432] text-[#141D26] scale-105 shadow-[#C6F432]/40'
            : 'bg-[#141D26] text-[#C6F432] hover:scale-105 hover:bg-slate-800'
        }`}
      >
        <Check className="w-6 h-6 stroke-[3]" />
      </button>
    </div>
  );
}
