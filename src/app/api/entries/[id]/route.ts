import { NextRequest, NextResponse } from 'next/server';
import { updateEntry, deleteEntry } from '@/lib/actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const result = await updateEntry(id, body);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update entry' }, { status: 400 });
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, max-age=0',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update entry' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const result = await deleteEntry(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to delete entry' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, max-age=0',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete entry' }, { status: 400 });
  }
}

