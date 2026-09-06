import { NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS } from '@/lib/inarisk-data';

export async function GET() {
  const layer = INARISK_GIS_LAYERS.find((l) => l.hazardType === 'extreme-weather');
  return NextResponse.json({
    success: true,
    hazard: 'Cuaca Ekstrem (Extreme Weather)',
    layer,
    source: 'BMKG & BNPB InaRISK',
    description: 'Peta potensi cuaca ekstrem, angin kencang, dan gelombang pasang.',
    timestamp: new Date().toISOString(),
  });
}
