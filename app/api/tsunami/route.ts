import { NextResponse } from 'next/server';
import { getAllRecentEarthquakes } from '@/lib/bmkg';

export async function GET() {
  const quakes = await getAllRecentEarthquakes();
  const tsunamiPotentialQuakes = quakes.data.filter((q) => q.tsunamiPotential);

  return NextResponse.json({
    success: true,
    warningStatus: tsunamiPotentialQuakes.length > 0 ? 'Waspada / Siaga' : 'Normal',
    activeAlerts: tsunamiPotentialQuakes.length,
    events: tsunamiPotentialQuakes,
    hazardLayer: {
      id: 'tsunami',
      name: 'Bahaya Tsunami InaRISK',
      serviceUrl: 'https://inarisk.bnpb.go.id:6443/arcgis/rest/services/inaRISK/INDEKS_BAHAYA_TSUNAMI/ImageServer',
      source: 'BNPB / InaRISK',
    },
    source: 'BMKG & InaRISK BNPB',
    timestamp: new Date().toISOString(),
  });
}
