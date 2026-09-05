import { PrismaClient, Category } from '@prisma/client';
import { subDays } from 'date-fns';

const prisma = new PrismaClient();

const sampleActivities = [
  // Productive Work
  { title: 'Fullstack Next.js App Architecture', category: Category.PRODUCTIVE_WORK, duration: 120 },
  { title: 'Prisma Schema & Database Migrations', category: Category.PRODUCTIVE_WORK, duration: 60 },
  { title: 'Client Sprint Planning & Review', category: Category.PRODUCTIVE_WORK, duration: 45 },
  { title: 'Bug Fixes & Refactoring', category: Category.PRODUCTIVE_WORK, duration: 75 },
  { title: 'Code Review & Pull Requests', category: Category.PRODUCTIVE_WORK, duration: 45 },
  { title: 'Technical Documentation & Notes', category: Category.PRODUCTIVE_WORK, duration: 30 },

  // Personal Work
  { title: 'Morning Gym & Strength Training', category: Category.PERSONAL_WORK, duration: 65 },
  { title: 'Reading "Atomic Habits"', category: Category.PERSONAL_WORK, duration: 35 },
  { title: 'Mindfulness Meditation', category: Category.PERSONAL_WORK, duration: 20 },
  { title: 'Evening 5K Run & Stretching', category: Category.PERSONAL_WORK, duration: 40 },
  { title: 'Journaling & Weekly Goal Review', category: Category.PERSONAL_WORK, duration: 25 },

  // Daily Necessities
  { title: 'Cooking Healthy Dinner', category: Category.DAILY_NECESSITIES, duration: 50 },
  { title: 'Grocery Shopping', category: Category.DAILY_NECESSITIES, duration: 40 },
  { title: 'Commute & Travel', category: Category.DAILY_NECESSITIES, duration: 35 },
  { title: 'House Cleaning & Laundry', category: Category.DAILY_NECESSITIES, duration: 45 },
  { title: 'Morning Routine & Breakfast', category: Category.DAILY_NECESSITIES, duration: 30 },

  // Entertainment
  { title: 'Sci-Fi Movie on Netflix', category: Category.ENTERTAINMENT, duration: 110 },
  { title: 'Gaming - Story Mode Campaign', category: Category.ENTERTAINMENT, duration: 75 },
  { title: 'Tech & Science Podcast', category: Category.ENTERTAINMENT, duration: 45 },
  { title: 'Acoustic Guitar Practice', category: Category.ENTERTAINMENT, duration: 40 },

  // Distractions
  { title: 'Endless Instagram Reels & TikTok', category: Category.DISTRACTIONS, duration: 45 },
  { title: 'Mindless Twitter / X Browsing', category: Category.DISTRACTIONS, duration: 30 },
  { title: 'YouTube Algorithm Rabbit Hole', category: Category.DISTRACTIONS, duration: 60 },
  { title: 'Procrastinating on Phone', category: Category.DISTRACTIONS, duration: 25 },
];

async function main() {
  console.log('🌱 Starting DaTrack seed...');

  // Clear existing entries
  await prisma.activityEntry.deleteMany({});

  const now = new Date();
  let totalEntriesCreated = 0;

  // Generate activities for the last 14 days
  for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
    const targetDate = subDays(now, daysAgo);
    targetDate.setUTCHours(0, 0, 0, 0);

    // Pick 4-7 random activities for each day
    const entriesCount = Math.floor(Math.random() * 4) + 4; // 4 to 7
    const shuffled = [...sampleActivities].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, entriesCount);

    for (const act of selected) {
      // Add slight jitter to duration
      const jitter = Math.floor(Math.random() * 20) - 10;
      const duration = Math.max(15, act.duration + jitter);

      await prisma.activityEntry.create({
        data: {
          title: act.title,
          category: act.category,
          duration,
          date: targetDate,
        },
      });
      totalEntriesCreated++;
    }
  }

  console.log(`✅ Seed finished! Created ${totalEntriesCreated} sample activity entries across 14 days.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
