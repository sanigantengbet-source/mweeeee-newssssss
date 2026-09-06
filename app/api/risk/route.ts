import { NextResponse } from 'next/server';
import { OFFICIAL_PROVINCE_RISK, INARISK_GIS_LAYERS } from '@/lib/inarisk-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    totalProvinces: OFFICIAL_PROVINCE_RISK.length,
    availableHazardLayers: INARISK_GIS_LAYERS.map((l) => ({
      id: l.id,
      name: l.name,
      hazardType: l.hazardType,
      source: l.source,
    })),
    provinces: OFFICIAL_PROVINCE_RISK,
    source: 'BNPB IRBI (Indeks Risiko Bencana Indonesia) & InaRISK',
    timestamp: new Date().toISOString(),
  });
}
