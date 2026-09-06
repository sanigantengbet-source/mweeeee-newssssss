import { NextRequest, NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS, OFFICIAL_PROVINCE_RISK, OFFICIAL_DISTRICT_RISK } from '@/lib/inarisk-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const layer = INARISK_GIS_LAYERS.find(
    (l) => l.id.toLowerCase() === type.toLowerCase() || l.hazardType.toLowerCase() === type.toLowerCase()
  );

  if (!layer) {
    return NextResponse.json({ success: false, error: 'Jenis bahaya tidak valid' }, { status: 404 });
  }

  const provinceData = OFFICIAL_PROVINCE_RISK.map((p) => ({
    type: 'province',
    code: p.provinceCode,
    name: p.provinceName,
    riskClass: p.riskBreakdown[layer.id] || 'Sedang',
    score: p.hazardScores.find((h) => h.hazardType === layer.hazardType)?.score || p.irbiScore,
  }));

  const districtData = OFFICIAL_DISTRICT_RISK.map((d) => ({
    type: 'district',
    code: d.districtCode,
    name: d.districtName,
    provinceName: d.provinceName,
    riskClass: d.riskBreakdown[layer.id] || 'Sedang',
    irbiScore: d.irbiScore,
  }));

  return NextResponse.json({
    success: true,
    hazard: layer.name,
    provinces: provinceData,
    districts: districtData,
    source: 'BNPB IRBI (Indeks Risiko Bencana Indonesia)',
    timestamp: new Date().toISOString(),
  });
}
