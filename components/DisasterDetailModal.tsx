'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Gauge, 
  AlertTriangle, 
  Share2, 
  Check, 
  ShieldAlert, 
  LifeBuoy, 
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Disaster } from '@/types/disaster';

interface DisasterDetailModalProps {
  disaster: Disaster | null;
  onClose: () => void;
  onViewOnMap: (lat: number, lng: number, title?: string) => void;
}

export const DisasterDetailModal: React.FC<DisasterDetailModalProps> = ({
  disaster,
  onClose,
  onViewOnMap,
}) => {
  const [copied, setCopied] = useState(false);

  if (!disaster) return null;

  // Format times in WIB (UTC+7), WITA (UTC+8), and WIT (UTC+9)
  const formatMultiTimezones = (dateStr?: string) => {
    if (!dateStr) return { wib: '-', wita: '-', wit: '-', utc: '-' };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { wib: dateStr, wita: '-', wit: '-', utc: '-' };
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    return {
      wib: d.toLocaleString('id-ID', { ...options, timeZone: 'Asia/Jakarta' }) + ' WIB',
      wita: d.toLocaleString('id-ID', { ...options, timeZone: 'Asia/Makassar' }) + ' WITA',
      wit: d.toLocaleString('id-ID', { ...options, timeZone: 'Asia/Jayapura' }) + ' WIT',
      utc: d.toISOString(),
    };
  };

  const times = formatMultiTimezones(disaster.occurredAt);

  const handleShare = async () => {
    const text = `Informasi Kebencanaan Resmi: ${disaster.title} di ${disaster.location || 'Indonesia'}. Sumber: ${disaster.source}. Cek selengkapnya di Indonesia Disaster Monitor.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: disaster.title,
          text,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div
        id="disaster-detail-modal-container"
        className="relative w-full max-w-3xl rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 sm:p-7 shadow-2xl text-[var(--gh-text)] my-8 overflow-hidden transition-colors duration-150"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-2.5 w-2.5 rounded-full ${
                disaster.severity === 'critical'
                  ? 'bg-red-500'
                  : disaster.severity === 'high'
                  ? 'bg-orange-500'
                  : 'bg-yellow-400'
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gh-text-muted)]">
              Detail Resmi Bencana ({disaster.source})
            </span>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500 border border-emerald-500/20">
              Terverifikasi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-md bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] px-3 py-1.5 text-xs text-[var(--gh-text)] hover:bg-[var(--gh-btn-hover)] transition"
              title="Bagikan Informasi Bencana"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.75} /> : <Share2 className="h-3.5 w-3.5 text-[var(--gh-text-muted)]" strokeWidth={1.75} />}
              <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-[var(--gh-text-muted)] hover:bg-[var(--gh-surface-raised)] hover:text-[var(--gh-text)] transition"
              title="Tutup"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Title & Status */}
        <div className="mt-4">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] leading-tight">
            {disaster.title}
          </h2>
          <p className="mt-1 text-xs text-[var(--gh-text-muted)] flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />
            {disaster.location || 'Wilayah Indonesia'}
          </p>
        </div>

        {/* Technical Data Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {disaster.magnitude !== undefined && (
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
                Magnitudo
              </span>
              <p className="mt-1 text-2xl font-bold text-[var(--gh-text)]">
                M {disaster.magnitude.toFixed(1)}
              </p>
            </div>
          )}

          {disaster.depth !== undefined && (
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
                Kedalaman
              </span>
              <p className="mt-1 text-2xl font-bold text-[var(--gh-text)]">
                {disaster.depth} <span className="text-xs font-normal text-[var(--gh-text-muted)]">km</span>
              </p>
            </div>
          )}

          <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
              Potensi Tsunami
            </span>
            <p className="mt-1 text-xs font-semibold text-[var(--gh-text)] leading-tight">
              {disaster.tsunamiPotential ? (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} /> Berpotensi
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> Tidak Berpotensi
                </span>
              )}
            </p>
          </div>

          <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)]">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gh-text-muted)]">
              Tingkat Keparahan
            </span>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-rose-500">
              {disaster.severity || 'Moderat'}
            </p>
          </div>
        </div>

        {/* Detailed Timezones & Coordinates */}
        <div className="mt-4 rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)] text-xs space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-[var(--gh-text-muted)] block font-medium">Waktu Indonesia Barat (WIB):</span>
              <span className="text-[var(--gh-text)] font-mono">{times.wib}</span>
            </div>
            <div>
              <span className="text-[var(--gh-text-muted)] block font-medium">Waktu Indonesia Tengah (WITA):</span>
              <span className="text-[var(--gh-text)] font-mono">{times.wita}</span>
            </div>
            <div>
              <span className="text-[var(--gh-text-muted)] block font-medium">Waktu Indonesia Timur (WIT):</span>
              <span className="text-[var(--gh-text)] font-mono">{times.wit}</span>
            </div>
          </div>

          {disaster.latitude !== undefined && disaster.longitude !== undefined && (
            <div className="pt-2 border-t border-[var(--gh-border)] flex flex-wrap items-center justify-between gap-2">
              <span className="text-[var(--gh-text-muted)]">
                Koordinat Episentrum: <strong className="text-[var(--gh-text)] font-mono">{disaster.latitude.toFixed(4)}, {disaster.longitude.toFixed(4)}</strong>
              </span>
              <button
                onClick={() => {
                  onClose();
                  onViewOnMap(disaster.latitude!, disaster.longitude!, disaster.title);
                }}
                className="flex items-center gap-1 rounded-md bg-[var(--gh-bg)] border border-[var(--gh-border)] px-2.5 py-1 text-xs font-medium text-[var(--gh-text)] hover:border-[var(--gh-border-active)] transition"
              >
                <Compass className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />
                Arahkan Peta ke Titik Ini
              </button>
            </div>
          )}
        </div>

        {/* Shakemap Image & MMI Felt Scale */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {disaster.shakemapUrl && (
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] text-center">
              <span className="text-xs font-medium text-[var(--gh-text-muted)] block mb-2">
                Peta Guncangan / Shakemap (BMKG)
              </span>
              <img
                src={disaster.shakemapUrl}
                alt="Shakemap BMKG"
                className="w-full max-h-56 object-contain rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg)]"
                loading="lazy"
              />
            </div>
          )}

          {disaster.felt && (
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-amber-500 block mb-1">
                  Wilayah yang Merasakan (Skala MMI):
                </span>
                <p className="text-xs text-[var(--gh-text)] font-mono leading-relaxed whitespace-pre-line">
                  {disaster.felt}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--gh-border)] text-[11px] text-[var(--gh-text-subtle)]">
                Skala MMI mengukur intensitas getaran yang dirasakan masyarakat di permukaan tanah menurut BMKG.
              </div>
            </div>
          )}
        </div>

        {/* BNPB Official Mitigation SOP Guidelines */}
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs">
          <div className="flex items-center gap-2 text-amber-500 font-semibold mb-2">
            <LifeBuoy className="h-4 w-4" strokeWidth={1.75} />
            Panduan Mitigasi &amp; Keselamatan BNPB:
          </div>
          <ul className="list-disc pl-4 space-y-1.5 text-[var(--gh-text)]">
            {disaster.type === 'earthquake' ? (
              <>
                <li><strong>Saat Goncangan:</strong> Lindungi kepala dan leher (Drop, Cover, Hold On). Menunduk dan berlindung di bawah meja yang kokoh.</li>
                <li><strong>Waspadai Gempa Susulan:</strong> Jauhi gedung bertingkat, dinding retak, tiang listrik, dan lereng tebing rawan longsor.</li>
                <li><strong>Jika Berada di Pesisir:</strong> Segera evakuasi mandiri ke tempat tinggi jika goncangan gempa terasa kuat lebih dari 20 detik tanpa menunggu sirine resmi.</li>
                <li><strong>Informasi Valid:</strong> Hanya percayai kanal resmi BMKG dan BNPB/BPBD setempat. Hindari menyebarkan isu/hoaks yang tidak terverifikasi.</li>
              </>
            ) : (
              <>
                <li>Gunakan masker pelindung debu partikulat pernapasan (minimal N95/masker bedah ganda) terhadap abu vulkanik.</li>
                <li>Jauhi radius Kawasan Rawan Bencana (KRB) yang telah ditetapkan PVMBG/Badan Geologi.</li>
                <li>Waspadai potensi bahaya lahar dingin di sepanjang daerah aliran sungai (DAS) yang berhulu di puncak gunung api terutama saat hujan.</li>
              </>
            )}
          </ul>
        </div>

        {/* Footer info & links */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--gh-border)] text-xs text-[var(--gh-text-muted)]">
          <span>Data diverifikasi oleh: <strong>{disaster.source}</strong></span>
          <a
            href="https://www.bmkg.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[var(--gh-accent)] hover:underline"
          >
            Portal BMKG Resmi <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </div>
  );
};
