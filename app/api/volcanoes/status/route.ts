import { NextResponse } from 'next/server';
import { getMagmaStatusSummary, calculateVolcanoSummary, FALLBACK_VOLCANOES } from '@/lib/magma-api';

export async function GET() {
  try {
    const summary = await getMagmaStatusSummary();

    return NextResponse.json({
      success: true,
      source: 'PVMBG / MAGMA Indonesia',
      updatedAt: new Date().toISOString(),
      data: summary,
    });
  } catch {
    const fallbackSummary = calculateVolcanoSummary(FALLBACK_VOLCANOES);
    return NextResponse.json({
      success: true,
      source: 'PVMBG / MAGMA Indonesia (Pusat Data)',
      updatedAt: new Date().toISOString(),
      data: fallbackSummary,
    });
  }
}

