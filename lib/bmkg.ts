import { Disaster, EarthquakeDetail, SeverityLevel } from '@/types/disaster';
import { globalCache, CACHE_TTL } from './cache';

const BMKG_BASE = process.env.BMKG_BASE_URL || 'https://data.bmkg.go.id/DataMKG/TEWS';

interface RawBmkgGempa {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi?: string;
  Dirasakan?: string;
  Shakemap?: string;
}

interface RawAutogempaResponse {
  Infogempa: {
    gempa: RawBmkgGempa;
  };
}

interface RawGempaListResponse {
  Infogempa: {
    gempa: RawBmkgGempa[];
  };
}

function calculateSeverity(magnitude: number, depth: number): SeverityLevel {
  if (magnitude >= 6.5) return 'critical';
  if (magnitude >= 5.0) return 'high';
  if (magnitude >= 4.0) return 'moderate';
  if (magnitude > 0) return 'low';
  return 'unknown';
}

function parseCoordinates(coordStr: string): { lat: number; lng: number } | null {
  if (!coordStr) return null;
  const parts = coordStr.split(',').map((s) => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] };
  }
  return null;
}

function parseDepth(depthStr: string): number {
  if (!depthStr) return 0;
  const match = depthStr.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function normalizeBmkgGempa(raw: RawBmkgGempa, index: number = 0): EarthquakeDetail {
  const mag = parseFloat(raw.Magnitude) || 0;
  const coords = parseCoordinates(raw.Coordinates);
  const depth = parseDepth(raw.Kedalaman);
  const id = raw.DateTime ? `bmkg-${raw.DateTime.replace(/[^0-9]/g, '')}-${index}` : `bmkg-${index}`;
  const severity = calculateSeverity(mag, depth);
  const isTsunamiPotential = raw.Potensi ? !raw.Potensi.toLowerCase().includes('tidak berpotensi tsunami') && raw.Potensi.toLowerCase().includes('tsunami') : false;

  return {
    id,
    type: 'earthquake',
    title: `Gempa M ${raw.Magnitude} - ${raw.Wilayah}`,
    latitude: coords?.lat,
    longitude: coords?.lng,
    magnitude: mag,
    depth,
    depthUnit: 'km',
    location: raw.Wilayah,
    severity,
    occurredAt: raw.DateTime || `${raw.Tanggal} ${raw.Jam}`,
    updatedAt: new Date().toISOString(),
    source: 'BMKG',
    potential: raw.Potensi || (isTsunamiPotential ? 'Berpotensi Tsunami' : 'Tidak berpotensi tsunami'),
    felt: raw.Dirasakan || 'Data tidak tersedia',
    dirasakanMMI: raw.Dirasakan,
    tsunamiPotential: isTsunamiPotential,
    coordinatesFormatted: `${raw.Lintang}, ${raw.Bujur}`,
    shakemapUrl: raw.Shakemap ? `${BMKG_BASE}/${raw.Shakemap}` : undefined,
    sourceUrl: 'https://www.bmkg.go.id',
    verified: true,
  };
}

async function fetchWithTimeout(url: string, timeoutMs = 7000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'IndonesiaDisasterMonitor/1.0 (Official Data Gateway)',
        Accept: 'application/json',
      },
      next: { revalidate: 30 },
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function getLatestEarthquake(): Promise<{
  data: EarthquakeDetail | null;
  error?: string;
  source: string;
  cached: boolean;
}> {
  const cacheKey = 'bmkg_latest_earthquake';
  const cached = globalCache.get<EarthquakeDetail>(cacheKey);
  if (cached) {
    return { data: cached.data, source: 'BMKG (Cache)', cached: true };
  }

  try {
    const res = await fetchWithTimeout(`${BMKG_BASE}/autogempa.json`);
    if (!res.ok) {
      return {
        data: null,
        error: `BMKG server returned status ${res.status}: BMKG data temporarily unavailable`,
        source: 'BMKG',
        cached: false,
      };
    }
    const json: RawAutogempaResponse = await res.json();
    if (!json?.Infogempa?.gempa) {
      return { data: null, error: 'Data tidak tersedia dari format BMKG', source: 'BMKG', cached: false };
    }

    const normalized = normalizeBmkgGempa(json.Infogempa.gempa, 0);
    globalCache.set(cacheKey, normalized, CACHE_TTL.EARTHQUAKE_REALTIME, 'BMKG');
    return { data: normalized, source: 'BMKG', cached: false };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return {
      data: null,
      error: `BMKG data temporarily unavailable (${errorMsg})`,
      source: 'BMKG',
      cached: false,
    };
  }
}

export async function getRecentM5Earthquakes(): Promise<{
  data: EarthquakeDetail[];
  error?: string;
  source: string;
  cached: boolean;
}> {
  const cacheKey = 'bmkg_recent_m5';
  const cached = globalCache.get<EarthquakeDetail[]>(cacheKey);
  if (cached) {
    return { data: cached.data, source: 'BMKG (Cache)', cached: true };
  }

  try {
    const res = await fetchWithTimeout(`${BMKG_BASE}/gempaterkini.json`);
    if (!res.ok) {
      return { data: [], error: 'BMKG data temporarily unavailable', source: 'BMKG', cached: false };
    }
    const json: RawGempaListResponse = await res.json();
    const list = json?.Infogempa?.gempa || [];
    const normalized = list.map((g, idx) => normalizeBmkgGempa(g, idx));
    globalCache.set(cacheKey, normalized, CACHE_TTL.EARTHQUAKE_LIST, 'BMKG');
    return { data: normalized, source: 'BMKG', cached: false };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { data: [], error: `BMKG data temporarily unavailable (${errorMsg})`, source: 'BMKG', cached: false };
  }
}

export async function getFeltEarthquakes(): Promise<{
  data: EarthquakeDetail[];
  error?: string;
  source: string;
  cached: boolean;
}> {
  const cacheKey = 'bmkg_felt_earthquakes';
  const cached = globalCache.get<EarthquakeDetail[]>(cacheKey);
  if (cached) {
    return { data: cached.data, source: 'BMKG (Cache)', cached: true };
  }

  try {
    const res = await fetchWithTimeout(`${BMKG_BASE}/gempadirasakan.json`);
    if (!res.ok) {
      return { data: [], error: 'BMKG data temporarily unavailable', source: 'BMKG', cached: false };
    }
    const json: RawGempaListResponse = await res.json();
    const list = json?.Infogempa?.gempa || [];
    const normalized = list.map((g, idx) => normalizeBmkgGempa(g, 100 + idx));
    globalCache.set(cacheKey, normalized, CACHE_TTL.EARTHQUAKE_LIST, 'BMKG');
    return { data: normalized, source: 'BMKG', cached: false };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { data: [], error: `BMKG data temporarily unavailable (${errorMsg})`, source: 'BMKG', cached: false };
  }
}

export async function getAllRecentEarthquakes(): Promise<{
  data: EarthquakeDetail[];
  latest: EarthquakeDetail | null;
  error?: string;
  source: string;
}> {
  const [latestRes, m5Res, feltRes] = await Promise.all([
    getLatestEarthquake(),
    getRecentM5Earthquakes(),
    getFeltEarthquakes(),
  ]);

  const map = new Map<string, EarthquakeDetail>();

  if (latestRes.data) {
    map.set(latestRes.data.id, latestRes.data);
  }
  for (const q of m5Res.data) {
    if (!map.has(q.id)) {
      map.set(q.id, q);
    }
  }
  for (const q of feltRes.data) {
    if (!map.has(q.id)) {
      map.set(q.id, q);
    }
  }

  const combined = Array.from(map.values()).sort((a, b) => {
    const timeA = a.occurredAt ? new Date(a.occurredAt).getTime() : 0;
    const timeB = b.occurredAt ? new Date(b.occurredAt).getTime() : 0;
    return timeB - timeA;
  });

  return {
    data: combined,
    latest: latestRes.data || combined[0] || null,
    source: 'BMKG',
    error: latestRes.error && m5Res.error ? latestRes.error : undefined,
  };
}
