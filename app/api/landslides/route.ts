import { NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS } from '@/lib/inarisk-data';

export async function GET() {
  const layer = INARISK_GIS_LAYERS.find((l) => l.id === 'longsor');
  return NextResponse.json({
    success: true,
    hazard: 'Tanah Longsor (Landslide Hazard)',
    layer,
    source: 'BNPB / InaRISK GIS REST Service',
    description: layer?.description,
    timestamp: new Date().toISOString(),
  });
}
