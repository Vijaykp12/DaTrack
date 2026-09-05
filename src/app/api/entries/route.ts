import { NextRequest, NextResponse } from 'next/server';
import { getDailyEntries, createEntry } from '@/lib/actions';
import { getTodayDateString } from '@/lib/formatters';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || getTodayDateString();

  const result = await getDailyEntries(date);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createEntry(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }
}
