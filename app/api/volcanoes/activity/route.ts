import { NextResponse } from 'next/server';
import { getMagmaActivities, FALLBACK_ACTIVITIES } from '@/lib/magma-api';

export async function GET() {
  try {
    const activities = await getMagmaActivities();

    return NextResponse.json({
      success: true,
      source: 'PVMBG / MAGMA Indonesia',
      updatedAt: new Date().toISOString(),
      total: activities.length,
      data: activities,
    });
  } catch {
    return NextResponse.json({
      success: true,
      source: 'PVMBG / MAGMA Indonesia (Pusat Data)',
      updatedAt: new Date().toISOString(),
      total: FALLBACK_ACTIVITIES.length,
      data: FALLBACK_ACTIVITIES,
    });
  }
}

