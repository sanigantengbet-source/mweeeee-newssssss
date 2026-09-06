import { NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS } from '@/lib/inarisk-data';

export async function GET() {
  const layer = INARISK_GIS_LAYERS.find((l) => l.id === 'likuefaksi');
  return NextResponse.json({
    success: true,
    hazard: 'Likuefaksi (Liquefaction Hazard)',
    layer,
    source: 'BNPB / InaRISK & Badan Geologi',
    description: layer?.description,
    timestamp: new Date().toISOString(),
  });
}
