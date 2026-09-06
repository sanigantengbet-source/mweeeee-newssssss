import { NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS } from '@/lib/inarisk-data';

export async function GET() {
  const layer = INARISK_GIS_LAYERS.find((l) => l.id === 'karhutla');
  return NextResponse.json({
    success: true,
    hazard: 'Kebakaran Hutan dan Lahan / Karhutla',
    layer,
    source: 'BNPB / InaRISK GIS REST Service / KLHK',
    description: layer?.description,
    timestamp: new Date().toISOString(),
  });
}
