'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Flame,
  AlertTriangle,
  ShieldCheck,
  Radio,
  RefreshCw,
  Search,
  MapPin,
  ExternalLink,
  Clock,
  Layers,
  ChevronRight,
  Info,
  Map as MapIcon
} from 'lucide-react';
import { Volcano, VolcanicActivity, VolcanoStatusSummary } from '@/types/volcano';
import { fetchVolcanoes, fetchVolcanoStatus, fetchVolcanicActivities } from '@/lib/volcano-client';
import { VolcanoMonitorSkeleton } from '@/components/LoadingSkeletons';

interface VolcanoMonitorViewProps {
  onFocusMap?: (lat: number, lng: number, title?: string) => void;
}

export const VolcanoMonitorView: React.FC<VolcanoMonitorViewProps> = ({ onFocusMap }) => {
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);
  const [summary, setSummary] = useState<VolcanoStatusSummary | null>(null);
  const [activities, setActivities] = useState<VolcanicActivity[]>([]);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const [volcanoRes, statusRes, actRes] = await Promise.allSettled([
        fetchVolcanoes(),
        fetchVolcanoStatus(),
        fetchVolcanicActivities(),
      ]);

      let hasSuccess = false;

      if (volcanoRes.status === 'fulfilled') {
        setVolcanoes(volcanoRes.value.volcanoes);
        hasSuccess = true;
      }
      if (statusRes.status === 'fulfilled') {
        setSummary(statusRes.value);
        hasSuccess = true;
      }
      if (actRes.status === 'fulfilled') {
        setActivities(actRes.value);
        hasSuccess = true;
      }

      if (!hasSuccess) {
        setErrorMessage('Data gunung api sementara tidak tersedia. Sumber: PVMBG / MAGMA Indonesia');
      } else {
        setLastUpdated(new Date());
      }
    } catch {
      setErrorMessage('Data gunung api sementara tidak tersedia. Sumber: PVMBG / MAGMA Indonesia');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initialFetch() {
      try {
        const [volcanoRes, statusRes, actRes] = await Promise.allSettled([
          fetchVolcanoes(),
          fetchVolcanoStatus(),
          fetchVolcanicActivities(),
        ]);

        if (!active) return;
        let hasSuccess = false;

        if (volcanoRes.status === 'fulfilled') {
          setVolcanoes(volcanoRes.value.volcanoes);
          hasSuccess = true;
        }
        if (statusRes.status === 'fulfilled') {
          setSummary(statusRes.value);
          hasSuccess = true;
        }
        if (actRes.status === 'fulfilled') {
          setActivities(actRes.value);
          hasSuccess = true;
        }

        if (!hasSuccess) {
          setErrorMessage('Data gunung api sementara tidak tersedia. Sumber: PVMBG / MAGMA Indonesia');
        } else {
          setLastUpdated(new Date());
        }
      } catch {
        if (active) {
          setErrorMessage('Data gunung api sementara tidak tersedia. Sumber: PVMBG / MAGMA Indonesia');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initialFetch();

    return () => {
      active = false;
    };
  }, []);

  // Client-side filtering
  const filteredVolcanoes = volcanoes.filter((v) => {
    const matchesFilter =
      statusFilter === 'all' ||
      (statusFilter === 'awas' && v.status.toLowerCase().includes('awas')) ||
      (statusFilter === 'siaga' && v.status.toLowerCase().includes('siaga')) ||
      (statusFilter === 'waspada' && v.status.toLowerCase().includes('waspada')) ||
      (statusFilter === 'normal' && v.status.toLowerCase().includes('normal'));

    const matchesSearch =
      !searchQuery.trim() ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.province.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('awas')) {
      return {
        label: 'Level IV (Awas)',
        badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20',
        dotClass: 'bg-red-500 animate-ping',
      };
    }
    if (s.includes('siaga')) {
      return {
        label: 'Level III (Siaga)',
        badgeClass: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        dotClass: 'bg-orange-500 animate-pulse',
      };
    }
    if (s.includes('waspada')) {
      return {
        label: 'Level II (Waspada)',
        badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        dotClass: 'bg-yellow-500',
      };
    }
    return {
      label: 'Level I (Normal)',
      badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      dotClass: 'bg-emerald-500',
    };
  };

  if (loading) {
    return <VolcanoMonitorSkeleton />;
  }

  return (
    <div className="space-y-6 transition-colors duration-150">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--gh-surface)] p-4 rounded-xl border border-[var(--gh-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0">
            <Flame className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold text-[var(--gh-text)] tracking-tight">
                Volcano Monitor Indonesia
              </h1>
              <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-500 border border-orange-500/20">
                PVMBG / MAGMA
              </span>
            </div>
            <p className="text-xs text-[var(--gh-text-muted)]">
              Pemantauan aktivitas vulkanik, status peringatan (Level I-IV), dan erupsi terkini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-md bg-[var(--gh-surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--gh-text)] hover:bg-[var(--gh-btn-hover)] border border-[var(--gh-border)] hover:border-[var(--gh-border-active)] transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[var(--gh-text-muted)] ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={1.75} />
            <span>Perbarui Data</span>
          </button>
          {lastUpdated && (
            <span className="hidden md:inline text-[10px] text-[var(--gh-text-subtle)] font-mono">
              {lastUpdated.toLocaleTimeString('id-ID')} WIB
            </span>
          )}
        </div>
      </div>

      {/* Error / Alert Banner if unavailable */}
      {errorMessage && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-[var(--gh-text)] flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold text-amber-500">{errorMessage}</p>
            <p className="text-[var(--gh-text-muted)] text-xs mt-1">
              Data sementara tidak dapat diambil dari MAGMA ESDM. Sistem tidak menampilkan prediksi buatan.
            </p>
          </div>
        </div>
      )}

      {/* Top KPI Statistics Cards */}
      <section aria-label="Statistik Status Gunung Api">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total */}
          <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface)] p-3.5 transition">
            <div className="flex items-center justify-between text-[var(--gh-text-muted)] text-xs mb-1">
              <span>Total Dipantau</span>
              <Layers className="h-3.5 w-3.5 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[var(--gh-text)]">
              {loading ? '...' : summary?.totalVolcanoes ?? volcanoes.length}
            </div>
            <p className="text-[10px] text-[var(--gh-text-muted)] mt-1">Gunung Api Aktif</p>
          </div>

          {/* Level IV - Awas */}
          <button
            onClick={() => setStatusFilter('awas')}
            className={`text-left rounded-lg border p-3.5 transition cursor-pointer ${
              statusFilter === 'awas'
                ? 'border-red-500 bg-red-500/10 ring-1 ring-red-500'
                : 'border-[var(--gh-border)] bg-[var(--gh-surface)] hover:border-[var(--gh-border-active)]'
            }`}
          >
            <div className="flex items-center justify-between text-red-500 text-xs mb-1">
              <span className="font-semibold">Level IV (Awas)</span>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {loading ? '...' : summary?.awas ?? volcanoes.filter((v) => v.status.toLowerCase().includes('awas')).length}
            </div>
            <p className="text-[10px] text-red-500/80 mt-1">Bahaya Kritis</p>
          </button>

          {/* Level III - Siaga */}
          <button
            onClick={() => setStatusFilter('siaga')}
            className={`text-left rounded-lg border p-3.5 transition cursor-pointer ${
              statusFilter === 'siaga'
                ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500'
                : 'border-[var(--gh-border)] bg-[var(--gh-surface)] hover:border-[var(--gh-border-active)]'
            }`}
          >
            <div className="flex items-center justify-between text-orange-500 text-xs mb-1">
              <span className="font-semibold">Level III (Siaga)</span>
              <span className="h-2 w-2 rounded-full bg-orange-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-orange-500">
              {loading ? '...' : summary?.siaga ?? volcanoes.filter((v) => v.status.toLowerCase().includes('siaga')).length}
            </div>
            <p className="text-[10px] text-orange-500/80 mt-1">Peningkatan Nyata</p>
          </button>

          {/* Level II - Waspada */}
          <button
            onClick={() => setStatusFilter('waspada')}
            className={`text-left rounded-lg border p-3.5 transition cursor-pointer ${
              statusFilter === 'waspada'
                ? 'border-yellow-500 bg-yellow-500/10 ring-1 ring-yellow-500'
                : 'border-[var(--gh-border)] bg-[var(--gh-surface)] hover:border-[var(--gh-border-active)]'
            }`}
          >
            <div className="flex items-center justify-between text-yellow-500 text-xs mb-1">
              <span className="font-semibold">Level II (Waspada)</span>
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-500">
              {loading ? '...' : summary?.waspada ?? volcanoes.filter((v) => v.status.toLowerCase().includes('waspada')).length}
            </div>
            <p className="text-[10px] text-yellow-500/80 mt-1">Di Atas Normal</p>
          </button>

          {/* Level I - Normal */}
          <button
            onClick={() => setStatusFilter('normal')}
            className={`text-left rounded-lg border p-3.5 transition cursor-pointer ${
              statusFilter === 'normal'
                ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                : 'border-[var(--gh-border)] bg-[var(--gh-surface)] hover:border-[var(--gh-border-active)]'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-500 text-xs mb-1">
              <span className="font-semibold">Level I (Normal)</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.75} />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-500">
              {loading ? '...' : summary?.normal ?? volcanoes.filter((v) => v.status.toLowerCase().includes('normal')).length}
            </div>
            <p className="text-[10px] text-emerald-500/80 mt-1">Aktivitas Dasar</p>
          </button>

          {/* Erupsi Terkini */}
          <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface)] p-3.5 transition">
            <div className="flex items-center justify-between text-[var(--gh-text-muted)] text-xs mb-1">
              <span>Erupsi Terkini</span>
              <Radio className="h-3.5 w-3.5 text-red-500 animate-pulse" strokeWidth={1.75} />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[var(--gh-text)]">
              {loading ? '...' : activities.length}
            </div>
            <p className="text-[10px] text-[var(--gh-text-muted)] mt-1">Laporan 24 Jam</p>
          </div>
        </div>
      </section>

      {/* Filter Controls & Search */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--gh-surface)] p-3 rounded-lg border border-[var(--gh-border)]">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition border ${
              statusFilter === 'all'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] border-[var(--gh-border)] font-semibold'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]'
            }`}
          >
            Semua ({volcanoes.length})
          </button>
          <button
            onClick={() => setStatusFilter('awas')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition border ${
              statusFilter === 'awas'
                ? 'bg-red-500/15 text-red-500 border-red-500/30 font-semibold'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-red-500 hover:bg-red-500/10'
            }`}
          >
            Awas
          </button>
          <button
            onClick={() => setStatusFilter('siaga')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition border ${
              statusFilter === 'siaga'
                ? 'bg-orange-500/15 text-orange-500 border-orange-500/30 font-semibold'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-orange-500 hover:bg-orange-500/10'
            }`}
          >
            Siaga
          </button>
          <button
            onClick={() => setStatusFilter('waspada')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition border ${
              statusFilter === 'waspada'
                ? 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30 font-semibold'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-yellow-500 hover:bg-yellow-500/10'
            }`}
          >
            Waspada
          </button>
          <button
            onClick={() => setStatusFilter('normal')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition border ${
              statusFilter === 'normal'
                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-semibold'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-emerald-500 hover:bg-emerald-500/10'
            }`}
          >
            Normal
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari gunung / provinsi..."
            className="w-full rounded-md bg-[var(--gh-surface-raised)] pl-9 pr-3 py-1.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-subtle)] border border-[var(--gh-border)] focus:border-[var(--gh-border-active)] focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Main Grid: Volcanoes & Live Eruptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Volcano Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[var(--gh-text)] uppercase tracking-wider flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" strokeWidth={1.75} />
              Daftar Gunung Api ({filteredVolcanoes.length})
            </h2>
            <span className="text-xs text-[var(--gh-text-muted)]">
              PVMBG / MAGMA Indonesia
            </span>
          </div>

          {loading ? (
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-12 text-center text-[var(--gh-text-muted)]">
              <RefreshCw className="h-6 w-6 text-orange-500 animate-spin mx-auto mb-3" strokeWidth={1.75} />
              <p className="text-xs">Memuat data gunung api dari MAGMA Indonesia...</p>
            </div>
          ) : filteredVolcanoes.length === 0 ? (
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-12 text-center text-[var(--gh-text-muted)]">
              <Info className="h-6 w-6 text-[var(--gh-text-subtle)] mx-auto mb-3" strokeWidth={1.75} />
              <p className="text-xs font-medium text-[var(--gh-text)]">
                Tidak ada gunung api yang cocok dengan kriteria pencarian.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredVolcanoes.map((volcano) => {
                const badge = getStatusBadge(volcano.status);
                return (
                  <div
                    key={volcano.id}
                    className="group rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 hover:border-[var(--gh-border-active)] hover:bg-[var(--gh-surface-raised)] transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-[var(--gh-text)] group-hover:text-[var(--gh-accent)] transition leading-snug">
                          {volcano.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.badgeClass} shrink-0`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dotClass}`} />
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[var(--gh-text-muted)] mb-2">
                        <MapPin className="h-3.5 w-3.5 text-[var(--gh-text-subtle)] shrink-0" strokeWidth={1.75} />
                        <span className="truncate">{volcano.province}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[var(--gh-text-subtle)] mb-4 font-mono">
                        {volcano.elevation && (
                          <span>{volcano.elevation.toLocaleString('id-ID')} mdpl</span>
                        )}
                        {volcano.latitude && volcano.longitude && (
                          <span>
                            {volcano.latitude.toFixed(2)}°, {volcano.longitude.toFixed(2)}°
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--gh-border)] flex items-center justify-between gap-2">
                      <Link
                        href={`/volcanoes/${volcano.id}`}
                        className="flex items-center gap-1 text-xs font-medium text-[var(--gh-accent)] hover:underline transition"
                      >
                        Lihat Detail <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </Link>

                      <div className="flex items-center gap-2">
                        {volcano.latitude && volcano.longitude && onFocusMap && (
                          <button
                            onClick={() => onFocusMap(volcano.latitude!, volcano.longitude!, volcano.name)}
                            className="p-1.5 rounded-md text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-btn-hover)] transition"
                            title="Tampilkan di Peta Interaktif"
                          >
                            <MapIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </button>
                        )}
                        {volcano.reportUrl && (
                          <a
                            href={volcano.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-btn-hover)] transition"
                            title="Buka Laporan Resmi MAGMA ESDM"
                          >
                            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Live Eruption Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[var(--gh-text)] uppercase tracking-wider flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" strokeWidth={1.75} />
              Aktivitas Erupsi Terkini
            </h2>
            <span className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-500 border border-red-500/20">
              LIVE FEED
            </span>
          </div>

          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] divide-y divide-[var(--gh-border)] max-h-[750px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-xs text-[var(--gh-text-muted)]">
                <RefreshCw className="h-5 w-5 text-orange-500 animate-spin mx-auto mb-2" strokeWidth={1.75} />
                Memuat aktivitas letusan terbaru...
              </div>
            ) : activities.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--gh-text-muted)]">
                Tidak ada laporan erupsi baru dalam beberapa jam terakhir.
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="p-3.5 hover:bg-[var(--gh-surface-raised)] transition space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-[var(--gh-text)] flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-orange-500" strokeWidth={1.75} />
                      {act.volcanoName}
                    </span>
                    <span className="text-[10px] text-[var(--gh-text-muted)] font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                      {act.occurredAt}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--gh-text-muted)] leading-relaxed line-clamp-4">
                    {act.description}
                  </p>

                  {act.imageUrl && (
                    <div className="rounded-md overflow-hidden border border-[var(--gh-border)] mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={act.imageUrl}
                        alt={`Foto letusan ${act.volcanoName}`}
                        className="w-full h-32 object-cover hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-[var(--gh-text-subtle)] pt-1">
                    <span>{act.author ? `Observer: ${act.author}` : 'PVMBG'}</span>
                    {act.sourceUrl && (
                      <a
                        href={act.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--gh-accent)] hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        Detail Laporan <ExternalLink className="h-2.5 w-2.5" strokeWidth={1.75} />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 space-y-2 text-xs text-[var(--gh-text-muted)]">
            <div className="flex items-center gap-2 text-[var(--gh-text)] font-semibold text-xs">
              <Info className="h-4 w-4 text-[var(--gh-accent)]" strokeWidth={1.75} />
              Sumber Data Resmi PVMBG
            </div>
            <p className="text-[11px] leading-relaxed">
              Data pemantauan gunung api resmi dari Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG) / MAGMA Indonesia tanpa analisis atau prediksi AI.
            </p>
            <div className="pt-2 border-t border-[var(--gh-border)] flex items-center justify-between text-[11px]">
              <a
                href="https://magma.esdm.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--gh-accent)] hover:underline inline-flex items-center gap-1 font-medium"
              >
                Portal MAGMA ESDM <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
              </a>
              <span className="text-[var(--gh-text-subtle)]">Non-AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
