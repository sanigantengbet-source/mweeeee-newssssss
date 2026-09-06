'use client';

import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink, Database, Server } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[var(--gh-border)] bg-[var(--gh-surface)] px-4 py-10 text-xs text-[var(--gh-text-muted)] transition-colors duration-150">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Disclaimer: Non-AI & Official Integrity */}
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--gh-text)] text-xs sm:text-sm">
                  Komitmen Integritas Data Faktual • Tanpa Analisis AI / Prediksi Mesin
                </h4>
                <p className="mt-0.5 text-xs text-[var(--gh-text-muted)]">
                  Seluruh data seismik dan ancaman bahaya kebencanaan disinkronisasi langsung dari server resmi BMKG dan BNPB/InaRISK tanpa interpolasi buatan, model bahasa, atau estimasi berbasis AI.
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-md bg-[var(--gh-bg)] border border-[var(--gh-border)] px-2.5 py-1 font-mono text-[10px] text-[var(--gh-text-muted)]">
              NON-AI VERIFIED
            </span>
          </div>
        </div>

        {/* Multi-column Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Sumber Data */}
          <div>
            <span className="font-semibold uppercase tracking-wider text-[var(--gh-text)] text-xs mb-3 flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />
              Sumber Data Resmi
            </span>
            <ul className="space-y-2 text-[var(--gh-text-muted)] text-xs">
              <li>
                <a
                  href="https://data.bmkg.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[var(--gh-text)] transition"
                >
                  <span>BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</span>
                  <ExternalLink className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                </a>
              </li>
              <li>
                <a
                  href="https://inarisk.bnpb.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[var(--gh-text)] transition"
                >
                  <span>InaRISK BNPB (Kajian Risiko Bencana Indonesia)</span>
                  <ExternalLink className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                </a>
              </li>
              <li>
                <a
                  href="https://magma.vsi.esdm.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[var(--gh-text)] transition"
                >
                  <span>PVMBG Badan Geologi Kementerian ESDM</span>
                  <ExternalLink className="h-3 w-3 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Kontak Darurat Kebencanaan */}
          <div>
            <span className="font-semibold uppercase tracking-wider text-[var(--gh-text)] text-xs mb-3 flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />
              Kontak Darurat Nasional (Bebas Pulsa)
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-2 border border-[var(--gh-border)]">
                <span className="text-[var(--gh-text-subtle)] block text-[10px]">Call Center BNPB</span>
                <strong className="text-[var(--gh-text)] text-sm">117</strong>
              </div>
              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-2 border border-[var(--gh-border)]">
                <span className="text-[var(--gh-text-subtle)] block text-[10px]">Panggilan Darurat BPBD</span>
                <strong className="text-[var(--gh-text)] text-sm">112</strong>
              </div>
              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-2 border border-[var(--gh-border)]">
                <span className="text-[var(--gh-text-subtle)] block text-[10px]">Basarnas (SAR)</span>
                <strong className="text-[var(--gh-text)] text-sm">115</strong>
              </div>
              <div className="rounded-lg bg-[var(--gh-surface-raised)] p-2 border border-[var(--gh-border)]">
                <span className="text-[var(--gh-text-subtle)] block text-[10px]">Info Cuaca/Gempa BMKG</span>
                <strong className="text-[var(--gh-text)] text-sm">196</strong>
              </div>
            </div>
          </div>

          {/* Column 3: Arsitektur Sistem */}
          <div>
            <span className="font-semibold uppercase tracking-wider text-[var(--gh-text)] text-xs mb-3 flex items-center gap-2">
              <Server className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />
              Spesifikasi Gateway
            </span>
            <p className="text-[var(--gh-text-muted)] leading-relaxed text-xs">
              Aplikasi frontend dibangun menggunakan <strong>Next.js App Router</strong> &amp; <strong>MapLibre GL JS</strong>. Backend REST API Gateway dibangun dengan <strong>Golang (Fiber)</strong> untuk normalisasi data BMKG TEWS &amp; InaRISK.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--gh-text-muted)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Layanan API: Normal &amp; Beroperasi</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[var(--gh-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--gh-text-muted)]">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-5 w-5 rounded-md object-cover ring-1 ring-[var(--gh-border)]"
              referrerPolicy="no-referrer"
            />
            <span>&copy; {new Date().getFullYear()} Indonesia Disaster Monitor. Hak Cipta Dilindungi Undang-Undang.</span>
          </div>
          <span className="text-[var(--gh-text-subtle)]">Peta &amp; Koordinat WGS 84 • Zona Waktu Indonesia Barat (WIB)</span>
        </div>
      </div>
    </footer>
  );
};
