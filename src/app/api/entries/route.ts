import { NextRequest, NextResponse } from 'next/server';
import { getDailyEntries, createEntry } from '@/lib/actions';
import { getTodayDateString } from '@/lib/formatters';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || getTodayDateString();

  const result = await getDailyEntries(date);
  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API /api/entries POST] Received body:', JSON.stringify(body));

    const result = await createEntry(body);
    console.log('[API /api/entries POST] createEntry result:', JSON.stringify(result));

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to create entry', details: result }, { status: 400 });
    }

    return NextResponse.json(result, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, max-age=0',
      },
    });
  } catch (err: any) {
    console.error('[API /api/entries POST] Error:', err);
    return NextResponse.json({ error: err?.message || 'Invalid JSON payload' }, { status: 400 });
  }
}

