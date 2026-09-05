import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return NextResponse.json({
      status: 'error',
      message: 'DATABASE_URL environment variable is NOT set on Vercel / server.',
      instructions: 'Go to Vercel Project Settings -> Environment Variables -> Add DATABASE_URL.',
    }, { status: 500 });
  }

  // Mask password for safety in response
  const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');

  try {
    // 1. Test basic connection
    await prisma.$connect();

    // 2. Test if ActivityEntry table exists and count rows
    const count = await prisma.activityEntry.count();

    return NextResponse.json({
      status: 'connected',
      message: '🎉 Supabase PostgreSQL is connected successfully and table is ready!',
      databaseUrl: maskedUrl,
      activityEntryRowCount: count,
    });
  } catch (err: any) {
    const errorCode = err?.code || 'UNKNOWN';
    const errorMessage = err?.message || String(err);

    let fixSuggestion = 'Check your connection string and Supabase project settings.';

    if (errorMessage.includes('P1001') || errorMessage.includes("Can't reach database server")) {
      fixSuggestion =
        'Network unreachable: The pooler region in your URL is incorrect (e.g., aws-0-us-east-1 instead of your actual Supabase region). Go to Supabase -> Settings -> Database -> Connection String (URI) to copy the exact URL.';
    } else if (errorMessage.includes('P2021') || errorMessage.includes('relation "ActivityEntry" does not exist') || errorMessage.includes('does not exist')) {
      fixSuggestion =
        'Table missing: The ActivityEntry table has not been created in Supabase yet. Open Supabase SQL Editor and run the table creation script.';
    } else if (errorMessage.includes('password authentication failed') || errorMessage.includes('P1000')) {
      fixSuggestion =
        'Authentication failed: The database password in DATABASE_URL is incorrect or special characters were not URL-encoded (e.g., @ should be %40).';
    }

    return NextResponse.json({
      status: 'error',
      prismaErrorCode: errorCode,
      databaseUrl: maskedUrl,
      errorMessage: errorMessage.split('\n')[0],
      fullError: errorMessage,
      fixSuggestion,
    }, { status: 500 });
  }
}
