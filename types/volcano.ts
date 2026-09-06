export type VolcanoAlertLevel = 
  | 'Level I (Normal)'
  | 'Level II (Waspada)'
  | 'Level III (Siaga)'
  | 'Level IV (Awas)';

export interface Volcano {
  id: string;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  elevation?: number | null;
  province: string;
  status: string;
  statusCode?: number;
  statusColor?: string;
  updatedAt: string;
  source: string;
  sourceUrl?: string;
  reportUrl?: string;
  recommendation?: string;
  visualDescription?: string;
}

export interface VolcanicActivity {
  id: string;
  volcanoId: string;
  volcanoName: string;
  activity: string;
  status: string;
  description: string;
  occurredAt: string;
  updatedAt: string;
  source: string;
  sourceUrl?: string;
  imageUrl?: string;
  author?: string;
}

export interface VolcanoStatusSummary {
  totalVolcanoes: number;
  normal: number;
  waspada: number;
  siaga: number;
  awas: number;
  latestActivity?: string;
  updatedAt: string;
  source: string;
}

export interface VolcanoApiResponse<T> {
  success: boolean;
  source: string;
  updatedAt: string;
  total?: number;
  data: T;
  error?: string;
}
