import { NextRequest, NextResponse } from 'next/server';
import { getAllRecentEarthquakes } from '@/lib/bmkg';
import { getMagmaVolcanoes } from '@/lib/magma-api';
import { OFFICIAL_ACTIVE_VOLCANOES, OFFICIAL_PROVINCE_RISK, OFFICIAL_DISTRICT_RISK } from '@/lib/inarisk-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim().toLowerCase();

  if (!q || q.length < 2) {
    return NextResponse.json({
      success: true,
      query: q || '',
      results: [],
      timestamp: new Date().toISOString(),
    });
  }

  const [quakes, magmaVolcanoes] = await Promise.allSettled([
    getAllRecentEarthquakes(),
    getMagmaVolcanoes(),
  ]);

  const results: Array<{
    type: 'earthquake' | 'volcano' | 'province' | 'district';
    id: string;
    title: string;
    subtitle: string;
    latitude?: number;
    longitude?: number;
    severity?: string;
    url?: string;
  }> = [];

  // 1. Search Earthquakes
  if (quakes.status === 'fulfilled' && quakes.value?.data) {
    for (const eq of quakes.value.data) {
      const locMatch = eq.location?.toLowerCase().includes(q);
      const titleMatch = eq.title.toLowerCase().includes(q);
      const feltMatch = eq.felt?.toLowerCase().includes(q);
      if (locMatch || titleMatch || feltMatch) {
        results.push({
          type: 'earthquake',
          id: eq.id,
          title: eq.title,
          subtitle: `${eq.occurredAt} • Kedalaman: ${eq.depth} km • ${eq.location}`,
          latitude: eq.latitude,
          longitude: eq.longitude,
          severity: eq.severity,
          url: `/disasters/${eq.id}`,
        });
      }
    }
  }

  // 2. Search Volcanoes (Prefer MAGMA, fallback to OFFICIAL_ACTIVE_VOLCANOES)
  const volcanoList =
    magmaVolcanoes.status === 'fulfilled' && magmaVolcanoes.value?.length > 0
      ? magmaVolcanoes.value
      : OFFICIAL_ACTIVE_VOLCANOES;

  for (const v of volcanoList) {
    const vName = v.name.toLowerCase();
    const vProv = (v.province || '').toLowerCase();
    if (vName.includes(q) || vProv.includes(q)) {
      const status = 'status' in v ? (v as any).status : (v as any).alertLevel;
      const elevation = 'elevation' in v ? (v as any).elevation : (v as any).elevationMeters;
      results.push({
        type: 'volcano',
        id: v.id,
        title: v.name,
        subtitle: `${status} • ${v.province} (${elevation ? `${elevation} mdpl` : '-'})`,
        latitude: v.latitude ?? undefined,
        longitude: v.longitude ?? undefined,
        severity: status.toLowerCase().includes('siaga') || status.toLowerCase().includes('awas') ? 'high' : 'moderate',
        url: `/volcanoes/${v.id}`,
      });
    }
  }

  // 3. Search Provinces
  for (const p of OFFICIAL_PROVINCE_RISK) {
    if (p.provinceName.toLowerCase().includes(q)) {
      results.push({
        type: 'province',
        id: p.provinceCode,
        title: p.provinceName,
        subtitle: `Indeks Risiko: ${p.irbiScore} (${p.irbiClass}) • Kapasitas: ${p.capacityLevel}`,
        url: `/regions?province=${p.provinceCode}`,
      });
    }
  }

  // 4. Search Districts
  for (const d of OFFICIAL_DISTRICT_RISK) {
    if (d.districtName.toLowerCase().includes(q) || d.provinceName.toLowerCase().includes(q)) {
      results.push({
        type: 'district',
        id: d.districtCode,
        title: d.districtName,
        subtitle: `${d.provinceName} • IRBI: ${d.irbiScore} (${d.irbiClass})`,
        url: `/regions?province=${d.provinceCode}&district=${d.districtCode}`,
      });
    }
  }

  return NextResponse.json({
    success: true,
    query: q,
    count: results.length,
    results: results.slice(0, 20),
    timestamp: new Date().toISOString(),
  });
}
