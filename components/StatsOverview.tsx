'use client';

import React from 'react';
import { Activity, Flame, ShieldAlert, Mountain } from 'lucide-react';
import { EarthquakeDetail, VolcanoDetail } from '@/types/disaster';
import { RegionRiskProfile } from '@/types/risk';
import { StatsOverviewSkeleton } from '@/components/LoadingSkeletons';

interface StatsOverviewProps {
  latestQuake: EarthquakeDetail | null;
  allEarthquakes: EarthquakeDetail[];
  volcanoes: VolcanoDetail[];
  provinces: RegionRiskProfile[];
  isLoading?: boolean;
  onOpenQuakeTab: () => void;
  onOpenVolcanoTab: () => void;
  onOpenRiskTab: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  latestQuake,
  allEarthquakes,
  volcanoes,
  provinces,
  isLoading = false,
  onOpenQuakeTab,
  onOpenVolcanoTab,
  onOpenRiskTab,
}) => {
  if (isLoading) {
    return <StatsOverviewSkeleton />;
  }
  const activeAlertVolcanoes = volcanoes.filter(
    (v) => {
      const lvl = (v.alertLevel || v.status || '').toLowerCase();
      return lvl.includes('siaga') || lvl.includes('awas');
    }
  );

  const highRiskProvinces = provinces.filter((p) => p.irbiClass === 'Tinggi');

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Stat Card 1: Gempa Terkini */}
      <div
        id="stat-card-latest-quake"
        onClick={onOpenQuakeTab}
        className="group cursor-pointer rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 transition-all hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-surface-raised)] shadow-xs"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--gh-text-muted)]">
            Gempa Terkini (BMKG)
          </span>
          <div className="rounded-lg bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] p-1.5 text-rose-500 group-hover:scale-105 transition-transform">
            <Activity className="h-4 w-4" strokeWidth={1.75} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-[var(--gh-text)]">
            {latestQuake ? `M ${latestQuake.magnitude}` : 'M --'}
          </span>
          <span className="text-xs text-rose-500 font-medium">
            Kedalaman {latestQuake?.depth || 0} km
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-[var(--gh-text-muted)]">
          {latestQuake?.location || 'Mengambil data BMKG...'}
        </p>
      </div>

      {/* Stat Card 2: Total Gempa Terpantau */}
      <div
        id="stat-card-total-quakes"
        onClick={onOpenQuakeTab}
        className="group cursor-pointer rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 transition-all hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-surface-raised)] shadow-xs"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--gh-text-muted)]">
            Total Gempa Signifikan
          </span>
          <div className="rounded-lg bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] p-1.5 text-amber-500 group-hover:scale-105 transition-transform">
            <Flame className="h-4 w-4" strokeWidth={1.75} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-[var(--gh-text)]">
            {allEarthquakes.length}
          </span>
          <span className="text-xs text-amber-500 font-medium">
            M ≥ 5.0 & Dirasakan
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--gh-text-muted)]">
          Katalog seismik realtime BMKG
        </p>
      </div>

      {/* Stat Card 3: Gunung Api Siaga / Awas */}
      <div
        id="stat-card-volcanoes"
        onClick={onOpenVolcanoTab}
        className="group cursor-pointer rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 transition-all hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-surface-raised)] shadow-xs"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--gh-text-muted)]">
            Gunung Api Siaga/Awas
          </span>
          <div className="rounded-lg bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] p-1.5 text-orange-500 group-hover:scale-105 transition-transform">
            <Mountain className="h-4 w-4" strokeWidth={1.75} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-orange-500">
            {activeAlertVolcanoes.length}
          </span>
          <span className="text-xs text-[var(--gh-text-muted)] font-medium">
            dari {volcanoes.length} terpantau
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-[var(--gh-text-muted)]">
          Merapi, Semeru, Ibu, Lewotobi
        </p>
      </div>

      {/* Stat Card 4: Wilayah Risiko Tinggi (IRBI) */}
      <div
        id="stat-card-high-risk-provinces"
        onClick={onOpenRiskTab}
        className="group cursor-pointer rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 transition-all hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-surface-raised)] shadow-xs"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--gh-text-muted)]">
            Provinsi Risiko Tinggi
          </span>
          <div className="rounded-lg bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] p-1.5 text-indigo-500 group-hover:scale-105 transition-transform">
            <ShieldAlert className="h-4 w-4" strokeWidth={1.75} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-[var(--gh-text)]">
            {highRiskProvinces.length}
          </span>
          <span className="text-xs text-indigo-500 font-medium">
            Indeks IRBI &gt; 130
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--gh-text-muted)]">
          Indeks Risiko Bencana Indonesia
        </p>
      </div>
    </div>
  );
};
