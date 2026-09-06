export type RiskClass = 'Tinggi' | 'Sedang' | 'Rendah' | 'Tidak Ada Data';

export interface HazardRiskScore {
  hazardType: string;
  hazardNameId: string;
  riskClass: RiskClass;
  score?: number; // IRBI score
  populationExposed?: number;
  physicalLossRisk?: string;
  recommendations?: string;
}

export interface RegionRiskProfile {
  provinceCode: string;
  provinceName: string;
  districtCode?: string;
  districtName?: string;
  irbiScore: number; // Indeks Risiko Bencana Indonesia
  irbiClass: RiskClass;
  riskBreakdown: Record<string, RiskClass>;
  hazardScores: HazardRiskScore[];
  capacityLevel: 'Tinggi' | 'Sedang' | 'Rendah';
  lastUpdatedYear: number;
  source: string;
}

export interface GisLayerConfig {
  id: string;
  name: string;
  hazardType: string;
  serviceType: 'FeatureServer' | 'MapServer' | 'ImageServer' | 'GeoJSON' | 'WMS';
  url: string;
  legend: {
    label: string;
    color: string;
  }[];
  description: string;
  source: string;
}
