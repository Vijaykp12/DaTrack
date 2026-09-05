import { getDailyEntries } from '@/lib/actions';
import { getTodayDateString } from '@/lib/formatters';
import { TrackerClient } from '@/components/tracker/TrackerClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DailyTrackerPage() {
  const today = getTodayDateString();
  const { entries, summary, weeklyCapsules, error } = await getDailyEntries(today);

  return (
    <TrackerClient
      initialDate={today}
      initialEntries={entries || []}
      initialSummary={summary}
      initialWeeklyCapsules={weeklyCapsules}
      initialError={error}
    />
  );
}
