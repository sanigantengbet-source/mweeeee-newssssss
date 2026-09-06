'use client';

import React from 'react';
import { Radio, MapPin, Clock, Gauge, AlertTriangle, ChevronRight, Eye, ShieldCheck } from 'lucide-react';
import { EarthquakeDetail } from '@/types/disaster';
import { LatestQuakeCardSkeleton } from '@/components/LoadingSkeletons';

interface LatestQuakeCardProps {
  quake: EarthquakeDetail | null;
  isLoading?: boolean;
  onViewOnMap: (lat: number, lng: number, title: string) => void;
  onOpenDetails: (quake: EarthquakeDetail) => void;
}

export const LatestQuakeCard: React.FC<LatestQuakeCardProps> = ({
  quake,
  isLoading = false,
  onViewOnMap,
  onOpenDetails,
}) => {
  if (isLoading || !quake) {
    return <LatestQuakeCardSkeleton />;
  }

  const isSignificant = (quake.magnitude || 0) >= 5.0;

  return (
    <div
      id="latest-earthquake-showcase"
      className="relative overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 shadow-xs sm:p-6 transition-colors duration-150"
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--gh-border)] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
            Guncangan Gempa Terkini
          </span>
          <span className="rounded-md bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] px-2 py-0.5 text-[11px] font-mono text-[var(--gh-text-muted)]">
            BMKG Indonesia
          </span>
        </div>

        {quake.tsunamiPotential ? (
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-0.5 text-xs font-semibold text-red-500 border border-red-500/30">
            <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} />
            Potensi Tsunami
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
            Tidak Berpotensi Tsunami
          </span>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: Magnitude & Core Stats */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold tracking-tight text-[var(--gh-text)]">
                M {quake.magnitude !== undefined ? quake.magnitude.toFixed(1) : '--'}
              </span>
              <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold uppercase text-rose-500 border border-rose-500/20">
                {quake.severity === 'critical' ? 'Kritis' : isSignificant ? 'Signifikan' : 'Moderat'}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--gh-text-muted)]">
                <Clock className="h-3.5 w-3.5 text-[var(--gh-text-subtle)] shrink-0" strokeWidth={1.75} />
                <span>
                  {quake.occurredAt} <span className="text-[var(--gh-text-subtle)]">({quake.jam} WIB)</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[var(--gh-text-muted)]">
                <Gauge className="h-3.5 w-3.5 text-[var(--gh-text-subtle)] shrink-0" strokeWidth={1.75} />
                <span>Kedalaman: <strong className="text-[var(--gh-text)] font-mono">{quake.depth} km</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[var(--gh-text-muted)]">
                <MapPin className="h-3.5 w-3.5 text-[var(--gh-text-subtle)] shrink-0" strokeWidth={1.75} />
                <span>
                  Koordinat: <span className="font-mono text-[var(--gh-text)]">{quake.lintang}, {quake.bujur}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-[var(--gh-border)]">
            <button
              id="btn-view-latest-quake-on-map"
              onClick={() => onViewOnMap(quake.latitude || 0, quake.longitude || 0, quake.location || '')}
              className="flex items-center gap-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] px-3.5 py-1.5 text-xs font-semibold text-white border border-[#2ea043]/30 transition shadow-xs active:scale-95"
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
              Lihat di Peta
            </button>
            <button
              id="btn-open-latest-quake-details"
              onClick={() => onOpenDetails(quake)}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--gh-surface-raised)] hover:bg-[var(--gh-border)] px-3.5 py-1.5 text-xs font-semibold text-[var(--gh-text)] border border-[var(--gh-border)] transition shadow-xs active:scale-95"
            >
              Detail & Mitigasi
              <ChevronRight className="h-3.5 w-3.5 text-[var(--gh-text-muted)]" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Center column: Lokasi & Wilayah Dirasakan */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)]">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
              Pusat Gempa (Episentrum)
            </span>
            <h3 className="mt-1 text-sm font-semibold text-[var(--gh-text)] leading-snug">
              {quake.location}
            </h3>

            {quake.potential && (
              <div className="mt-3 rounded-md bg-[var(--gh-bg)] p-2.5 text-xs text-[var(--gh-text-muted)] border border-[var(--gh-border)]">
                <span className="font-semibold text-rose-500">Arahan BMKG: </span>
                {quake.potential}
              </div>
            )}
          </div>

          {quake.felt && (
            <div className="mt-3 pt-3 border-t border-[var(--gh-border)]">
              <span className="text-[11px] font-medium uppercase tracking-wider text-amber-500">
                Skala Guncangan (MMI):
              </span>
              <p className="mt-1 text-xs text-[var(--gh-text-muted)] font-mono leading-relaxed">
                {quake.felt}
              </p>
            </div>
          )}
        </div>

        {/* Right column: Shakemap Preview if available */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] text-center">
          {quake.shakemapUrl ? (
            <div className="group relative w-full overflow-hidden rounded-md border border-[var(--gh-border)]">
              <img
                src={quake.shakemapUrl}
                alt="Peta Shakemap BMKG"
                className="h-32 w-full object-cover rounded-md transition-transform group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="mt-1.5 block text-[10px] text-[var(--gh-text-muted)]">
                Peta Shakemap BMKG
              </span>
            </div>
          ) : (
            <div className="py-6 text-[var(--gh-text-muted)]">
              <MapPin className="mx-auto h-7 w-7 text-[var(--gh-text-subtle)] mb-2" strokeWidth={1.5} />
              <span className="text-xs">Episentrum di laut/darat</span>
              <p className="text-[10px] text-[var(--gh-text-subtle)] mt-1">Koordinat {quake.latitude}, {quake.longitude}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
