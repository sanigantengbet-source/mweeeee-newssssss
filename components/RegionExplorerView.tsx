'use client';

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Compass,
  Building2
} from 'lucide-react';
import { RegionRiskProfile } from '@/types/risk';
import { OFFICIAL_DISTRICT_RISK, DistrictRiskProfile } from '@/lib/inarisk-data';
import { RegionExplorerSkeleton } from '@/components/LoadingSkeletons';

interface RegionExplorerViewProps {
  provinces: RegionRiskProfile[];
  isLoading?: boolean;
  onFocusMap: (lat: number, lng: number, title?: string) => void;
}

export const RegionExplorerView: React.FC<RegionExplorerViewProps> = ({
  provinces,
  isLoading = false,
  onFocusMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<RegionRiskProfile>(provinces[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRiskProfile | null>(null);

  if (isLoading || provinces.length === 0) {
    return <RegionExplorerSkeleton />;
  }

  // Filter provinces & districts
  const filteredProvinces = provinces.filter((p) =>
    p.provinceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableDistricts = OFFICIAL_DISTRICT_RISK.filter(
    (d) => d.provinceCode === selectedProvince?.provinceCode
  );

  return (
    <div id="region-explorer-container" className="space-y-6 transition-colors duration-150">
      {/* Search Header */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--gh-text)] flex items-center gap-2">
              <Compass className="h-5 w-5 text-red-500" strokeWidth={1.75} />
              Eksplorasi Profil Risiko Wilayah Indonesia
            </h2>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)]">
              Cari profil ketahanan daerah, indeks IRBI, dan kerentanan per provinsi atau kabupaten/kota
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Ketik nama provinsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] pl-10 pr-4 py-2 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-subtle)] focus:border-[var(--gh-border-active)] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Quick province chips */}
        <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
          {filteredProvinces.slice(0, 10).map((p) => (
            <button
              key={p.provinceCode}
              onClick={() => {
                setSelectedProvince(p);
                setSelectedDistrict(null);
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium border transition ${
                selectedProvince?.provinceCode === p.provinceCode
                  ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] border-[var(--gh-border-active)] font-semibold shadow-sm'
                  : 'bg-[var(--gh-surface)] text-[var(--gh-text-muted)] border-[var(--gh-border)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]'
              }`}
            >
              {p.provinceName}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Region Detailed Card */}
      {selectedProvince && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Provincial Profile */}
          <div className="lg:col-span-8 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--gh-border)] pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                  Provinsi Terpilih
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--gh-text)] mt-1">
                  {selectedProvince.provinceName}
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] text-right">
                  <span className="text-[10px] uppercase font-semibold text-[var(--gh-text-muted)] block">Skor IRBI</span>
                  <span className="text-xl sm:text-2xl font-bold text-red-500 font-mono">
                    {selectedProvince.irbiScore}
                  </span>
                </div>
                <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] text-right">
                  <span className="text-[10px] uppercase font-semibold text-[var(--gh-text-muted)] block">Tingkat Risiko</span>
                  <span className={`text-sm sm:text-base font-bold ${selectedProvince.irbiClass === 'Tinggi' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {selectedProvince.irbiClass}
                  </span>
                </div>
              </div>
            </div>

            {/* Kabupaten / Kota Selector if available */}
            {availableDistricts.length > 0 && (
              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gh-text)] block mb-2">
                  Pilih Kabupaten / Kota di {selectedProvince.provinceName}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedDistrict(null)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium border transition ${
                      selectedDistrict === null
                        ? 'bg-[var(--gh-surface)] text-[var(--gh-text)] border-[var(--gh-border-active)] font-semibold shadow-sm'
                        : 'bg-transparent text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface)]'
                    }`}
                  >
                    Seluruh Provinsi
                  </button>
                  {availableDistricts.map((d) => (
                    <button
                      key={d.districtCode}
                      onClick={() => setSelectedDistrict(d)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium border transition ${
                        selectedDistrict?.districtCode === d.districtCode
                          ? 'bg-[var(--gh-surface)] text-[var(--gh-text)] border-[var(--gh-border-active)] font-semibold shadow-sm'
                          : 'bg-transparent text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface)]'
                      }`}
                    >
                      {d.districtName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active District Detail Banner if chosen */}
            {selectedDistrict && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-red-500 uppercase">Tingkat Kabupaten/Kota</span>
                    <h4 className="text-base sm:text-lg font-bold text-[var(--gh-text)]">{selectedDistrict.districtName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--gh-text-muted)]">Skor IRBI: </span>
                    <span className="text-base sm:text-lg font-bold text-[var(--gh-text)] font-mono">{selectedDistrict.irbiScore}</span>
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded border border-red-500/20 bg-red-500/10 text-red-500">
                      {selectedDistrict.irbiClass}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Hazard Breakdown for this region */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--gh-text)] mb-3">
                Matriks Bahaya Kebencanaan ({selectedDistrict ? selectedDistrict.districtName : selectedProvince.provinceName}):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.entries(selectedDistrict ? selectedDistrict.riskBreakdown : selectedProvince.riskBreakdown).map(
                  ([k, v]) => (
                    <div key={k} className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] text-center">
                      <span className="text-[11px] font-semibold text-[var(--gh-text-muted)] uppercase block mb-1">{k}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                          v === 'Tinggi'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : v === 'Sedang'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}
                      >
                        {v}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Capacity Level */}
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[var(--gh-text)] block">Tingkat Kapasitas Kesiapsiagaan Daerah:</span>
                <span className="text-xs text-[var(--gh-text-muted)]">Kemampuan BPBD dan infrastruktur evakuasi lokal</span>
              </div>
              <span className="px-3 py-1 rounded-md bg-[var(--gh-surface)] border border-[var(--gh-border)] text-xs font-bold text-[var(--gh-text)]">
                {selectedDistrict ? selectedDistrict.capacityLevel : selectedProvince.capacityLevel}
              </span>
            </div>
          </div>

          {/* Right: Regional Recommendations & Preparedness Guide */}
          <div className="lg:col-span-4 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[var(--gh-text)] font-semibold text-xs uppercase tracking-wider border-b border-[var(--gh-border)] pb-3">
              <BookOpen className="h-4 w-4 text-[var(--gh-accent)]" strokeWidth={1.75} />
              Rekomendasi Kesiapsiagaan BNPB
            </div>

            <div className="space-y-3 text-xs text-[var(--gh-text)]">
              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
                <span className="font-semibold text-[var(--gh-text)] block mb-1">1. Jalur &amp; Titik Evakuasi</span>
                <p className="text-[var(--gh-text-muted)] leading-relaxed text-[11px]">
                  Kenali lokasi Tempat Evakuasi Sementara (TES) dan Tempat Evakuasi Akhir (TEA) resmi di sekitar pemukiman Anda.
                </p>
              </div>

              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
                <span className="font-semibold text-[var(--gh-text)] block mb-1">2. Tas Siaga Bencana (TSB)</span>
                <p className="text-[var(--gh-text-muted)] leading-relaxed text-[11px]">
                  Siapkan dokumen berharga, obat-obatan esensial, senter, peluit, air bersih, dan makanan tahan lama untuk kebutuhan mandiri 3 hari pertama.
                </p>
              </div>

              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
                <span className="font-semibold text-[var(--gh-text)] block mb-1">3. Kontak Darurat BPBD</span>
                <p className="text-[var(--gh-text-muted)] leading-relaxed text-[11px]">
                  Simpan nomor darurat Call Center 112 atau Posko BPBD {selectedProvince.provinceName} di ponsel Anda.
                </p>
              </div>

              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
                <span className="font-semibold text-[var(--gh-text)] block mb-1">4. Verifikasi Informasi</span>
                <p className="text-[var(--gh-text-muted)] leading-relaxed text-[11px]">
                  Ikuti hanya informasi resmi dari aplikasi BMKG, portal InaRISK BNPB, dan instansi berwenang tanpa menyebarkan kabar angin.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
