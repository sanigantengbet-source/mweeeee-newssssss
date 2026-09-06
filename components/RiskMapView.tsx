'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  ChevronRight, 
  Layers, 
  BarChart3, 
  Info,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { RegionRiskProfile, GisLayerConfig } from '@/types/risk';
import { RiskMapViewSkeleton } from '@/components/LoadingSkeletons';

interface RiskMapViewProps {
  provinces: RegionRiskProfile[];
  riskLayers: GisLayerConfig[];
  isLoading?: boolean;
  onSelectProvince: (province: RegionRiskProfile) => void;
}

export const RiskMapView: React.FC<RiskMapViewProps> = ({
  provinces,
  riskLayers,
  isLoading = false,
  onSelectProvince,
}) => {
  const [selectedHazard, setSelectedHazard] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [activeProvince, setActiveProvince] = useState<RegionRiskProfile | null>(provinces[0] || null);

  if (isLoading || provinces.length === 0) {
    return <RiskMapViewSkeleton />;
  }

  const filteredProvinces = provinces.filter((p) => {
    if (selectedClass !== 'all' && p.irbiClass !== selectedClass) return false;
    return true;
  });

  return (
    <div id="inarisk-risk-map-view" className="space-y-6 transition-colors duration-150">
      {/* Header Info & Formula Banner */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" strokeWidth={1.75} />
              <h2 className="text-base sm:text-lg font-bold text-[var(--gh-text)]">
                Indeks Risiko Bencana Indonesia (IRBI) &amp; InaRISK
              </h2>
            </div>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)] max-w-2xl">
              Metrik standar nasional BNPB untuk menilai potensi kerugian jiwa, ekonomi, dan lingkungan akibat bencana di seluruh provinsi dan kabupaten/kota di Indonesia.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] p-3 text-xs">
            <span className="font-semibold text-red-500 block mb-1 font-mono text-[11px]">Formula Penilaian Risiko BNPB:</span>
            <div className="rounded bg-[var(--gh-surface)] border border-[var(--gh-border)] p-2 font-mono text-[11px] text-[var(--gh-text)]">
              Risiko = (Bahaya [H] &times; Kerentanan [V]) / Kapasitas [C]
            </div>
          </div>
        </div>

        {/* 3 Pillars of Risk Explanation */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
            <span className="font-semibold text-orange-500 block mb-1">1. Bahaya (Hazard)</span>
            <p className="text-[var(--gh-text-muted)] text-[11px] leading-relaxed">
              Frekuensi dan intensitas fenomena alam seperti percepatan tanah gempa (PGA), genangan banjir, lahar, atau kemarau ekstrem.
            </p>
          </div>
          <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
            <span className="font-semibold text-yellow-500 block mb-1">2. Kerentanan (Vulnerability)</span>
            <p className="text-[var(--gh-text-muted)] text-[11px] leading-relaxed">
              Kondisi fisik, sosial-kependudukan (kepadatan &amp; kelompok rentan), dan ekonomi yang rentan terhadap dampak bencana.
            </p>
          </div>
          <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
            <span className="font-semibold text-emerald-500 block mb-1">3. Kapasitas (Capacity)</span>
            <p className="text-[var(--gh-text-muted)] text-[11px] leading-relaxed">
              Kesiapsiagaan kelembagaan BPBD, tata ruang aman bencana, sistem peringatan dini, dan ketahanan infrastruktur evakuasi.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: List & Details Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Provincial Ranking List */}
        <div className="lg:col-span-6 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-3 mb-4">
            <div>
              <h3 className="text-xs font-semibold text-[var(--gh-text)] flex items-center gap-2 uppercase tracking-wider">
                <BarChart3 className="h-4 w-4 text-red-500" strokeWidth={1.75} />
                Peringkat Indeks Risiko Provinsi
              </h3>
              <span className="text-[11px] text-[var(--gh-text-muted)]">Publikasi Resmi BNPB IRBI 2024</span>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedClass('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                  selectedClass === 'all'
                    ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] border-[var(--gh-border)] font-semibold'
                    : 'text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedClass('Tinggi')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                  selectedClass === 'Tinggi'
                    ? 'bg-red-500/15 text-red-500 border-red-500/30 font-semibold'
                    : 'text-[var(--gh-text-muted)] border-transparent hover:text-red-500 hover:bg-red-500/10'
                }`}
              >
                Tinggi
              </button>
              <button
                onClick={() => setSelectedClass('Sedang')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                  selectedClass === 'Sedang'
                    ? 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30 font-semibold'
                    : 'text-[var(--gh-text-muted)] border-transparent hover:text-yellow-500 hover:bg-yellow-500/10'
                }`}
              >
                Sedang
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredProvinces.map((prov) => {
              const isSelected = activeProvince?.provinceCode === prov.provinceCode;
              return (
                <div
                  key={prov.provinceCode}
                  onClick={() => {
                    setActiveProvince(prov);
                    onSelectProvince(prov);
                  }}
                  className={`cursor-pointer rounded-lg p-3 border transition flex items-center justify-between ${
                    isSelected
                      ? 'border-[var(--gh-accent)] bg-[var(--gh-accent)]/10'
                      : 'border-[var(--gh-border)] bg-[var(--gh-surface)] hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-surface-raised)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] font-mono text-xs font-bold text-[var(--gh-text-muted)]">
                      {prov.provinceCode}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[var(--gh-text)]">{prov.provinceName}</h4>
                      <span className="text-[11px] text-[var(--gh-text-muted)]">
                        Kapasitas Wilayah: <strong className="text-[var(--gh-text)]">{prov.capacityLevel}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[var(--gh-text)] font-mono">{prov.irbiScore}</div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          prov.irbiClass === 'Tinggi'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}
                      >
                        {prov.irbiClass}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Province Deep Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          {activeProvince ? (
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm">
              <div className="flex items-start justify-between border-b border-[var(--gh-border)] pb-4 mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                    Profil Risiko Bencana Daerah
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--gh-text)] mt-1">{activeProvince.provinceName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--gh-text-muted)] block">Skor IRBI Total</span>
                  <span className="text-2xl sm:text-3xl font-black text-red-500 font-mono">
                    {activeProvince.irbiScore}
                  </span>
                </div>
              </div>

              {/* Breakdown by Hazard Type */}
              <div className="mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gh-text)] block mb-3">
                  Tingkat Bahaya Spesifik per Jenis Ancaman (InaRISK):
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(activeProvince.riskBreakdown).map(([hazardKey, riskLevel]) => {
                    const hazardNames: Record<string, string> = {
                      gempa: 'Gempa Bumi',
                      banjir: 'Banjir',
                      longsor: 'Tanah Longsor',
                      tsunami: 'Tsunami',
                      karhutla: 'Karhutla',
                      gunungapi: 'Gunung Api',
                      kekeringan: 'Kekeringan',
                      likuefaksi: 'Likuefaksi',
                    };

                    const isHigh = riskLevel === 'Tinggi';
                    const isModerate = riskLevel === 'Sedang';

                    return (
                      <div
                        key={hazardKey}
                        className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] flex items-center justify-between"
                      >
                        <span className="text-xs text-[var(--gh-text)] font-medium">
                          {hazardNames[hazardKey] || hazardKey}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            isHigh
                              ? 'bg-red-500/10 text-red-500 border-red-500/20'
                              : isModerate
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}
                        >
                          {riskLevel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Hazard Scores with Visual Progress */}
              {activeProvince.hazardScores && (
                <div className="mt-6 pt-4 border-t border-[var(--gh-border)]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gh-text)] block mb-3">
                    Indeks Komparatif Ancaman (Skala 0 - 200):
                  </span>
                  <div className="space-y-2.5">
                    {activeProvince.hazardScores.map((h, i) => {
                      const score = h.score ?? 0;
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--gh-text-muted)]">{h.hazardNameId}</span>
                            <span className="font-mono text-[var(--gh-text)] font-medium">{score.toFixed(1)} / 200</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score >= 140 ? 'bg-red-500' : score >= 100 ? 'bg-orange-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${Math.min(100, (score / 200) * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* InaRISK GIS Map Link note */}
              <div className="mt-6 rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border border-[var(--gh-border)] flex items-center justify-between text-xs">
                <span className="text-[var(--gh-text-muted)]">
                  Layanan GIS REST: <strong className="text-[var(--gh-text)]">ArcGIS ImageServer BNPB</strong>
                </span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  Katalog Resmi Aktif
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-12 text-center text-[var(--gh-text-muted)] text-xs">
              Pilih salah satu provinsi untuk melihat profil risiko lengkap
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
