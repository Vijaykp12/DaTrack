import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/actions';
import { getTodayDateString } from '@/lib/formatters';
import { subDays, format } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const defaultStart = format(subDays(now, 6), 'yyyy-MM-dd');
  const defaultEnd = getTodayDateString();

  const startDate = searchParams.get('startDate') || defaultStart;
  const endDate = searchParams.get('endDate') || defaultEnd;

  const result = await getAnalyticsData(startDate, endDate);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

