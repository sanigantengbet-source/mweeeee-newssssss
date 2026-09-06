import { NextRequest, NextResponse } from 'next/server';
import { OFFICIAL_PROVINCE_RISK, OFFICIAL_DISTRICT_RISK } from '@/lib/inarisk-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check province by code or name
  const province = OFFICIAL_PROVINCE_RISK.find(
    (p) => p.provinceCode === id || p.provinceName.toLowerCase() === id.toLowerCase()
  );

  if (province) {
    const districts = OFFICIAL_DISTRICT_RISK.filter((d) => d.provinceCode === province.provinceCode);
    return NextResponse.json({
      success: true,
      type: 'province',
      data: province,
      districts,
      source: 'BNPB IRBI (Indeks Risiko Bencana Indonesia)',
      timestamp: new Date().toISOString(),
    });
  }

  // Check district
  const district = OFFICIAL_DISTRICT_RISK.find(
    (d) => d.districtCode === id || d.districtName.toLowerCase().includes(id.toLowerCase())
  );

  if (district) {
    return NextResponse.json({
      success: true,
      type: 'district',
      data: district,
      source: 'BNPB IRBI',
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: `Wilayah dengan ID atau nama '${id}' tidak ditemukan`,
    },
    { status: 404 }
  );
}
