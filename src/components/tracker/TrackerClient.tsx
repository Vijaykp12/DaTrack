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
import { getTodayDateString, formatMinutes } from '@/lib/formatters';
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
  const [entries, setEntries] = useState<ActivityEntryItem[]>(initialEntries || []);
  const [summary, setSummary] = useState<DailySummary>(initialSummary);
  const [weeklyCapsules, setWeeklyCapsules] = useState<DayActivityData[] | undefined>(initialWeeklyCapsules);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ActivityEntryItem | null>(null);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'ALL'>('ALL');

  // Fetch entries for a given date with zero caching
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
      if (res.ok) {
        setEntries(data.entries || []);
        if (data.summary) {
          setSummary(data.summary);
        }
        if (data.weeklyCapsules) {
          setWeeklyCapsules(data.weeklyCapsules);
        }
      }
    } catch {
      // Network failover
    }
  }, []);

  // Auto-fetch whenever the user views the tab or brings the app into focus
  useEffect(() => {
    // Initial fresh fetch on mount
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

  const handleModalSuccess = (entry: ActivityEntryItem, isEdit: boolean) => {
    if (entry.date === selectedDate) {
      // Optimistically update list
      setEntries((prev) => {
        if (isEdit) {
          return prev.map((e) => (e.id === entry.id ? entry : e));
        }
        const filtered = prev.filter((e) => e.id !== entry.id);
        return [entry, ...filtered];
      });
      fetchDateEntries(selectedDate);
    } else {
      toast.info(`Logged for ${entry.date}`);
      handleDateChange(entry.date);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    const prev = [...entries];
    // Optimistic delete
    setEntries((curr) => curr.filter((item) => item.id !== id));

    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        toast.success('Activity removed');
        fetchDateEntries(selectedDate);
      } else {
        setEntries(prev);
        toast.error('Failed to delete activity');
      }
    } catch {
      setEntries(prev);
      toast.error('Network error deleting activity');
    }
  };

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
              entries={entries}
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
