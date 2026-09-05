import { getAnalyticsData } from '@/lib/actions';
import { getTodayDateString } from '@/lib/formatters';
import { AnalyticsClient } from '@/components/analytics/AnalyticsClient';
import { subDays, format } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnalyticsPage() {
  const now = new Date();
  const defaultStart = format(subDays(now, 6), 'yyyy-MM-dd');
  const defaultEnd = getTodayDateString();

  const { data, error } = await getAnalyticsData(defaultStart, defaultEnd);

  return (
    <AnalyticsClient
      initialSummary={data}
      initialPreset="7d"
      initialStart={defaultStart}
      initialEnd={defaultEnd}
      initialError={error}
    />
  );
}
