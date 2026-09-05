'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ActivityEntryItem, DailySummary, ActivityCategory } from '@/types';
import { GamifiedSidebar } from '@/components/gamified/GamifiedSidebar';
import { GamifiedHeader } from '@/components/gamified/GamifiedHeader';
import { GamifiedMetricCards } from '@/components/gamified/GamifiedMetricCards';
import { HorizontalDateSchedule } from '@/components/gamified/HorizontalDateSchedule';
import { CapsuleActivityChart, DayActivityData } from '@/components/gamified/CapsuleActivityChart';
import { ConcentricProgressRings } from '@/components/gamified/ConcentricProgressRings';
import { GamifiedPulseCard } from '@/components/gamified/GamifiedPulseCard';
import { GamifiedCategoryFilter } from '@/components/gamified/GamifiedCategoryFilter';
import { GamifiedTaskQuest } from '@/components/gamified/GamifiedTaskQuest';
import { EntryList } from './EntryList';
import { AddEntryModal } from './AddEntryModal';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { getTodayDateString } from '@/lib/formatters';
import {
  calculateDailySummary,
  calculateWeeklyCapsules,
  getLocalEntries,
  saveLocalEntries,
  mergeEntries,
} from '@/lib/calculations';
import { toast } from 'sonner';

export interface TrackerClientProps {
  initialDate: string;
  initialEntries: ActivityEntryItem[];
  initialSummary: DailySummary;
  initialWeeklyCapsules?: DayActivityData[];
  initialError?: string;
}

export function TrackerClient({
  initialDate,
  initialEntries,
  initialSummary,
  initialWeeklyCapsules,
}: TrackerClientProps) {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || getTodayDateString());
  
  // All known activities across all days for instant reactivity
  const [allActivities, setAllActivities] = useState<ActivityEntryItem[]>(() => {
    return initialEntries || [];
  });

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'ALL'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ActivityEntryItem | null>(null);

  // Derive filtered entries for selected date
  const dayEntries = allActivities
    .filter((item) => item.date === selectedDate)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Derive summary and weekly capsules in real-time
  const summary: DailySummary = calculateDailySummary(allActivities, selectedDate);
  const weeklyCapsules: DayActivityData[] = calculateWeeklyCapsules(allActivities, selectedDate);

  // Sync with server & local storage
  const fetchDateEntries = useCallback(async (date: string) => {
    try {
      const res = await fetch(`/api/entries?date=${date}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.entries)) {
        const local = getLocalEntries();
        const merged = mergeEntries(data.entries, local);
        setAllActivities(merged);
        saveLocalEntries(merged);
      }
    } catch {
      // Offline fallback: load from local storage
      const local = getLocalEntries();
      if (local.length > 0) {
        setAllActivities((prev) => mergeEntries(prev, local));
      }
    }
  }, []);

  // Initialize from LocalStorage on mount & auto-sync
  useEffect(() => {
    const local = getLocalEntries();
    if (local.length > 0) {
      setAllActivities((prev) => mergeEntries(prev, local));
    }
    fetchDateEntries(selectedDate);

    const handleFocus = () => {
      fetchDateEntries(selectedDate);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDateEntries(selectedDate);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchDateEntries, selectedDate]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    fetchDateEntries(newDate);
  };

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: ActivityEntryItem) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  // Instant real-time update when entry is added or edited
  const handleModalSuccess = (entry: ActivityEntryItem, isEdit: boolean) => {
    setAllActivities((prev) => {
      let updated: ActivityEntryItem[];
      if (isEdit) {
        updated = prev.map((e) => (e.id === entry.id ? entry : e));
      } else {
        const withoutCurrent = prev.filter((e) => e.id !== entry.id);
        updated = [entry, ...withoutCurrent];
      }
      saveLocalEntries(updated);
      return updated;
    });

    if (entry.date !== selectedDate) {
      setSelectedDate(entry.date);
    }
  };

  // Instant real-time delete
  const handleDeleteEntry = async (id: string) => {
    setAllActivities((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveLocalEntries(updated);
      return updated;
    });

    toast.success('Activity removed');

    try {
      await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
        headers: { 'Cache-Control': 'no-cache' },
      });
    } catch {
      // Already removed locally
    }
  };

  const displayedEntries =
    selectedCategory === 'ALL'
      ? dayEntries
      : dayEntries.filter((e) => e.category === selectedCategory);

  const productiveHoursDecimal = ((summary?.productiveMinutes || 0) / 60).toFixed(1) + 'h';

  return (
    <div className="min-h-screen flex bg-[#E9F1EB] text-[#141D26]">
      {/* Dark Sidebar */}
      <GamifiedSidebar onOpenAdd={handleOpenAdd} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <GamifiedHeader onOpenAdd={handleOpenAdd} />

          {/* Top 4 Metric Cards */}
          <GamifiedMetricCards summary={summary} />

          {/* Main 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (Categories + Life Balance Rings) - 4 Cols */}
            <div className="lg:col-span-4 space-y-5">
              <GamifiedCategoryFilter
                summary={summary}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <ConcentricProgressRings summary={summary} />
            </div>

            {/* Middle Column (Activity Capsules + Schedule Strip) - 5 Cols */}
            <div className="lg:col-span-5 space-y-5">
              <CapsuleActivityChart data={weeklyCapsules} />
              <HorizontalDateSchedule
                selectedDate={selectedDate}
                onSelectDate={handleDateChange}
              />
            </div>

            {/* Right Column (Focus Flow Pulse + Daily Habit Quest) - 3 Cols */}
            <div className="lg:col-span-3 space-y-5">
              <GamifiedPulseCard
                score={summary?.productivityScore || 0}
                averageHours={productiveHoursDecimal}
              />
              <GamifiedTaskQuest />
            </div>
          </div>

          {/* Detailed Activity Log List */}
          <div className="pt-2">
            <EntryList
              entries={displayedEntries}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteEntry}
              onOpenAddEntry={handleOpenAdd}
            />
          </div>
        </div>
      </div>

      {/* Add / Edit Entry Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        editingEntry={editingEntry}
        onSuccess={handleModalSuccess}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenAddEntry={handleOpenAdd} />
    </div>
  );
}
