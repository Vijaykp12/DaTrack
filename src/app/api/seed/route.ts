import { NextResponse } from 'next/server';
import { clearStore } from '@/lib/store';

export async function POST() {
  try {
    clearStore();
    return NextResponse.json({
      success: true,
      message: 'Reset data store successfully.',
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error resetting store.' },
      { status: 500 }
    );
  }
}
