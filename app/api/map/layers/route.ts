import { NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS } from '@/lib/inarisk-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: INARISK_GIS_LAYERS.length,
    data: INARISK_GIS_LAYERS,
    source: 'BNPB / InaRISK ArcGIS REST Services',
    timestamp: new Date().toISOString(),
  });
}
