import { NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS } from '@/lib/inarisk-data';

export async function GET() {
  const layer = INARISK_GIS_LAYERS.find((l) => l.id === 'kekeringan');
  return NextResponse.json({
    success: true,
    hazard: 'Kekeringan (Drought Hazard)',
    layer,
    source: 'BNPB / InaRISK GIS REST Service / BMKG',
    description: layer?.description,
    timestamp: new Date().toISOString(),
  });
}
