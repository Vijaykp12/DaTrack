export type ActivityCategory =
  | 'PRODUCTIVE_WORK'
  | 'DAILY_NECESSITIES'
  | 'ENTERTAINMENT'
  | 'DISTRACTIONS'
  | 'PERSONAL_WORK';

export interface ActivityEntryItem {
  id: string;
  title: string;
  category: ActivityCategory;
  duration: number; // in minutes
  date: string; // ISO string YYYY-MM-DD or full ISO
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryInput {
  title: string;
  category: ActivityCategory;
  duration: number; // in minutes
  date: string; // YYYY-MM-DD
}

export interface UpdateEntryInput {
  title?: string;
  category?: ActivityCategory;
  duration?: number;
  date?: string;
}

export interface CategoryMeta {
  key: ActivityCategory;
  label: string;
  description: string;
  color: string; // hex code
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  glowClass: string;
  icon: string;
}

export interface DailySummary {
  date: string;
  totalMinutes: number;
  productiveMinutes: number;
  distractionMinutes: number;
  entertainmentMinutes: number;
  necessitiesMinutes: number;
  personalMinutes: number;
  productivityScore: number; // 0 to 100 percentage
  entriesCount: number;
}

export interface CategoryBreakdownData {
  category: ActivityCategory;
  label: string;
  color: string;
  totalMinutes: number;
  percentage: number;
  entryCount: number;
  topActivities: {
    title: string;
    duration: number;
    count: number;
  }[];
}

export interface DailyTrendPoint {
  date: string;
  displayDate: string;
  totalMinutes: number;
  PRODUCTIVE_WORK: number;
  DAILY_NECESSITIES: number;
  ENTERTAINMENT: number;
  DISTRACTIONS: number;
  PERSONAL_WORK: number;
}

export interface AnalyticsSummary {
  startDate: string;
  endDate: string;
  totalMinutes: number;
  productiveMinutes: number;
  wastedMinutes: number; // Distractions + Entertainment
  personalMinutes: number;
  necessitiesMinutes: number;
  productivityScore: number; // (Productive + Personal) / Total * 100
  dailyAverageMinutes: number;
  daysCount: number;
  categoryBreakdown: CategoryBreakdownData[];
  dailyTrends: DailyTrendPoint[];
  totalEntriesCount: number;
}

export type DateRangePreset = 'today' | '7d' | '30d' | 'month' | 'all' | 'custom';
