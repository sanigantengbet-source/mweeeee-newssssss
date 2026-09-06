import { NextResponse } from 'next/server';
import { OFFICIAL_PROVINCE_RISK } from '@/lib/inarisk-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: OFFICIAL_PROVINCE_RISK.length,
    data: OFFICIAL_PROVINCE_RISK,
    source: 'BNPB IRBI (Indeks Risiko Bencana Indonesia)',
    timestamp: new Date().toISOString(),
  });
}
