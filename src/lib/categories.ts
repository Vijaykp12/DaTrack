import { ActivityCategory, CategoryMeta } from '@/types';

export const CATEGORIES: Record<ActivityCategory, CategoryMeta> = {
  PRODUCTIVE_WORK: {
    key: 'PRODUCTIVE_WORK',
    label: 'Productive Work',
    description: 'Work, deep focus, studying, client deliverables, coding',
    color: '#10B981', // Emerald Green
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
    glowClass: 'shadow-glow-productive',
    icon: 'Briefcase',
  },
  DAILY_NECESSITIES: {
    key: 'DAILY_NECESSITIES',
    label: 'Daily Necessities',
    description: 'Sleep, cooking, hygiene, groceries, commuting, chores',
    color: '#0EA5E9', // Sky Blue
    bgClass: 'bg-sky-500/15',
    textClass: 'text-sky-400',
    borderClass: 'border-sky-500/30',
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30 hover:bg-sky-500/25',
    glowClass: 'shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)]',
    icon: 'Utensils',
  },
  ENTERTAINMENT: {
    key: 'ENTERTAINMENT',
    label: 'Entertainment',
    description: 'Movies, gaming, books, podcasts, music, relaxation',
    color: '#F59E0B', // Amber Yellow
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
    glowClass: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]',
    icon: 'Film',
  },
  DISTRACTIONS: {
    key: 'DISTRACTIONS',
    label: 'Distractions',
    description: 'Social media scrolling, doomscrolling, procrastination, idle browsing',
    color: '#F43F5E', // Rose Red
    bgClass: 'bg-rose-500/15',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/30',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25',
    glowClass: 'shadow-glow-distractions',
    icon: 'AlertTriangle',
  },
  PERSONAL_WORK: {
    key: 'PERSONAL_WORK',
    label: 'Personal Work',
    description: 'Gym, workouts, journaling, side projects, reading, meditation',
    color: '#8B5CF6', // Violet Purple
    bgClass: 'bg-violet-500/15',
    textClass: 'text-violet-400',
    borderClass: 'border-violet-500/30',
    badgeClass: 'bg-violet-500/15 text-violet-400 border-violet-500/30 hover:bg-violet-500/25',
    glowClass: 'shadow-glow-personal',
    icon: 'Dumbbell',
  },
};

export const CATEGORY_LIST: ActivityCategory[] = [
  'PRODUCTIVE_WORK',
  'PERSONAL_WORK',
  'DAILY_NECESSITIES',
  'ENTERTAINMENT',
  'DISTRACTIONS',
];

// Quick suggestions for mobile one-tap activity input
export const ACTIVITY_PRESETS: { title: string; category: ActivityCategory; duration: number }[] = [
  { title: 'Coding Project', category: 'PRODUCTIVE_WORK', duration: 90 },
  { title: 'Deep Work & Focus', category: 'PRODUCTIVE_WORK', duration: 60 },
  { title: 'Client Meeting / Call', category: 'PRODUCTIVE_WORK', duration: 45 },
  { title: 'Gym Workout & Exercise', category: 'PERSONAL_WORK', duration: 60 },
  { title: 'Reading Book', category: 'PERSONAL_WORK', duration: 30 },
  { title: 'Meditation & Breathwork', category: 'PERSONAL_WORK', duration: 15 },
  { title: 'Cooking & Meal', category: 'DAILY_NECESSITIES', duration: 45 },
  { title: 'Commute & Travel', category: 'DAILY_NECESSITIES', duration: 30 },
  { title: 'House Cleaning & Laundry', category: 'DAILY_NECESSITIES', duration: 30 },
  { title: 'Watched YouTube', category: 'ENTERTAINMENT', duration: 45 },
  { title: 'Video Gaming', category: 'ENTERTAINMENT', duration: 60 },
  { title: 'Movie / TV Show', category: 'ENTERTAINMENT', duration: 90 },
  { title: 'Social Media Scrolling', category: 'DISTRACTIONS', duration: 30 },
  { title: 'Mindless Web Browsing', category: 'DISTRACTIONS', duration: 45 },
];

export const DURATION_QUICK_PRESETS = [
  { label: '15m', minutes: 15 },
  { label: '30m', minutes: 30 },
  { label: '45m', minutes: 45 },
  { label: '1h', minutes: 60 },
  { label: '1.5h', minutes: 90 },
  { label: '2h', minutes: 120 },
  { label: '3h', minutes: 180 },
];
