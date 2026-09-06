'use client';

import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  MapPin, 
  Clock, 
  Gauge, 
  AlertTriangle, 
  Mountain, 
  Eye, 
  ChevronRight, 
  SlidersHorizontal 
} from 'lucide-react';
import { EarthquakeDetail, VolcanoDetail, Disaster } from '@/types/disaster';
import { DisasterListSkeleton } from '@/components/LoadingSkeletons';

interface DisasterListProps {
  earthquakes: EarthquakeDetail[];
  volcanoes: VolcanoDetail[];
  isLoading?: boolean;
  onFocusMap: (lat: number, lng: number, title?: string) => void;
  onSelectDisaster: (disaster: Disaster) => void;
}

export const DisasterList: React.FC<DisasterListProps> = ({
  earthquakes,
  volcanoes,
  isLoading = false,
  onFocusMap,
  onSelectDisaster,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'quake-m5' | 'quake-felt' | 'volcano'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minMagnitude, setMinMagnitude] = useState<number>(0);

  // Filter items
  const filteredItems = useMemo(() => {
    if (isLoading) return [];
    let items: Array<{
      id: string;
      category: 'earthquake' | 'volcano';
      title: string;
      location: string;
      time: string;
      magnitude?: number;
      depth?: number;
      felt?: string;
      alertLevel?: string;
      statusColor?: string;
      lat: number;
      lng: number;
      potential?: string;
      source: string;
      raw: EarthquakeDetail | VolcanoDetail;
    }> = [];

    // Process Earthquakes
    earthquakes.forEach((eq) => {
      const isM5 = (eq.magnitude || 0) >= 5.0;
      const isFelt = !!eq.felt;

      if (filterType === 'volcano') return;
      if (filterType === 'quake-m5' && !isM5) return;
      if (filterType === 'quake-felt' && !isFelt) return;
      if (minMagnitude > 0 && (eq.magnitude || 0) < minMagnitude) return;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchLoc = (eq.location || '').toLowerCase().includes(q);
        const matchFelt = eq.felt?.toLowerCase().includes(q);
        if (!matchLoc && !matchFelt) return;
      }

      items.push({
        id: eq.id,
        category: 'earthquake',
        title: eq.title,
        location: eq.location || 'Wilayah Indonesia',
        time: `${eq.occurredAt || ''} (${eq.jam || ''} WIB)`,
        magnitude: eq.magnitude,
        depth: eq.depth,
        felt: eq.felt,
        lat: eq.latitude || 0,
        lng: eq.longitude || 0,
        potential: eq.potential,
        source: 'BMKG',
        raw: eq,
      });
    });

    // Process Volcanoes
    if (filterType === 'all' || filterType === 'volcano') {
      volcanoes.forEach((v) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = v.name.toLowerCase().includes(q);
          const matchProv = v.province.toLowerCase().includes(q);
          if (!matchName && !matchProv) return;
        }

        items.push({
          id: v.id,
          category: 'volcano',
          title: v.name,
          location: `${v.province} (${v.elevationMeters} mdpl)`,
          time: 'Aktivitas Terkini',
          alertLevel: v.alertLevel,
          statusColor: v.statusColor,
          lat: v.latitude,
          lng: v.longitude,
          potential: v.lastActivity,
          source: 'PVMBG / InaRISK',
          raw: v,
        });
      });
    }

    return items;
  }, [earthquakes, volcanoes, filterType, searchQuery, minMagnitude, isLoading]);

  if (isLoading) {
    return <DisasterListSkeleton />;
  }

  return (
    <div id="disaster-feed-container" className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 shadow-xs transition-colors duration-150">
      {/* Header with Title & Live Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--gh-border)] pb-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--gh-text)] flex items-center gap-2">
            <Filter className="h-4 w-4 text-rose-500" strokeWidth={1.75} />
            Daftar Peristiwa Bencana Terkini
          </h2>
          <p className="text-xs text-[var(--gh-text-muted)]">
            {filteredItems.length} rekaman terverifikasi dari BMKG & PVMBG
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              filterType === 'all'
                ? 'bg-[#238636] text-white shadow-xs'
                : 'bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] border border-[var(--gh-border)]'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('quake-m5')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              filterType === 'quake-m5'
                ? 'bg-[#238636] text-white shadow-xs'
                : 'bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] border border-[var(--gh-border)]'
            }`}
          >
            Gempa M ≥ 5.0
          </button>
          <button
            onClick={() => setFilterType('quake-felt')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              filterType === 'quake-felt'
                ? 'bg-[#238636] text-white shadow-xs'
                : 'bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] border border-[var(--gh-border)]'
            }`}
          >
            Gempa Dirasakan
          </button>
          <button
            onClick={() => setFilterType('volcano')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              filterType === 'volcano'
                ? 'bg-[#238636] text-white shadow-xs'
                : 'bg-[var(--gh-surface-raised)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] border border-[var(--gh-border)]'
            }`}
          >
            Gunung Api
          </button>
        </div>
      </div>

      {/* Sub-filters: Search and Magnitude */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari lokasi, pulau, atau nama gunung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-1.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-subtle)] focus:border-[var(--gh-border-active)] focus:outline-none transition shadow-xs"
          />
        </div>

        {filterType !== 'volcano' && (
          <select
            value={minMagnitude}
            onChange={(e) => setMinMagnitude(Number(e.target.value))}
            className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-1.5 text-xs text-[var(--gh-text)] focus:border-[var(--gh-border-active)] focus:outline-none transition shadow-xs"
          >
            <option value={0}>Semua Magnitudo</option>
            <option value={4.0}>M ≥ 4.0</option>
            <option value={5.0}>M ≥ 5.0 (Signifikan)</option>
            <option value={6.0}>M ≥ 6.0 (Kuat/Merusak)</option>
          </select>
        )}
      </div>

      {/* Scrollable Disaster Cards List */}
      <div className="mt-4 max-h-[500px] overflow-y-auto pr-1 space-y-2.5 no-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-[var(--gh-text-muted)]">
            <AlertTriangle className="mx-auto h-7 w-7 text-[var(--gh-text-subtle)] mb-2" strokeWidth={1.5} />
            <p className="text-sm font-medium">Tidak ada peristiwa bencana sesuai filter</p>
            <p className="text-xs text-[var(--gh-text-subtle)] mt-1">Coba sesuaikan kata kunci pencarian atau rentang magnitudo</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] p-3.5 transition hover:border-[var(--gh-border-active)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Category / Magnitude Icon Badge */}
                  {item.category === 'earthquake' ? (
                    <div
                      className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg font-bold border ${
                        (item.magnitude || 0) >= 6.0
                          ? 'bg-red-500/15 text-red-500 border-red-500/30'
                          : (item.magnitude || 0) >= 5.0
                          ? 'bg-orange-500/15 text-orange-500 border-orange-500/30'
                          : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                      }`}
                    >
                      <span className="text-[9px] uppercase font-mono tracking-tighter">Mag</span>
                      <span className="text-sm font-black leading-none">{item.magnitude?.toFixed(1)}</span>
                    </div>
                  ) : (
                    <div
                      className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg text-white font-bold shadow-xs"
                      style={{ backgroundColor: item.statusColor || '#ea580c' }}
                    >
                      <Mountain className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-xs text-[var(--gh-text)] group-hover:text-[var(--gh-accent)] transition">
                        {item.title}
                      </h3>
                      {item.alertLevel && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium border"
                          style={{
                            backgroundColor: `${item.statusColor}18`,
                            color: item.statusColor,
                            borderColor: `${item.statusColor}40`,
                          }}
                        >
                          {item.alertLevel}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--gh-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                        {item.time}
                      </span>
                      {item.depth !== undefined && (
                        <span className="flex items-center gap-1">
                          <Gauge className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                          Kedalaman {item.depth} km
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                        {item.location}
                      </span>
                    </div>

                    {item.felt && (
                      <p className="mt-1.5 text-xs font-mono text-amber-500 bg-[var(--gh-bg)] px-2 py-0.5 rounded border border-[var(--gh-border)]">
                        Dirasakan: {item.felt}
                      </p>
                    )}
                  </div>
                </div>

                <span className="shrink-0 rounded-md bg-[var(--gh-bg)] border border-[var(--gh-border)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--gh-text-muted)]">
                  {item.source}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-[var(--gh-border)]">
                <button
                  onClick={() => onFocusMap(item.lat, item.lng, item.title)}
                  className="flex items-center gap-1 rounded-md bg-[var(--gh-bg)] border border-[var(--gh-border)] px-2.5 py-1 text-xs text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:border-[var(--gh-border-active)] transition"
                >
                  <Eye className="h-3 w-3 text-rose-500" strokeWidth={1.75} />
                  Fokus di Peta
                </button>
                <button
                  onClick={() => {
                    if (item.category === 'earthquake') {
                      const eq = item.raw as EarthquakeDetail;
                      onSelectDisaster({
                        id: eq.id,
                        type: 'earthquake',
                        title: eq.title,
                        latitude: eq.latitude,
                        longitude: eq.longitude,
                        magnitude: eq.magnitude,
                        depth: eq.depth,
                        depthUnit: 'km',
                        location: eq.location,
                        severity: eq.severity,
                        occurredAt: eq.occurredAt,
                        source: 'BMKG',
                        potential: eq.potential,
                        felt: eq.felt,
                        shakemapUrl: eq.shakemapUrl,
                        verified: true,
                      });
                    } else {
                      const v = item.raw as VolcanoDetail;
                      onSelectDisaster({
                        id: v.id,
                        type: 'volcano',
                        title: `${v.name} (${v.alertLevel})`,
                        latitude: v.latitude,
                        longitude: v.longitude,
                        location: `${v.name}, ${v.province}`,
                        province: v.province,
                        severity: v.alertLevel.includes('Siaga') ? 'high' : 'moderate',
                        occurredAt: new Date().toISOString(),
                        source: 'PVMBG / InaRISK',
                        potential: v.lastActivity,
                        verified: true,
                      });
                    }
                  }}
                  className="flex items-center gap-1 rounded-md bg-[#238636] hover:bg-[#2ea043] px-2.5 py-1 text-xs font-medium text-white border border-[#2ea043]/30 transition shadow-xs"
                >
                  Detail & Mitigasi
                  <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
