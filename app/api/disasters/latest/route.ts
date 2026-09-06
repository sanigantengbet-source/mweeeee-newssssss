import { NextResponse } from 'next/server';
import { getLatestEarthquake } from '@/lib/bmkg';

export async function GET() {
  const latestQuake = await getLatestEarthquake();

  if (latestQuake.error && !latestQuake.data) {
    return NextResponse.json(
      {
        success: false,
        error: latestQuake.error,
        data: null,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    success: true,
    data: latestQuake.data,
    source: latestQuake.source,
    cached: latestQuake.cached,
    timestamp: new Date().toISOString(),
  });
}
