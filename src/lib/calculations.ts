import {
  ActivityCategory,
  ActivityEntryItem,
  AnalyticsSummary,
  CategoryBreakdownData,
  DailySummary,
  DailyTrendPoint,
} from '@/types';
import { CATEGORIES, CATEGORY_LIST } from './categories';
import { eachDayOfInterval, format, subDays } from 'date-fns';

const LOCAL_STORAGE_KEY = 'datrack_activities_v1';

export interface DayCapsuleSummary {
  dayName: string;
  productiveMinutes: number;
  habitsMinutes: number;
  wastedMinutes: number;
  totalMinutes: number;
}

/**
 * Calculates a DailySummary for a specific day from a list of entries
 */
export function calculateDailySummary(
  entries: ActivityEntryItem[],
  dateStr: string
): DailySummary {
  const dayEntries = entries.filter((e) => e.date === dateStr);

  let totalMinutes = 0;
  let productiveMinutes = 0;
  let distractionMinutes = 0;
  let entertainmentMinutes = 0;
  let necessitiesMinutes = 0;
  let personalMinutes = 0;

  dayEntries.forEach((e) => {
    const dur = Math.max(0, Number(e.duration) || 0);
    totalMinutes += dur;
    switch (e.category) {
      case 'PRODUCTIVE_WORK':
        productiveMinutes += dur;
        break;
      case 'DISTRACTIONS':
        distractionMinutes += dur;
        break;
      case 'ENTERTAINMENT':
        entertainmentMinutes += dur;
        break;
      case 'DAILY_NECESSITIES':
        necessitiesMinutes += dur;
        break;
      case 'PERSONAL_WORK':
        personalMinutes += dur;
        break;
    }
  });

  const productiveTotal = productiveMinutes + personalMinutes;
  const productivityScore =
    totalMinutes > 0 ? Math.round((productiveTotal / totalMinutes) * 100) : 0;

  return {
    date: dateStr,
    totalMinutes,
    productiveMinutes,
    distractionMinutes,
    entertainmentMinutes,
    necessitiesMinutes,
    personalMinutes,
    productivityScore,
    entriesCount: dayEntries.length,
  };
}

/**
 * Calculates 7-day weekly capsules ending on dateStr
 */
export function calculateWeeklyCapsules(
  allEntries: ActivityEntryItem[],
  dateStr: string
): DayCapsuleSummary[] {
  const [y, m, d] = dateStr.split('-').map(Number);
  const curr = new Date(y, m - 1, d);
  const capsules: DayCapsuleSummary[] = [];

  for (let i = 6; i >= 0; i--) {
    const dayObj = subDays(curr, i);
    const dayKey = format(dayObj, 'yyyy-MM-dd');
    const dayEntries = allEntries.filter((e) => e.date === dayKey);

    let prod = 0;
    let habit = 0;
    let waste = 0;
    let tot = 0;

    dayEntries.forEach((e) => {
      const dur = Math.max(0, Number(e.duration) || 0);
      tot += dur;
      if (e.category === 'PRODUCTIVE_WORK') prod += dur;
      else if (e.category === 'PERSONAL_WORK') habit += dur;
      else if (e.category === 'DISTRACTIONS' || e.category === 'ENTERTAINMENT') waste += dur;
    });

    capsules.push({
      dayName: format(dayObj, 'EEE'),
      productiveMinutes: prod,
      habitsMinutes: habit,
      wastedMinutes: waste,
      totalMinutes: tot,
    });
  }

  return capsules;
}

/**
 * Calculates complete AnalyticsSummary for a date range
 */
export function calculateAnalyticsSummary(
  allEntries: ActivityEntryItem[],
  startDateStr: string,
  endDateStr: string
): AnalyticsSummary {
  const filtered = allEntries.filter(
    (e) => e.date >= startDateStr && e.date <= endDateStr
  );

  let totalMinutes = 0;
  let productiveMinutes = 0;
  let distractionMinutes = 0;
  let entertainmentMinutes = 0;
  let necessitiesMinutes = 0;
  let personalMinutes = 0;

  const categoryAggregates: Record<
    ActivityCategory,
    {
      totalMinutes: number;
      count: number;
      activityMap: Record<string, { duration: number; count: number }>;
    }
  > = {
    PRODUCTIVE_WORK: { totalMinutes: 0, count: 0, activityMap: {} },
    DAILY_NECESSITIES: { totalMinutes: 0, count: 0, activityMap: {} },
    ENTERTAINMENT: { totalMinutes: 0, count: 0, activityMap: {} },
    DISTRACTIONS: { totalMinutes: 0, count: 0, activityMap: {} },
    PERSONAL_WORK: { totalMinutes: 0, count: 0, activityMap: {} },
  };

  const dayMap: Record<string, Record<ActivityCategory, number>> = {};

  filtered.forEach((e) => {
    const cat = e.category;
    const mins = Math.max(0, Number(e.duration) || 0);
    const dateKey = e.date;

    totalMinutes += mins;

    if (cat === 'PRODUCTIVE_WORK') productiveMinutes += mins;
    else if (cat === 'DISTRACTIONS') distractionMinutes += mins;
    else if (cat === 'ENTERTAINMENT') entertainmentMinutes += mins;
    else if (cat === 'DAILY_NECESSITIES') necessitiesMinutes += mins;
    else if (cat === 'PERSONAL_WORK') personalMinutes += mins;

    if (categoryAggregates[cat]) {
      categoryAggregates[cat].totalMinutes += mins;
      categoryAggregates[cat].count += 1;

      const titleKey = e.title.trim();
      if (!categoryAggregates[cat].activityMap[titleKey]) {
        categoryAggregates[cat].activityMap[titleKey] = { duration: 0, count: 0 };
      }
      categoryAggregates[cat].activityMap[titleKey].duration += mins;
      categoryAggregates[cat].activityMap[titleKey].count += 1;
    }

    if (!dayMap[dateKey]) {
      dayMap[dateKey] = {
        PRODUCTIVE_WORK: 0,
        DAILY_NECESSITIES: 0,
        ENTERTAINMENT: 0,
        DISTRACTIONS: 0,
        PERSONAL_WORK: 0,
      };
    }
    dayMap[dateKey][cat] = (dayMap[dateKey][cat] || 0) + mins;
  });

  const wastedMinutes = distractionMinutes + entertainmentMinutes;
  const productiveTotal = productiveMinutes + personalMinutes;
  const productivityScore =
    totalMinutes > 0 ? Math.round((productiveTotal / totalMinutes) * 100) : 0;

  const [sy, sm, sd] = startDateStr.split('-').map(Number);
  const [ey, em, ed] = endDateStr.split('-').map(Number);
  const startObj = new Date(sy, sm - 1, sd);
  const endObj = new Date(ey, em - 1, ed);

  let daysInterval: Date[] = [];
  try {
    daysInterval = eachDayOfInterval({ start: startObj, end: endObj });
  } catch {
    daysInterval = [startObj];
  }

  const daysCount = Math.max(1, daysInterval.length);
  const dailyAverageMinutes = Math.round(totalMinutes / daysCount);

  const categoryBreakdown: CategoryBreakdownData[] = CATEGORY_LIST.map((catKey) => {
    const data = categoryAggregates[catKey];
    const meta = CATEGORIES[catKey];
    const percentage =
      totalMinutes > 0 ? Math.round((data.totalMinutes / totalMinutes) * 100) : 0;

    const topActivities = Object.entries(data.activityMap)
      .map(([title, item]) => ({
        title,
        duration: item.duration,
        count: item.count,
      }))
      .sort((a, b) => b.duration - a.duration);

    return {
      category: catKey,
      label: meta.label,
      color: meta.color,
      totalMinutes: data.totalMinutes,
      percentage,
      entryCount: data.count,
      topActivities,
    };
  });

  const dailyTrends: DailyTrendPoint[] = daysInterval.map((d) => {
    const dateKey = format(d, 'yyyy-MM-dd');
    const dayData = dayMap[dateKey] || {
      PRODUCTIVE_WORK: 0,
      DAILY_NECESSITIES: 0,
      ENTERTAINMENT: 0,
      DISTRACTIONS: 0,
      PERSONAL_WORK: 0,
    };

    const dayTotal =
      dayData.PRODUCTIVE_WORK +
      dayData.DAILY_NECESSITIES +
      dayData.ENTERTAINMENT +
      dayData.DISTRACTIONS +
      dayData.PERSONAL_WORK;

    return {
      date: dateKey,
      displayDate: format(d, 'MMM d'),
      totalMinutes: dayTotal,
      PRODUCTIVE_WORK: dayData.PRODUCTIVE_WORK,
      DAILY_NECESSITIES: dayData.DAILY_NECESSITIES,
      ENTERTAINMENT: dayData.ENTERTAINMENT,
      DISTRACTIONS: dayData.DISTRACTIONS,
      PERSONAL_WORK: dayData.PERSONAL_WORK,
    };
  });

  return {
    startDate: startDateStr,
    endDate: endDateStr,
    totalMinutes,
    productiveMinutes,
    wastedMinutes,
    personalMinutes,
    necessitiesMinutes,
    productivityScore,
    dailyAverageMinutes,
    daysCount,
    categoryBreakdown,
    dailyTrends,
    totalEntriesCount: filtered.length,
  };
}

// ==========================================
// LocalStorage Persistence Helpers (Browser)
// ==========================================

export function getLocalEntries(): ActivityEntryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalEntries(entries: ActivityEntryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage quota or privacy restriction
  }
}

export function mergeEntries(
  serverEntries: ActivityEntryItem[],
  localEntries: ActivityEntryItem[]
): ActivityEntryItem[] {
  if (serverEntries && serverEntries.length > 0) {
    const datesCovered = new Set(serverEntries.map((e) => e.date));
    // Filter out old temporary local entries for the dates covered by server
    const otherDatesLocal = localEntries.filter(
      (e) => !datesCovered.has(e.date)
    );
    const combined = [...serverEntries, ...otherDatesLocal];
    return combined.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return localEntries;
}

