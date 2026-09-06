import { NextRequest, NextResponse } from 'next/server';
import { getAllRecentEarthquakes } from '@/lib/bmkg';
import { OFFICIAL_ACTIVE_VOLCANOES } from '@/lib/inarisk-data';
import { Disaster } from '@/types/disaster';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  // Fetch earthquakes from BMKG
  const quakesRes = await getAllRecentEarthquakes();
  const quakes: Disaster[] = quakesRes.data;

  // Volcano disasters from PVMBG/InaRISK
  const volcanoDisasters: Disaster[] = OFFICIAL_ACTIVE_VOLCANOES.filter(
    (v) => v.alertLevel === 'Level III (Siaga)' || v.alertLevel === 'Level IV (Awas)'
  ).map((v) => ({
    id: v.id,
    type: 'volcano',
    title: `Aktivitas ${v.name} - ${v.alertLevel}`,
    latitude: v.latitude,
    longitude: v.longitude,
    location: `${v.name}, ${v.province}`,
    province: v.province,
    severity: v.alertLevel === 'Level IV (Awas)' ? 'critical' : 'high',
    occurredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'InaRISK',
    potential: v.lastActivity || 'Erupsi vulkanik dan bahaya awan panas',
    verified: true,
  }));

  let allDisasters: Disaster[] = [...quakes, ...volcanoDisasters];

  if (type) {
    allDisasters = allDisasters.filter((d) => d.type === type);
  }

  // Sort by occurredAt descending
  allDisasters.sort((a, b) => {
    const timeA = a.occurredAt ? new Date(a.occurredAt).getTime() : 0;
    const timeB = b.occurredAt ? new Date(b.occurredAt).getTime() : 0;
    return timeB - timeA;
  });

  return NextResponse.json({
    success: true,
    total: allDisasters.length,
    data: allDisasters.slice(0, limit),
    sources: ['BMKG', 'InaRISK', 'PVMBG'],
    timestamp: new Date().toISOString(),
  });
}
