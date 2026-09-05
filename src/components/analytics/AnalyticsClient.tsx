'use client';

import React, { useState, useCallback } from 'react';
import { AnalyticsSummary, DateRangePreset } from '@/types';
import { GamifiedSidebar } from '@/components/gamified/GamifiedSidebar';
import { GamifiedHeader } from '@/components/gamified/GamifiedHeader';
import { DateRangePicker } from './DateRangePicker';
import { MetricCards } from './MetricCards';
import { CategoryPieChart } from './CategoryPieChart';
import { DailyTrendChart } from './DailyTrendChart';
import { CategoryActivityPieCharts } from './CategoryActivityPieCharts';
import { AddEntryModal } from '@/components/tracker/AddEntryModal';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { getTodayDateString } from '@/lib/formatters';
import { Loader2, Plus, BarChart2, Inbox } from 'lucide-react';

export interface AnalyticsClientProps {
  initialSummary?: AnalyticsSummary;
  initialPreset: DateRangePreset;
  initialStart: string;
  initialEnd: string;
  initialError?: string;
}

export function AnalyticsClient({
  initialSummary,
  initialPreset,
  initialStart,
  initialEnd,
  initialError,
}: AnalyticsClientProps) {
  const [activePreset, setActivePreset] = useState<DateRangePreset>(initialPreset);
  const [startDate, setStartDate] = useState<string>(initialStart);
  const [endDate, setEndDate] = useState<string>(initialEnd);
  const [summary, setSummary] = useState<AnalyticsSummary | undefined>(initialSummary);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(initialError);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAnalytics = useCallback(async (start: string, end: string) => {
    setIsLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`/api/analytics?startDate=${start}&endDate=${end}`);
      const data = await res.json();
      if (res.ok) {
        setSummary(data);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch {
      setError('Network error loading analytics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRangeChange = (
    preset: DateRangePreset,
    start: string,
    end: string
  ) => {
    setActivePreset(preset);
    setStartDate(start);
    setEndDate(end);
    fetchAnalytics(start, end);
  };

  const hasData = summary && summary.totalMinutes > 0;

  return (
    <div className="min-h-screen flex bg-[#E9F1EB] text-[#141D26]">
      {/* Dark Sidebar */}
      <GamifiedSidebar onOpenAdd={() => setIsModalOpen(true)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <GamifiedHeader onOpenAdd={() => setIsModalOpen(true)} />

          {/* Page Title & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#141D26] tracking-tight flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-[#141D26]" />
                <span>Analytics & Productivity Insights</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Real-time breakdown of your logged activities, time investment, and habits
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#141D26] text-[#C6F432] font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 active:scale-95 transition-all self-start sm:self-auto shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log New Activity</span>
            </button>
          </div>

          {/* Date Range Selector */}
          <DateRangePicker
            activePreset={activePreset}
            startDate={startDate}
            endDate={endDate}
            onRangeChange={handleRangeChange}
          />

          {/* Analytics Content */}
          {isLoading ? (
            <div className="game-card p-16 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-9 h-9 text-[#141D26] animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">Calculating real activity analytics...</p>
            </div>
          ) : hasData ? (
            <div className="space-y-6 animate-fade-in">
              {/* Metric Summary Cards */}
              <MetricCards summary={summary} />

              {/* Primary Charts Row: Overall Donut + Daily Stacked Trend */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryPieChart
                  breakdown={summary.categoryBreakdown}
                  totalMinutes={summary.totalMinutes}
                />
                <DailyTrendChart trends={summary.dailyTrends} />
              </div>

              {/* Dedicated Activity Contribution Pie Charts for each category */}
              <CategoryActivityPieCharts
                breakdown={summary.categoryBreakdown}
                onOpenAddEntry={() => setIsModalOpen(true)}
              />
            </div>
          ) : (
            <div className="game-card p-12 sm:p-16 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Inbox className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#141D26] text-lg">
                  No Activities Recorded For This Range
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Log your focus sessions, workouts, entertainment, or chores to see instant, real-time analytics and category contribution pie charts!
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-[#141D26] text-[#C6F432] font-extrabold text-xs flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Log Your First Activity</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={getTodayDateString()}
        onSuccess={() => {
          fetchAnalytics(startDate, endDate);
        }}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenAddEntry={() => setIsModalOpen(true)} />
    </div>
  );
}
