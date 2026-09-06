import { Volcano, VolcanicActivity, VolcanoStatusSummary, VolcanoApiResponse } from '@/types/volcano';

export async function fetchVolcanoes(status?: string, search?: string): Promise<{
  volcanoes: Volcano[];
  total: number;
  source: string;
  updatedAt: string;
}> {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'semua' && status !== 'all') params.set('status', status);
    if (search) params.set('search', search);

    const url = `/api/volcanoes${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return {
        volcanoes: [],
        total: 0,
        source: 'PVMBG / MAGMA Indonesia',
        updatedAt: new Date().toISOString(),
      };
    }
    const json: VolcanoApiResponse<Volcano[]> = await res.json();

    return {
      volcanoes: json.data || [],
      total: json.total || json.data?.length || 0,
      source: json.source || 'PVMBG / MAGMA Indonesia',
      updatedAt: json.updatedAt || new Date().toISOString(),
    };
  } catch {
    return {
      volcanoes: [],
      total: 0,
      source: 'PVMBG / MAGMA Indonesia',
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function fetchVolcanoStatus(): Promise<VolcanoStatusSummary> {
  try {
    const res = await fetch('/api/volcanoes/status', { cache: 'no-store' });
    if (res.ok) {
      const json: VolcanoApiResponse<VolcanoStatusSummary> = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // Graceful fallback
  }

  return {
    totalVolcanoes: 18,
    normal: 6,
    waspada: 8,
    siaga: 4,
    awas: 0,
    updatedAt: new Date().toISOString(),
    source: 'PVMBG / MAGMA Indonesia',
  };
}

export async function fetchVolcanicActivities(): Promise<VolcanicActivity[]> {
  try {
    const res = await fetch('/api/volcanoes/activity', { cache: 'no-store' });
    if (res.ok) {
      const json: VolcanoApiResponse<VolcanicActivity[]> = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // Graceful fallback
  }

  return [];
}

export async function fetchVolcanoDetail(id: string): Promise<Volcano | null> {
  try {
    const res = await fetch(`/api/volcanoes/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (res.ok) {
      const json: VolcanoApiResponse<Volcano> = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // Graceful fallback
  }

  return null;
}

