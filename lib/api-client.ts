import { Disaster, EarthquakeDetail, VolcanoDetail, DashboardStats } from '@/types/disaster';
import { GisLayerConfig, RegionRiskProfile } from '@/types/risk';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchDisasters(): Promise<Disaster[]> {
  try {
    const res = await fetch(`${API_BASE}/api/disasters`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch disasters:', err);
    return [];
  }
}

export async function fetchLatestDisaster(): Promise<Disaster | null> {
  try {
    const res = await fetch(`${API_BASE}/api/disasters/latest`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Failed to fetch latest disaster:', err);
    return null;
  }
}

export async function fetchEarthquakes(): Promise<EarthquakeDetail[]> {
  try {
    const res = await fetch(`${API_BASE}/api/earthquakes`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch earthquakes:', err);
    return [];
  }
}

export async function fetchLatestEarthquake(): Promise<EarthquakeDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/earthquakes/latest`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('Failed to fetch latest earthquake:', err);
    return null;
  }
}

export async function fetchVolcanoes(): Promise<VolcanoDetail[]> {
  try {
    const res = await fetch(`${API_BASE}/api/volcanoes`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch volcanoes:', err);
    return [];
  }
}

export async function fetchRiskLayers(): Promise<GisLayerConfig[]> {
  try {
    const res = await fetch(`${API_BASE}/api/map/layers`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch GIS layers:', err);
    return [];
  }
}

export async function fetchProvincesRisk(): Promise<RegionRiskProfile[]> {
  try {
    const res = await fetch(`${API_BASE}/api/regions`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch provinces risk:', err);
    return [];
  }
}
