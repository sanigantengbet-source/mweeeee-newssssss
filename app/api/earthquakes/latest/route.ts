import { NextResponse } from 'next/server';
import { getLatestEarthquake } from '@/lib/bmkg';

export async function GET() {
  const result = await getLatestEarthquake();

  return NextResponse.json({
    success: !result.error,
    data: result.data,
    source: result.source,
    cached: result.cached,
    error: result.error,
    timestamp: new Date().toISOString(),
  });
}
