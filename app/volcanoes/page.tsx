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
  ArrowLeft, 
  Clock, 
  Layers, 
  ChevronRight,
  Info,
  Map as MapIcon
} from 'lucide-react';
import { Volcano, VolcanicActivity, VolcanoStatusSummary } from '@/types/volcano';
import { fetchVolcanoes, fetchVolcanoStatus, fetchVolcanicActivities } from '@/lib/volcano-client';
import { VolcanoMonitorSkeleton } from '@/components/LoadingSkeletons';

export default function VolcanoMonitorPage() {
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
        badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        dotClass: 'bg-rose-500 animate-ping',
      };
    }
    if (s.includes('siaga')) {
      return {
        label: 'Level III (Siaga)',
        badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        dotClass: 'bg-amber-500 animate-pulse',
      };
    }
    if (s.includes('waspada')) {
      return {
        label: 'Level II (Waspada)',
        badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        dotClass: 'bg-yellow-500',
      };
    }
    return {
      label: 'Level I (Normal)',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      dotClass: 'bg-emerald-500',
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard Utama</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600/20 border border-rose-500/30">
                <Flame className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold tracking-tight text-white sm:text-base">
                    Volcano Monitor Indonesia
                  </h1>
                  <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/30">
                    PVMBG / MAGMA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Monitoring Aktivitas Erupsi & Tingkat Aktivitas Gunung Api Resmi
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-rose-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
            <div className="hidden md:flex flex-col text-right pl-2 border-l border-slate-800 text-[10px] text-slate-400">
              <span>Sumber: PVMBG</span>
              <span className="font-mono text-slate-300">
                {lastUpdated ? lastUpdated.toLocaleTimeString('id-ID') + ' WIB' : '--:--'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 space-y-6">
        {loading ? (
          <VolcanoMonitorSkeleton />
        ) : (
          <>
            {/* Error / Alert Banner if unavailable */}
            {errorMessage && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-amber-200 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="text-amber-300/80 text-xs mt-1">
                    Layanan PVMBG/MAGMA Indonesia sedang mengalami penyesuaian jaringan atau pemeliharaan. Silakan coba beberapa saat lagi.
                  </p>
                </div>
              </div>
            )}

            {/* Top KPI Statistics Cards (Derived from real API) */}
        <section aria-label="Statistik Status Gunung Api">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Dipantau</span>
                <Layers className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : summary?.totalVolcanoes ?? volcanoes.length}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Gunung Api Aktif</p>
            </div>

            {/* Level IV - Awas */}
            <button
              onClick={() => setStatusFilter('awas')}
              className={`text-left rounded-xl border p-3.5 transition cursor-pointer ${
                statusFilter === 'awas'
                  ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500'
                  : 'border-rose-900/40 bg-slate-900/60 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-rose-400 text-xs mb-1">
                <span className="font-semibold">Level IV (Awas)</span>
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <div className="text-2xl font-bold text-rose-400">
                {loading ? '...' : summary?.awas ?? volcanoes.filter((v) => v.status.toLowerCase().includes('awas')).length}
              </div>
              <p className="text-[10px] text-rose-300/70 mt-1">Bahaya Kritis / Erupsi</p>
            </button>

            {/* Level III - Siaga */}
            <button
              onClick={() => setStatusFilter('siaga')}
              className={`text-left rounded-xl border p-3.5 transition cursor-pointer ${
                statusFilter === 'siaga'
                  ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500'
                  : 'border-amber-900/40 bg-slate-900/60 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-amber-400 text-xs mb-1">
                <span className="font-semibold">Level III (Siaga)</span>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {loading ? '...' : summary?.siaga ?? volcanoes.filter((v) => v.status.toLowerCase().includes('siaga')).length}
              </div>
              <p className="text-[10px] text-amber-300/70 mt-1">Peningkatan Nyata</p>
            </button>

            {/* Level II - Waspada */}
            <button
              onClick={() => setStatusFilter('waspada')}
              className={`text-left rounded-xl border p-3.5 transition cursor-pointer ${
                statusFilter === 'waspada'
                  ? 'border-yellow-500 bg-yellow-950/30 ring-1 ring-yellow-500'
                  : 'border-yellow-900/40 bg-slate-900/60 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-yellow-400 text-xs mb-1">
                <span className="font-semibold">Level II (Waspada)</span>
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {loading ? '...' : summary?.waspada ?? volcanoes.filter((v) => v.status.toLowerCase().includes('waspada')).length}
              </div>
              <p className="text-[10px] text-yellow-300/70 mt-1">Aktivitas Di Atas Normal</p>
            </button>

            {/* Level I - Normal */}
            <button
              onClick={() => setStatusFilter('normal')}
              className={`text-left rounded-xl border p-3.5 transition cursor-pointer ${
                statusFilter === 'normal'
                  ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                  : 'border-emerald-900/40 bg-slate-900/60 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
                <span className="font-semibold">Level I (Normal)</span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                {loading ? '...' : summary?.normal ?? volcanoes.filter((v) => v.status.toLowerCase().includes('normal')).length}
              </div>
              <p className="text-[10px] text-emerald-300/70 mt-1">Aktivitas Dasar</p>
            </button>

            {/* Erupsi Terkini */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Erupsi Terkini</span>
                <Radio className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
              </div>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : activities.length}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Laporan 24 Jam</p>
            </div>
          </div>
        </section>

        {/* Filter Controls & Search */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Semua ({volcanoes.length})
            </button>
            <button
              onClick={() => setStatusFilter('awas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === 'awas'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-300/80 hover:bg-rose-950/40 hover:text-rose-200'
              }`}
            >
              Awas
            </button>
            <button
              onClick={() => setStatusFilter('siaga')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === 'siaga'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-300/80 hover:bg-amber-950/40 hover:text-amber-200'
              }`}
            >
              Siaga
            </button>
            <button
              onClick={() => setStatusFilter('waspada')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === 'waspada'
                  ? 'bg-yellow-600 text-white shadow-sm'
                  : 'text-yellow-300/80 hover:bg-yellow-950/40 hover:text-yellow-200'
              }`}
            >
              Waspada
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === 'normal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300/80 hover:bg-emerald-950/40 hover:text-emerald-200'
              }`}
            >
              Normal
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gunung / provinsi..."
              className="w-full rounded-lg bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-rose-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* 2-Column Responsive Layout: Volcano List & Recent Eruptions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main: Volcano Cards Grid (2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-500" />
                Daftar Gunung Api ({filteredVolcanoes.length})
              </h2>
              <span className="text-xs text-slate-400">
                Pusat Vulkanologi dan Mitigasi Bencana Geologi
              </span>
            </div>

            {loading ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
                <RefreshCw className="h-8 w-8 text-rose-500 animate-spin mx-auto mb-3" />
                <p className="text-sm">Memuat data gunung api dari MAGMA Indonesia...</p>
              </div>
            ) : filteredVolcanoes.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
                <Info className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-300">
                  Tidak ada gunung api yang cocok dengan kriteria pencarian.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Coba ubah kata kunci atau ganti filter status di atas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredVolcanoes.map((volcano) => {
                  const badge = getStatusBadge(volcano.status);
                  return (
                    <div
                      key={volcano.id}
                      className="group rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 hover:border-slate-700 hover:bg-slate-900/90 transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Name & Status Badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition leading-snug">
                            {volcano.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.badgeClass} shrink-0`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${badge.dotClass}`} />
                            {badge.label}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{volcano.province}</span>
                        </div>

                        {/* Elevation & Coords */}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-4">
                          {volcano.elevation && (
                            <span>{volcano.elevation.toLocaleString('id-ID')} mdpl</span>
                          )}
                          {volcano.latitude && volcano.longitude && (
                            <span className="font-mono">
                              {volcano.latitude.toFixed(2)}°, {volcano.longitude.toFixed(2)}°
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                        <Link
                          href={`/volcanoes/${volcano.id}`}
                          className="flex items-center gap-1 text-xs font-medium text-rose-400 hover:text-rose-300 transition"
                        >
                          Lihat Detail <ChevronRight className="h-3.5 w-3.5" />
                        </Link>

                        <div className="flex items-center gap-2">
                          {volcano.latitude && volcano.longitude && (
                            <Link
                              href={`/?tab=map&lat=${volcano.latitude}&lng=${volcano.longitude}&name=${encodeURIComponent(volcano.name)}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="Tampilkan di Peta Interaktif"
                            >
                              <MapIcon className="h-3.5 w-3.5" />
                            </Link>
                          )}
                          {volcano.reportUrl && (
                            <a
                              href={volcano.reportUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="Buka Laporan Resmi MAGMA ESDM"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
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

          {/* Sidebar: Recent Eruption & Activity Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Radio className="h-4 w-4 text-rose-500 animate-pulse" />
                Aktivitas Erupsi Terkini
              </h2>
              <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/30">
                LIVE FEED
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800/60 max-h-[800px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <RefreshCw className="h-6 w-6 text-rose-500 animate-spin mx-auto mb-2" />
                  Memuat aktivitas letusan terbaru...
                </div>
              ) : activities.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  Tidak ada laporan erupsi baru dalam beberapa jam terakhir.
                </div>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="p-3.5 hover:bg-slate-900/90 transition space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-rose-400" />
                        {act.volcanoName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        {act.occurredAt}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                      {act.description}
                    </p>

                    {act.imageUrl && (
                      <div className="rounded-lg overflow-hidden border border-slate-800 mt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={act.imageUrl}
                          alt={`Foto letusan ${act.volcanoName}`}
                          className="w-full h-36 object-cover hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      {act.author ? (
                        <span>Observer: {act.author}</span>
                      ) : (
                        <span>PVMBG / MAGMA</span>
                      )}
                      {act.sourceUrl && (
                        <a
                          href={act.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 font-medium"
                        >
                          Detail Laporan <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Official Source Attribution Box */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                <Info className="h-4 w-4 text-rose-400" />
                Sumber Data Resmi PVMBG
              </div>
              <p className="text-[11px] leading-relaxed">
                Data tingkat aktivitas dan laporan letusan diambil langsung dari Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG) / MAGMA Indonesia, Badan Geologi, Kementerian ESDM.
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <a
                  href="https://magma.esdm.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 font-medium"
                >
                  Portal MAGMA Indonesia <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-slate-500">Non-AI Platform</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </main>
</div>
  );
}
