import { NextRequest, NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS } from '@/lib/inarisk-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ layer: string }> }
) {
  const { layer } = await params;
  const config = INARISK_GIS_LAYERS.find(
    (l) => l.id.toLowerCase() === layer.toLowerCase() || l.hazardType.toLowerCase() === layer.toLowerCase()
  );

  if (!config) {
    return NextResponse.json(
      {
        success: false,
        error: `GIS layer '${layer}' tidak ditemukan di InaRISK`,
        availableLayers: INARISK_GIS_LAYERS.map((l) => l.id),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: config,
    source: 'BNPB / InaRISK GIS REST Service',
    timestamp: new Date().toISOString(),
  });
}
