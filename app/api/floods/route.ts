import { NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS } from '@/lib/inarisk-data';

export async function GET() {
  const layer = INARISK_GIS_LAYERS.find((l) => l.id === 'banjir');
  return NextResponse.json({
    success: true,
    hazard: 'Banjir (Flood Hazard)',
    layer,
    source: 'BNPB / InaRISK GIS REST Service',
    description: layer?.description || 'Zonasi bahaya banjir DAS Nasional InaRISK',
    timestamp: new Date().toISOString(),
  });
}
