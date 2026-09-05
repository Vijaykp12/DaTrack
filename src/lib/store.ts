import fs from 'fs';
import path from 'path';
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
import { CATEGORIES, CATEGORY_LIST } from './categories';
import { eachDayOfInterval, format } from 'date-fns';

const DATA_FILE = path.join(process.cwd(), 'data_store.json');

// Real storage without dummy auto-seed placeholders
export function readStore(): ActivityEntryItem[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeStore(data: ActivityEntryItem[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write store:', e);
  }
}

export function clearStore() {
  writeStore([]);
}

export function storeGetDaily(dateStr: string): { entries: ActivityEntryItem[]; summary: DailySummary } {
  const all = readStore();
  const entries = all
    .filter((item) => item.date === dateStr)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  return { entries, summary };
}

export function storeCreate(data: CreateEntryInput): ActivityEntryItem {
  const all = readStore();
  const newEntry: ActivityEntryItem = {
    id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: data.title.trim(),
    category: data.category,
    duration: Math.max(1, Number(data.duration)),
    date: data.date,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  all.unshift(newEntry);
  writeStore(all);
  return newEntry;
}

export function storeUpdate(id: string, data: UpdateEntryInput): ActivityEntryItem | null {
  const all = readStore();
  const index = all.findIndex((e) => e.id === id);
  if (index === -1) return null;

  if (data.title !== undefined) all[index].title = data.title.trim();
  if (data.category !== undefined) all[index].category = data.category;
  if (data.duration !== undefined) all[index].duration = Math.max(1, Number(data.duration));
  if (data.date !== undefined) all[index].date = data.date;
  all[index].updatedAt = new Date().toISOString();

  writeStore(all);
  return all[index];
}

export function storeDelete(id: string): boolean {
  const all = readStore();
  const filtered = all.filter((e) => e.id !== id);
  writeStore(filtered);
  return true;
}

export function storeGetAnalytics(startDateStr: string, endDateStr: string): AnalyticsSummary {
  const all = readStore();
  const filtered = all.filter((e) => e.date >= startDateStr && e.date <= endDateStr);

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
    const mins = e.duration;
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
