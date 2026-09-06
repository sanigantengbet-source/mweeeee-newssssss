import { NextResponse } from 'next/server';
import { getRecentM5Earthquakes } from '@/lib/bmkg';

export async function GET() {
  const result = await getRecentM5Earthquakes();

  return NextResponse.json({
    success: true,
    total: result.data.length,
    data: result.data,
    source: result.source,
    cached: result.cached,
    error: result.error,
    timestamp: new Date().toISOString(),
  });
}
