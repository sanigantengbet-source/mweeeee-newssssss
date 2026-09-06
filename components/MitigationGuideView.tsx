'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Waves, 
  Mountain, 
  Droplets, 
  Flame, 
  LifeBuoy, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export const MitigationGuideView: React.FC = () => {
  const [activeHazard, setActiveHazard] = useState<
    'earthquake' | 'tsunami' | 'volcano' | 'flood' | 'landslide' | 'mmi'
  >('earthquake');

  return (
    <div id="mitigation-guide-container" className="space-y-6 transition-colors duration-150">
      {/* Header Banner */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <LifeBuoy className="h-5 w-5 text-red-500" strokeWidth={1.75} />
          <h2 className="text-base sm:text-lg font-bold text-[var(--gh-text)]">
            Panduan Mitigasi &amp; Kesiapsiagaan Bencana (SOP Resmi BNPB)
          </h2>
        </div>
        <p className="mt-1 text-xs text-[var(--gh-text-muted)] max-w-3xl leading-relaxed">
          Prosedur Operasional Standar (SOP) keselamatan mandiri, keluarga, dan komunitas sebelum, saat, dan sesudah bencana alam berdasarkan panduan resmi Badan Nasional Penanggulangan Bencana (BNPB).
        </p>

        {/* Hazard Guide Selector Tabs */}
        <div className="mt-5 flex flex-wrap gap-1.5 pt-3 border-t border-[var(--gh-border)]">
          <button
            onClick={() => setActiveHazard('earthquake')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium border transition ${
              activeHazard === 'earthquake'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] border-[var(--gh-border-active)] font-semibold shadow-sm'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-orange-500" strokeWidth={1.75} />
            Gempa Bumi
          </button>
          <button
            onClick={() => setActiveHazard('tsunami')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium border transition ${
              activeHazard === 'tsunami'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] border-[var(--gh-border-active)] font-semibold shadow-sm'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]'
            }`}
          >
            <Waves className="h-3.5 w-3.5 text-blue-500" strokeWidth={1.75} />
            Tsunami (20-20-20)
          </button>
          <button
            onClick={() => setActiveHazard('volcano')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium border transition ${
              activeHazard === 'volcano'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] border-[var(--gh-border-active)] font-semibold shadow-sm'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]'
            }`}
          >
            <Mountain className="h-3.5 w-3.5 text-red-500" strokeWidth={1.75} />
            Erupsi Gunung Api
          </button>
          <button
            onClick={() => setActiveHazard('flood')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium border transition ${
              activeHazard === 'flood'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] border-[var(--gh-border-active)] font-semibold shadow-sm'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]'
            }`}
          >
            <Droplets className="h-3.5 w-3.5 text-cyan-500" strokeWidth={1.75} />
            Banjir &amp; Bandang
          </button>
          <button
            onClick={() => setActiveHazard('mmi')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium border transition ${
              activeHazard === 'mmi'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] border-[var(--gh-border-active)] font-semibold shadow-sm'
                : 'text-[var(--gh-text-muted)] border-transparent hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]'
            }`}
          >
            <Info className="h-3.5 w-3.5 text-purple-500" strokeWidth={1.75} />
            Tabel Skala MMI BMKG
          </button>
        </div>
      </div>

      {/* Guide Content Sections */}
      {activeHazard === 'earthquake' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 shadow-sm space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 block">
              1. Sebelum Gempa (Pra-Bencana)
            </span>
            <ul className="text-xs text-[var(--gh-text-muted)] space-y-2 list-disc pl-4 leading-relaxed">
              <li>Pastikan struktur rumah tahan gempa dan tata perabotan berat (lemari, rak) menempel kuat ke dinding.</li>
              <li>Tentukan tempat aman di setiap ruangan (di bawah meja kokoh, dekat pilar utama).</li>
              <li>Siapkan Tas Siaga Bencana (TSB) berisi senter, P3K, air minum, peluit, dan dokumen identitas.</li>
              <li>Ketahui cara mematikan saklar listrik utama, regulator gas tabung LPG, dan kran air PDAM.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 shadow-sm space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-500 block">
              2. Saat Terjadi Gempa (Tanggap Darurat)
            </span>
            <ul className="text-xs text-[var(--gh-text)] space-y-2 list-disc pl-4 leading-relaxed">
              <li><strong>DROP, COVER, HOLD ON:</strong> Segera berlutut, lindungi kepala dan leher dengan tangan atau berlindung di bawah meja.</li>
              <li>Jangan menggunakan lift/elevator; gunakan tangga darurat jika situasi memungkinkan setelah getaran berhenti.</li>
              <li>Jika berada di luar gedung, jauhi dinding kaca, tiang listrik, papan reklame, dan pohon besar.</li>
              <li>Jika sedang berkendara, tepikan mobil ke bahu jalan jauh dari jembatan layang dan tebing.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 shadow-sm space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500 block">
              3. Setelah Gempa (Pasca-Bencana)
            </span>
            <ul className="text-xs text-[var(--gh-text-muted)] space-y-2 list-disc pl-4 leading-relaxed">
              <li>Waspadai potensi gempa bumi susulan (aftershocks) dengan tetap berada di titik kumpul terbuka.</li>
              <li>Periksa kebocoran pipa gas dan korsleting kabel listrik sebelum menyalakan api atau saklar.</li>
              <li>Bantu korban luka ringan dan evakuasi lansia serta anak-anak ke posko medis terdekat.</li>
              <li>Pantau rilis resmi dari BMKG terkait kepastian tsunami atau parameter magnitudo akhir.</li>
            </ul>
          </div>
        </div>
      )}

      {activeHazard === 'tsunami' && (
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Waves className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--gh-text)]">Metode Evakuasi Mandiri 20 - 20 - 20 (BNPB)</h3>
              <p className="text-xs text-[var(--gh-text-muted)]">Aturan emas penyelamatan diri saat berada di kawasan pesisir rawan tsunami</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)]">
              <span className="text-2xl sm:text-3xl font-bold text-red-500 font-mono">20 Detik</span>
              <span className="block text-xs font-semibold text-[var(--gh-text)] mt-1">Goncangan Gempa</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] mt-1">Jika gempa terasa kuat terus menerus selama 20 detik atau lebih</p>
            </div>

            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)]">
              <span className="text-2xl sm:text-3xl font-bold text-orange-500 font-mono">20 Menit</span>
              <span className="block text-xs font-semibold text-[var(--gh-text)] mt-1">Waktu Evakuasi Mandiri</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] mt-1">Segera lari menjauhi pantai dalam waktu kurang dari 20 menit tanpa menunggu sirine</p>
            </div>

            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-4 border border-[var(--gh-border)]">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-500 font-mono">20 Meter</span>
              <span className="block text-xs font-semibold text-[var(--gh-text)] mt-1">Ketinggian Tempat Aman</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] mt-1">Menuju bukit atau bangunan vertikal kokoh dengan elevasi minimal 20 meter di atas muka laut</p>
            </div>
          </div>
        </div>
      )}

      {activeHazard === 'volcano' && (
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm sm:text-base font-bold text-[var(--gh-text)] flex items-center gap-2">
            <Mountain className="h-4 w-4 text-orange-500" strokeWidth={1.75} />
            Tingkatan Status Gunung Api Indonesia (PVMBG)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3">
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border border-emerald-500/20">
              <span className="text-xs font-semibold text-emerald-500 block mb-1">Level I (Normal)</span>
              <p className="text-[11px] text-[var(--gh-text-muted)]">Aktivitas dasar visual dan seismik tidak memperlihatkan peningkatan kelainan.</p>
            </div>
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border border-yellow-500/20">
              <span className="text-xs font-semibold text-yellow-500 block mb-1">Level II (Waspada)</span>
              <p className="text-[11px] text-[var(--gh-text-muted)]">Mulai ada peningkatan aktivitas seismik dan visual kawah. Mulai pembatasan radius dekat kawah.</p>
            </div>
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border border-orange-500/20">
              <span className="text-xs font-semibold text-orange-500 block mb-1">Level III (Siaga)</span>
              <p className="text-[11px] text-[var(--gh-text-muted)]">Peningkatan seismik nyata yang dapat berlanjut ke erupsi. Warga di radius KRB bersiap mengungsi.</p>
            </div>
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border border-red-500/20">
              <span className="text-xs font-semibold text-red-500 block mb-1">Level IV (Awas)</span>
              <p className="text-[11px] text-[var(--gh-text-muted)]">Letusan utama sedang/segera terjadi. Pengungsian total seluruh warga di dalam radius bahaya KRB.</p>
            </div>
          </div>
        </div>
      )}

      {activeHazard === 'flood' && (
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm sm:text-base font-bold text-[var(--gh-text)] flex items-center gap-2">
            <Droplets className="h-4 w-4 text-cyan-500" strokeWidth={1.75} />
            Panduan Menghadapi Banjir &amp; Banjir Bandang
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border border-[var(--gh-border)]">
              <span className="text-xs font-semibold text-cyan-500 block mb-1">Pra-Banjir</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] leading-relaxed">
                Tinggikan peralatan elektronik, bersihkan saluran air, amankan surat penting di kantong kedap air, dan kenali titik evakuasi bebas genangan.
              </p>
            </div>
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border border-[var(--gh-border)]">
              <span className="text-xs font-semibold text-amber-500 block mb-1">Saat Banjir</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] leading-relaxed">
                Matikan instalasi listrik di meteran utama, hindari berjalan atau menyetir menerobos arus air deras yang dapat menghanyutkan kendaraan.
              </p>
            </div>
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3.5 border border-[var(--gh-border)]">
              <span className="text-xs font-semibold text-emerald-500 block mb-1">Pasca-Banjir</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] leading-relaxed">
                Waspadai binatang berbisa (ular/kelabang), bersihkan endapan lumpur dengan desinfektan, dan pastikan instalasi listrik kering sebelum dihidupkan.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeHazard === 'mmi' && (
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-6 shadow-sm space-y-4">
          <div className="border-b border-[var(--gh-border)] pb-3">
            <h3 className="text-sm sm:text-base font-bold text-[var(--gh-text)]">Tabel Skala Intensitas Gempa MMI (Modified Mercalli Intensity)</h3>
            <p className="text-xs text-[var(--gh-text-muted)]">Klasifikasi getaran gempa bumi BMKG berdasarkan dampak permukaan dan persepsi manusia</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] flex items-start gap-3">
              <span className="font-mono font-bold text-emerald-500 px-2 py-0.5 rounded bg-[var(--gh-surface)] border border-[var(--gh-border)] shrink-0">I - II MMI</span>
              <span className="text-[var(--gh-text-muted)]">Getaran tidak dirasakan atau hanya dirasakan oleh beberapa orang dalam keadaan diam. Benda ringan yang digantung bergoyang.</span>
            </div>
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] flex items-start gap-3">
              <span className="font-mono font-bold text-yellow-500 px-2 py-0.5 rounded bg-[var(--gh-surface)] border border-[var(--gh-border)] shrink-0">III - IV MMI</span>
              <span className="text-[var(--gh-text-muted)]">Getaran dirasakan nyata di dalam rumah seakan-akan ada truk berlalu. Jendela, pintu berderik, dan dinding berbunyi.</span>
            </div>
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] flex items-start gap-3">
              <span className="font-mono font-bold text-orange-500 px-2 py-0.5 rounded bg-[var(--gh-surface)] border border-[var(--gh-border)] shrink-0">V - VI MMI</span>
              <span className="text-[var(--gh-text-muted)]">Getaran dirasakan oleh hampir semua penduduk, orang banyak terbangun, gerabah pecah, barang terpelanting, plester dinding retak ringan.</span>
            </div>
            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] flex items-start gap-3">
              <span className="font-mono font-bold text-red-500 px-2 py-0.5 rounded bg-[var(--gh-surface)] border border-[var(--gh-border)] shrink-0">VII - VIII MMI</span>
              <span className="text-[var(--gh-text-muted)]">Terjadi kerusakan ringan pada bangunan dengan konstruksi yang baik. Bangunan sederhana roboh, cerobong asap roboh, perabot berat bergeser.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
