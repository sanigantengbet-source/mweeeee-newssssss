import { NextRequest, NextResponse } from 'next/server';
import { getAllRecentEarthquakes } from '@/lib/bmkg';
import { OFFICIAL_ACTIVE_VOLCANOES } from '@/lib/inarisk-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check earthquakes
  const quakes = await getAllRecentEarthquakes();
  const quake = quakes.data.find((q) => q.id === id);
  if (quake) {
    return NextResponse.json({
      success: true,
      data: quake,
      source: 'BMKG',
      timestamp: new Date().toISOString(),
    });
  }

  // Check volcanoes
  const volcano = OFFICIAL_ACTIVE_VOLCANOES.find((v) => v.id === id);
  if (volcano) {
    return NextResponse.json({
      success: true,
      data: {
        id: volcano.id,
        type: 'volcano',
        title: `${volcano.name} (${volcano.alertLevel})`,
        latitude: volcano.latitude,
        longitude: volcano.longitude,
        elevation: `${volcano.elevationMeters} mdpl`,
        location: `${volcano.name}, ${volcano.province}`,
        province: volcano.province,
        severity: volcano.alertLevel.includes('Siaga') || volcano.alertLevel.includes('Awas') ? 'high' : 'moderate',
        occurredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'PVMBG / InaRISK',
        potential: volcano.lastActivity,
        verified: true,
      },
      source: 'PVMBG / InaRISK',
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Data bencana tidak ditemukan',
      data: null,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}
