import { NextRequest, NextResponse } from 'next/server';
import { INARISK_GIS_LAYERS, OFFICIAL_PROVINCE_RISK } from '@/lib/inarisk-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const layer = INARISK_GIS_LAYERS.find(
    (l) => l.id.toLowerCase() === type.toLowerCase() || l.hazardType.toLowerCase() === type.toLowerCase()
  );

  if (!layer) {
    return NextResponse.json(
      {
        success: false,
        error: `Jenis risiko '${type}' tidak ditemukan di katalog InaRISK`,
        availableTypes: INARISK_GIS_LAYERS.map((l) => l.id),
      },
      { status: 404 }
    );
  }

  // Get provinces sorted by this hazard risk
  const relevantProvinces = OFFICIAL_PROVINCE_RISK.map((p) => {
    const hazardScore = p.hazardScores.find(
      (h) => h.hazardType.toLowerCase() === layer.hazardType.toLowerCase()
    );
    return {
      provinceCode: p.provinceCode,
      provinceName: p.provinceName,
      riskClass: hazardScore?.riskClass || p.riskBreakdown[layer.id] || 'Sedang',
      score: hazardScore?.score || p.irbiScore,
      irbiOverallClass: p.irbiClass,
    };
  }).sort((a, b) => b.score - a.score);

  return NextResponse.json({
    success: true,
    layer,
    highRiskProvincesCount: relevantProvinces.filter((p) => p.riskClass === 'Tinggi').length,
    provinces: relevantProvinces,
    source: 'BNPB / InaRISK GIS REST Service',
    timestamp: new Date().toISOString(),
  });
}
