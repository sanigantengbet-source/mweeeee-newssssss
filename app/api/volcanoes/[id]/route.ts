import { NextRequest, NextResponse } from 'next/server';
import { getMagmaVolcanoDetail } from '@/lib/magma-api';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Parameter ID gunung api harus diisi' },
      { status: 400 }
    );
  }

  try {
    const volcano = await getMagmaVolcanoDetail(id);

    return NextResponse.json({
      success: true,
      source: 'PVMBG / MAGMA Indonesia',
      updatedAt: new Date().toISOString(),
      data: volcano,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : `Gunung api '${id}' tidak ditemukan`;
    return NextResponse.json(
      {
        success: false,
        source: 'PVMBG / MAGMA Indonesia',
        updatedAt: new Date().toISOString(),
        error: message,
        data: null,
      },
      { status: 404 }
    );
  }
}
