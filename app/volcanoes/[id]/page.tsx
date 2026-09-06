'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Flame,
  MapPin,
  Mountain,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Map as MapIcon,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Radio,
  FileText
} from 'lucide-react';
import { Volcano, VolcanicActivity } from '@/types/volcano';
import { fetchVolcanoDetail, fetchVolcanicActivities } from '@/lib/volcano-client';
import { VolcanoDetailSkeleton } from '@/components/LoadingSkeletons';

export default function VolcanoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [volcano, setVolcano] = useState<Volcano | null>(null);
  const [activities, setActivities] = useState<VolcanicActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const [vData, allActs] = await Promise.allSettled([
          fetchVolcanoDetail(id),
          fetchVolcanicActivities(),
        ]);

        if (vData.status === 'fulfilled' && vData.value) {
          setVolcano(vData.value);
        } else {
          setError(`Gunung api '${id}' tidak ditemukan atau data sementara tidak tersedia.`);
        }

        if (allActs.status === 'fulfilled') {
          // Filter activities matching this volcano
          const cleanId = id.toLowerCase().replace('volcano-', '');
          const matched = allActs.value.filter(
            (a) =>
              a.volcanoId.includes(cleanId) ||
              a.volcanoName.toLowerCase().includes(cleanId)
          );
          setActivities(matched);
        }
      } catch {
        setError('Data gunung api sementara tidak tersedia. Sumber: PVMBG / MAGMA Indonesia');
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('awas')) {
      return {
        label: 'Level IV (Awas)',
        badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        dotClass: 'bg-rose-500 animate-ping',
        meaning: 'Aktivitas sangat tinggi. Erupsi berpotensi mengancam permukiman di sekitar lereng. Evakuasi zona bahaya wajib dipatuhi.',
      };
    }
    if (s.includes('siaga')) {
      return {
        label: 'Level III (Siaga)',
        badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        dotClass: 'bg-amber-500 animate-pulse',
        meaning: 'Peningkatan kegiatan seismik dan vulkanik secara nyata. Dapat berlanjut ke erupsi. Masyarakat dilarang memasuki radius rekomendasi bahaya.',
      };
    }
    if (s.includes('waspada')) {
      return {
        label: 'Level II (Waspada)',
        badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        dotClass: 'bg-yellow-500',
        meaning: 'Aktivitas di atas tingkat normal. Teramati peningkatan visual/gempa vulkanik. Waspada di sekitar kawah aktif.',
      };
    }
    return {
      label: 'Level I (Normal)',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      dotClass: 'bg-emerald-500',
      meaning: 'Aktivitas dasar vulkanik tanpa gejala kenaikan. Aman bagi masyarakat di luar batas kawah aktif.',
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/volcanoes"
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Daftar</span>
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <span className="text-xs text-slate-400 hidden sm:inline">
              Detail Status Gunung Api
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Sumber: <span className="text-slate-200 font-medium">PVMBG / MAGMA Indonesia</span>
          </div>
        </div>
      </header>

      {/* Detail Content */}
      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-6 sm:px-6 space-y-6">
        {loading ? (
          <VolcanoDetailSkeleton />
        ) : error || !volcano ? (
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-8 text-center space-y-4">
            <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto" />
            <h2 className="text-base font-bold text-rose-200">
              {error || 'Data Gunung Api Tidak Ditemukan'}
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Data resmi PVMBG / MAGMA Indonesia untuk entri ini tidak ditemukan atau server pusat sedang memperbarui data.
            </p>
            <Link
              href="/volcanoes"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition"
            >
              Kembali ke Pemantauan Gunung Api
            </Link>
          </div>
        ) : (
          <>
            {/* Primary Profile Card */}
            {(() => {
              const badge = getStatusBadge(volcano.status);
              return (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.badgeClass}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${badge.dotClass}`} />
                          {badge.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          Status Terkini PVMBG
                        </span>
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {volcano.name}
                      </h1>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-rose-400" />
                          <span>{volcano.province}</span>
                        </div>
                        {volcano.elevation && (
                          <div className="flex items-center gap-1.5">
                            <Mountain className="h-4 w-4 text-emerald-400" />
                            <span>{volcano.elevation.toLocaleString('id-ID')} mdpl</span>
                          </div>
                        )}
                        {volcano.latitude && volcano.longitude && (
                          <div className="flex items-center gap-1.5 font-mono text-slate-400">
                            <span>
                              Lat: {volcano.latitude.toFixed(4)}°, Lng: {volcano.longitude.toFixed(4)}°
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed mt-2">
                        <span className="font-semibold text-slate-200">Arti Status: </span>
                        {badge.meaning}
                      </p>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                      {volcano.latitude && volcano.longitude && (
                        <Link
                          href={`/?tab=map&lat=${volcano.latitude}&lng=${volcano.longitude}&name=${encodeURIComponent(volcano.name)}`}
                          className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition"
                        >
                          <MapIcon className="h-4 w-4" />
                          Buka di Peta Interaktif
                        </Link>
                      )}
                      {volcano.reportUrl && (
                        <a
                          href={volcano.reportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2.5 text-xs font-medium border border-slate-700 transition"
                        >
                          <FileText className="h-4 w-4 text-rose-400" />
                          Laporan MAGMA Lengkap
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Official Recommendation & Safety Radius */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Rekomendasi Resmi PVMBG & Radius Aman
              </div>

              {volcano.recommendation ? (
                <div className="text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-4 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-line">
                  {volcano.recommendation}
                </div>
              ) : (
                <div className="text-xs text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <p>
                    Rekomendasi keamanan dikeluarkan secara berkala oleh pos pengamatan PVMBG. Masyarakat, pengunjung, maupun wisatawan diimbau untuk:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                    <li>Tidak melakukan aktivitas pada radius bahaya yang ditetapkan pos pengamatan setempat.</li>
                    <li>Mewaspadai bahaya lahar hujan di sepanjang aliran sungai yang berhulu di puncak.</li>
                    <li>Mengikuti arahan dari Badan Penanggulangan Bencana Daerah (BPBD) setempat.</li>
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Rekomendasi mengikat untuk keselamatan warga
                </span>
                <span>Otoritas: Badan Geologi ESDM</span>
              </div>
            </div>

            {/* Recent Eruptions for this Volcano */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                  <Radio className="h-5 w-5 text-rose-500 animate-pulse" />
                  Riwayat Aktivitas & Erupsi Terkini
                </div>
                <span className="text-xs text-slate-400">
                  {activities.length} Laporan Erupsi
                </span>
              </div>

              {activities.length === 0 ? (
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-8 text-center text-slate-400 text-xs">
                  <Flame className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                  Tidak ada catatan letusan terkini dalam kurun waktu 24-48 jam terakhir untuk gunung ini.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60">
                  {activities.map((act) => (
                    <div key={act.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                          <Flame className="h-3.5 w-3.5" />
                          {act.activity}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {act.occurredAt}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {act.description}
                      </p>

                      {act.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-slate-800 mt-2 max-w-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={act.imageUrl}
                            alt="Visual letusan"
                            className="w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Pencatat: {act.author || 'Petugas Pos PVMBG'}</span>
                        {act.sourceUrl && (
                          <a
                            href={act.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 font-medium"
                          >
                            Buka Arsip MAGMA <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attribution & Non-AI Disclaimer */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-300">
                  Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Badan Geologi, Kementerian Energi dan Sumber Daya Mineral Republik Indonesia.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://magma.esdm.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition"
                >
                  Portal Resmi MAGMA <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
