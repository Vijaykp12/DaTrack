'use server';

import { prisma } from '@/lib/prisma';
import {
  ActivityCategory,
  ActivityEntryItem,
  AnalyticsSummary,
  CategoryBreakdownData,
  CreateEntryInput,
  DailySummary,
  DailyTrendPoint,
  UpdateEntryInput,
} from '@/types';
import { CATEGORIES, CATEGORY_LIST } from '@/lib/categories';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { revalidatePath } from 'next/cache';
import {
  storeGetDaily,
  storeCreate,
  storeUpdate,
  storeDelete,
  storeGetAnalytics,
  readStore,
} from './store';

function toDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateParam(dateStr: string): { start: Date; end: Date; target: Date } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  return { start, end, target: start };
}

export interface DayCapsuleSummary {
  dayName: string;
  productiveMinutes: number;
  habitsMinutes: number;
  wastedMinutes: number;
  totalMinutes: number;
}

/**
 * Fetch all entries for a specific date (YYYY-MM-DD)
 */
export async function getDailyEntries(dateStr: string): Promise<{
  entries: ActivityEntryItem[];
  summary: DailySummary;
  weeklyCapsules: DayCapsuleSummary[];
  error?: string;
}> {
  try {
    const { start, end } = parseDateParam(dateStr);

    const rawEntries = await prisma.activityEntry.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const entries: ActivityEntryItem[] = rawEntries.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category as ActivityCategory,
      duration: e.duration,
      date: toDateKey(e.date),
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));

    let totalMinutes = 0;
    let productiveMinutes = 0;
    let distractionMinutes = 0;
    let entertainmentMinutes = 0;
    let necessitiesMinutes = 0;
    let personalMinutes = 0;

    entries.forEach((e) => {
      totalMinutes += e.duration;
      switch (e.category) {
        case 'PRODUCTIVE_WORK':
          productiveMinutes += e.duration;
          break;
        case 'DISTRACTIONS':
          distractionMinutes += e.duration;
          break;
        case 'ENTERTAINMENT':
          entertainmentMinutes += e.duration;
          break;
        case 'DAILY_NECESSITIES':
          necessitiesMinutes += e.duration;
          break;
        case 'PERSONAL_WORK':
          personalMinutes += e.duration;
          break;
      }
    });

    const productiveTotal = productiveMinutes + personalMinutes;
    const productivityScore =
      totalMinutes > 0 ? Math.round((productiveTotal / totalMinutes) * 100) : 0;

    const summary: DailySummary = {
      date: dateStr,
      totalMinutes,
      productiveMinutes,
      distractionMinutes,
      entertainmentMinutes,
      necessitiesMinutes,
      personalMinutes,
      productivityScore,
      entriesCount: entries.length,
    };

    // Calculate real weekly capsules for the 7 days ending on dateStr
    const [y, m, d] = dateStr.split('-').map(Number);
    const curr = new Date(y, m - 1, d);
    const weeklyCapsules: DayCapsuleSummary[] = [];

    for (let i = 6; i >= 0; i--) {
      const dayObj = subDays(curr, i);
      const dayKey = format(dayObj, 'yyyy-MM-dd');
      const dayEntries = await prisma.activityEntry.findMany({
        where: {
          date: {
            gte: new Date(Date.UTC(dayObj.getFullYear(), dayObj.getMonth(), dayObj.getDate(), 0, 0, 0)),
            lte: new Date(Date.UTC(dayObj.getFullYear(), dayObj.getMonth(), dayObj.getDate(), 23, 59, 59)),
          },
        },
      });

      let prod = 0;
      let habit = 0;
      let waste = 0;
      let tot = 0;

      dayEntries.forEach((e) => {
        tot += e.duration;
        if (e.category === 'PRODUCTIVE_WORK') prod += e.duration;
        else if (e.category === 'PERSONAL_WORK') habit += e.duration;
        else if (e.category === 'DISTRACTIONS' || e.category === 'ENTERTAINMENT') waste += e.duration;
      });

      weeklyCapsules.push({
        dayName: format(dayObj, 'EEE'),
        productiveMinutes: prod,
        habitsMinutes: habit,
        wastedMinutes: waste,
        totalMinutes: tot,
      });
    }

    return { entries, summary, weeklyCapsules };
  } catch {
    // Fallback using real local store
    const local = storeGetDaily(dateStr);
    const all = readStore();
    const [y, m, d] = dateStr.split('-').map(Number);
    const curr = new Date(y, m - 1, d);
    const weeklyCapsules: DayCapsuleSummary[] = [];

    for (let i = 6; i >= 0; i--) {
      const dayObj = subDays(curr, i);
      const dayKey = format(dayObj, 'yyyy-MM-dd');
      const dayEntries = all.filter((e) => e.date === dayKey);

      let prod = 0;
      let habit = 0;
      let waste = 0;
      let tot = 0;

      dayEntries.forEach((e) => {
        tot += e.duration;
        if (e.category === 'PRODUCTIVE_WORK') prod += e.duration;
        else if (e.category === 'PERSONAL_WORK') habit += e.duration;
        else if (e.category === 'DISTRACTIONS' || e.category === 'ENTERTAINMENT') waste += e.duration;
      });

      weeklyCapsules.push({
        dayName: format(dayObj, 'EEE'),
        productiveMinutes: prod,
        habitsMinutes: habit,
        wastedMinutes: waste,
        totalMinutes: tot,
      });
    }

    return {
      entries: local.entries,
      summary: local.summary,
      weeklyCapsules,
    };
  }
}

/**
 * Create a new activity entry
 */
export async function createEntry(data: CreateEntryInput): Promise<{
  success: boolean;
  entry?: ActivityEntryItem;
  error?: string;
}> {
  try {
    const { target } = parseDateParam(data.date);

    const raw = await prisma.activityEntry.create({
      data: {
        title: data.title.trim(),
        category: data.category,
        duration: Math.max(1, Number(data.duration)),
        date: target,
      },
    });

    revalidatePath('/', 'page');
    revalidatePath('/analytics', 'page');

    return {
      success: true,
      entry: {
        id: raw.id,
        title: raw.title,
        category: raw.category as ActivityCategory,
        duration: raw.duration,
        date: toDateKey(raw.date),
        createdAt: raw.createdAt.toISOString(),
        updatedAt: raw.updatedAt.toISOString(),
      },
    };
  } catch (err: any) {
    console.error('Database createEntry error:', err);
    try {
      const entry = storeCreate(data);
      revalidatePath('/', 'page');
      revalidatePath('/analytics', 'page');
      return { success: true, entry };
    } catch (storeErr: any) {
      console.error('Local store fallback error:', storeErr);
      return {
        success: false,
        error:
          err?.message ||
          'Database error: Please check your DATABASE_URL in Vercel settings and ensure the schema is pushed.',
      };
    }
  }
}

/**
 * Update an existing activity entry
 */
export async function updateEntry(
  id: string,
  data: UpdateEntryInput
): Promise<{ success: boolean; entry?: ActivityEntryItem; error?: string }> {
  try {
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.category !== undefined) updateData.category = data.category;
    if (data.duration !== undefined) updateData.duration = Math.max(1, Number(data.duration));
    if (data.date !== undefined) {
      const { target } = parseDateParam(data.date);
      updateData.date = target;
    }

    const raw = await prisma.activityEntry.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/', 'page');
    revalidatePath('/analytics', 'page');

    return {
      success: true,
      entry: {
        id: raw.id,
        title: raw.title,
        category: raw.category as ActivityCategory,
        duration: raw.duration,
        date: toDateKey(raw.date),
        createdAt: raw.createdAt.toISOString(),
        updatedAt: raw.updatedAt.toISOString(),
      },
    };
  } catch (err: any) {
    console.error('Database updateEntry error:', err);
    try {
      const entry = storeUpdate(id, data);
      revalidatePath('/', 'page');
      revalidatePath('/analytics', 'page');
      return { success: true, entry: entry || undefined };
    } catch (storeErr: any) {
      return { success: false, error: err?.message || 'Database update error' };
    }
  }
}

/**
 * Delete an activity entry
 */
export async function deleteEntry(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.activityEntry.delete({
      where: { id },
    });

    revalidatePath('/', 'page');
    revalidatePath('/analytics', 'page');

    return { success: true };
  } catch (err: any) {
    console.error('Database deleteEntry error:', err);
    try {
      storeDelete(id);
      revalidatePath('/', 'page');
      revalidatePath('/analytics', 'page');
      return { success: true };
    } catch (storeErr: any) {
      return { success: false, error: err?.message || 'Database delete error' };
    }
  }
}

/**
 * Fetch analytics data for a date range (YYYY-MM-DD to YYYY-MM-DD)
 */
export async function getAnalyticsData(
  startDateStr: string,
  endDateStr: string
): Promise<{ data?: AnalyticsSummary; error?: string }> {
  try {
    const { start: startDate } = parseDateParam(startDateStr);
    const { end: endDate } = parseDateParam(endDateStr);

    const rawEntries = await prisma.activityEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

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

    rawEntries.forEach((e) => {
      const cat = e.category as ActivityCategory;
      const mins = e.duration;
      const dateKey = toDateKey(e.date);

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
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
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

    const summary: AnalyticsSummary = {
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
      totalEntriesCount: rawEntries.length,
    };

    return { data: summary };
  } catch {
    const data = storeGetAnalytics(startDateStr, endDateStr);
    return { data };
  }
}
