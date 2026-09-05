'use client';

import React, { useState, useMemo } from 'react';
import { ActivityCategory, ActivityEntryItem } from '@/types';
import { EntryItem } from './EntryItem';
import { CATEGORIES, CATEGORY_LIST } from '@/lib/categories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, ListFilter, Inbox, Sparkles } from 'lucide-react';

export interface EntryListProps {
  entries: ActivityEntryItem[];
  onEdit: (entry: ActivityEntryItem) => void;
  onDelete: (id: string) => void;
  onOpenAddEntry: () => void;
}

export function EntryList({
  entries,
  onEdit,
  onDelete,
  onOpenAddEntry,
}: EntryListProps) {
  const [selectedFilter, setSelectedFilter] = useState<ActivityCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchesCategory =
        selectedFilter === 'ALL' || item.category === selectedFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [entries, selectedFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search & Category Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-black text-[#141D26]">
            Daily Activity Log
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-xs font-bold text-slate-700">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-2xl bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0 ${
            selectedFilter === 'ALL'
              ? 'bg-[#141D26] text-[#C6F432] shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          All ({entries.length})
        </button>

        {CATEGORY_LIST.map((catKey) => {
          const meta = CATEGORIES[catKey];
          const count = entries.filter((e) => e.category === catKey).length;
          const isSelected = selectedFilter === catKey;

          return (
            <button
              key={catKey}
              onClick={() => setSelectedFilter(catKey)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0 border ${
                isSelected
                  ? 'bg-[#141D26] text-[#C6F432] border-[#141D26] shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: meta.color }}
              />
              <span>{meta.label}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Entries List or Empty State */}
      {filteredEntries.length > 0 ? (
        <div className="space-y-2.5">
          {filteredEntries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="game-card p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Inbox className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-[#141D26] text-base">
              {searchQuery || selectedFilter !== 'ALL'
                ? 'No matching activities found'
                : 'No activities logged for this day'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
              {searchQuery || selectedFilter !== 'ALL'
                ? 'Try clearing the search query or switching category filter.'
                : 'Log your focus sessions, workouts, or daily habits to earn XP!'}
            </p>
          </div>
          <button
            onClick={onOpenAddEntry}
            className="mt-2 px-4 py-2 rounded-2xl bg-[#141D26] text-[#C6F432] font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Activity</span>
          </button>
        </div>
      )}
    </div>
  );
}
