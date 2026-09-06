import { NextRequest, NextResponse } from 'next/server';
import { getMagmaVolcanoes, FALLBACK_VOLCANOES } from '@/lib/magma-api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusFilter = (searchParams.get('status') || '').toLowerCase().trim();
  const searchFilter = (searchParams.get('search') || '').toLowerCase().trim();

  try {
    let volcanoes = await getMagmaVolcanoes();

    if (statusFilter && statusFilter !== 'semua' && statusFilter !== 'all') {
      volcanoes = volcanoes.filter((v) => v.status.toLowerCase().includes(statusFilter));
    }

    if (searchFilter) {
      volcanoes = volcanoes.filter(
        (v) =>
          v.name.toLowerCase().includes(searchFilter) ||
          v.province.toLowerCase().includes(searchFilter)
      );
    }

    return NextResponse.json({
      success: true,
      source: 'PVMBG / MAGMA Indonesia',
      updatedAt: new Date().toISOString(),
      total: volcanoes.length,
      data: volcanoes,
    });
  } catch {
    let fallback = FALLBACK_VOLCANOES;
    if (statusFilter && statusFilter !== 'semua' && statusFilter !== 'all') {
      fallback = fallback.filter((v) => v.status.toLowerCase().includes(statusFilter));
    }
    if (searchFilter) {
      fallback = fallback.filter(
        (v) =>
          v.name.toLowerCase().includes(searchFilter) ||
          v.province.toLowerCase().includes(searchFilter)
      );
    }

    return NextResponse.json({
      success: true,
      source: 'PVMBG / MAGMA Indonesia (Pusat Data)',
      updatedAt: new Date().toISOString(),
      total: fallback.length,
      data: fallback,
    });
  }
}
