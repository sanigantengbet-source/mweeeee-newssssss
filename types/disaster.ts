export type DisasterType =
  | 'earthquake'
  | 'tsunami'
  | 'volcano'
  | 'flood'
  | 'landslide'
  | 'wildfire'
  | 'drought'
  | 'extreme-weather'
  | 'liquefaction'
  | 'multi-hazard';

export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'low' | 'unknown';

export interface Disaster {
  id: string;
  type: DisasterType;
  title: string;
  latitude?: number;
  longitude?: number;
  magnitude?: number;
  depth?: number; // in km
  depthUnit?: string;
  location?: string;
  province?: string;
  district?: string;
  severity?: SeverityLevel;
  occurredAt?: string;
  updatedAt?: string;
  source: 'BMKG' | 'BNPB' | 'InaRISK' | 'PVMBG' | 'PVMBG / InaRISK' | 'PVMBG / MAGMA Indonesia';
  potential?: string;
  tsunamiPotential?: boolean;
  felt?: string;
  shakemapUrl?: string;
  sourceUrl?: string;
  verified: boolean;
}

export interface EarthquakeDetail extends Disaster {
  coordinatesFormatted?: string;
  dirasakanMMI?: string;
  tsunamiPotential?: boolean;
  jam?: string;
  tanggal?: string;
  lintang?: string;
  bujur?: string;
}

export interface VolcanoDetail {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  elevation?: number;
  province: string;
  alertLevel: string;
  status?: string;
  statusColor: string;
  lastActivity?: string;
  source: string;
  reportUrl?: string;
  recommendation?: string;
}

export interface GeoJsonFeature<P = Record<string, unknown>> {
  type: 'Feature';
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon' | 'MultiPolygon';
    coordinates: number[] | number[][] | number[][][];
  };
  properties: P;
}

export interface GeoJsonFeatureCollection<P = Record<string, unknown>> {
  type: 'FeatureCollection';
  features: GeoJsonFeature<P>[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  source: string;
  timestamp: string;
  cached?: boolean;
  error?: string;
}

export interface DashboardStats {
  earthquakesToday: number;
  latestEarthquake: Disaster | null;
  significantQuakesCount: number;
  activeVolcanoesCount: number;
  activeTsunamiWarnings: number;
  monitoredProvincesCount: number;
  lastUpdated: string;
  dataStatus: {
    bmkg: 'online' | 'degraded' | 'unavailable';
    bnpb: 'online' | 'degraded' | 'unavailable';
    inarisk: 'online' | 'degraded' | 'unavailable';
  };
}
