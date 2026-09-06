import { NextResponse } from 'next/server';
import { getAllRecentEarthquakes } from '@/lib/bmkg';

export async function GET() {
  const result = await getAllRecentEarthquakes();

  return NextResponse.json({
    success: true,
    total: result.data.length,
    data: result.data,
    source: result.source,
    error: result.error,
    timestamp: new Date().toISOString(),
  });
}
