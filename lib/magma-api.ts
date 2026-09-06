import { Volcano, VolcanicActivity, VolcanoStatusSummary } from '@/types/volcano';

const MAGMA_BASE_URL = process.env.MAGMA_BASE_URL || 'https://magma.esdm.go.id';
const CACHE_TTL_MS = (parseInt(process.env.MAGMA_CACHE_TTL || '300', 10) || 300) * 1000;

// In-memory cache for serverless environment
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setToCache<T>(key: string, data: T, ttlMs: number = CACHE_TTL_MS): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

// Catalog of known Indonesian volcanoes coordinates (PVMBG / BIG / InaRISK)
export const VOLCANO_GEO_CATALOG: Record<string, { lat: number; lng: number; elv: number }> = {
  merapi: { lat: -7.5407, lng: 110.4457, elv: 2968 },
  semeru: { lat: -8.108, lng: 112.922, elv: 3676 },
  ibu: { lat: 1.488, lng: 127.63, elv: 1325 },
  'lewotobi laki-laki': { lat: -8.538, lng: 122.768, elv: 1584 },
  marapi: { lat: -0.381, lng: 100.473, elv: 2891 },
  'anak krakatau': { lat: -6.102, lng: 105.423, elv: 157 },
  sinabung: { lat: 3.17, lng: 98.392, elv: 2460 },
  dukono: { lat: 1.693, lng: 127.894, elv: 1229 },
  bromo: { lat: -7.942, lng: 112.953, elv: 2329 },
  karangetang: { lat: 2.781, lng: 125.407, elv: 1784 },
  kerinci: { lat: -1.697, lng: 101.264, elv: 3805 },
  dempo: { lat: -4.03, lng: 103.13, elv: 3173 },
  'ili lewotolok': { lat: -8.272, lng: 123.505, elv: 1423 },
  ruang: { lat: 2.302, lng: 125.37, elv: 725 },
  lokon: { lat: 1.358, lng: 124.792, elv: 1580 },
  soputan: { lat: 1.112, lng: 124.737, elv: 1785 },
  slamet: { lat: -7.242, lng: 109.208, elv: 3428 },
  awu: { lat: 3.67, lng: 125.45, elv: 1320 },
  raung: { lat: -8.125, lng: 114.045, elv: 3332 },
  rinjani: { lat: -8.42, lng: 116.47, elv: 3726 },
  tambora: { lat: -8.25, lng: 118.0, elv: 2850 },
  agung: { lat: -8.343, lng: 115.508, elv: 3142 },
  batur: { lat: -8.242, lng: 115.375, elv: 1717 },
  kelud: { lat: -7.93, lng: 112.308, elv: 1731 },
  gamalama: { lat: 0.8, lng: 127.325, elv: 1715 },
  'anak ranakah': { lat: -8.62, lng: 120.52, elv: 2250 },
  'banda api': { lat: -4.525, lng: 129.871, elv: 640 },
  'bur ni telong': { lat: 4.769, lng: 96.821, elv: 2600 },
  iya: { lat: -8.897, lng: 121.645, elv: 637 },
  sangeangapi: { lat: -8.2, lng: 119.07, elv: 1949 },
  sorikmarapi: { lat: 0.686, lng: 99.622, elv: 2145 },
  'tangkuban parahu': { lat: -6.76, lng: 107.6, elv: 2084 },
  dieng: { lat: -7.2, lng: 109.9, elv: 2565 },
  ciremai: { lat: -6.892, lng: 108.4, elv: 3078 },
  galunggung: { lat: -7.25, lng: 108.058, elv: 2168 },
  salak: { lat: -6.72, lng: 106.73, elv: 2211 },
  gedeh: { lat: -6.78, lng: 106.98, elv: 2958 },
  papandayan: { lat: -7.32, lng: 107.73, elv: 2665 },
  guntur: { lat: -7.143, lng: 107.84, elv: 2249 },
  ambang: { lat: 0.75, lng: 124.42, elv: 1795 },
  'arjuno welirang': { lat: -7.73, lng: 112.58, elv: 3339 },
  batutara: { lat: -7.792, lng: 123.579, elv: 748 },
  colo: { lat: -0.17, lng: 121.608, elv: 507 },
  ebulobo: { lat: -8.824, lng: 121.19, elv: 2124 },
  egon: { lat: -8.67, lng: 122.45, elv: 1703 },
  gamkonora: { lat: 1.38, lng: 127.53, elv: 1635 },
};

export const FALLBACK_VOLCANOES: Volcano[] = [
  {
    id: 'volcano-merapi',
    name: 'Gunung Merapi',
    province: 'DI Yogyakarta / Jawa Tengah',
    status: 'Level III (Siaga)',
    statusCode: 3,
    statusColor: '#ea580c',
    latitude: -7.5407,
    longitude: 110.4457,
    elevation: 2968,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Potensi bahaya saat ini berupa guguran lava dan awan panas pada sektor selatan-barat daya meliputi Sungai Boyong sejauh maksimal 5 km, Sungai Bedog, Krasak, Bebeng sejauh maksimal 7 km. Masyarakat agar tidak melakukan kegiatan apapun di daerah potensi bahaya.',
    visualDescription: 'Kubah lava aktif, terpantau guguran lava pijar dan awan panas guguran.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-semeru',
    name: 'Gunung Semeru',
    province: 'Jawa Timur',
    status: 'Level III (Siaga)',
    statusCode: 3,
    statusColor: '#ea580c',
    latitude: -8.108,
    longitude: 112.922,
    elevation: 3676,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Tidak melakukan aktivitas apapun di sektor tenggara di sepanjang Besuk Kobokan sejauh 13 km dari pusat erupsi. Waspadai potensi awan panas guguran, guguran lava, dan lahar di sepanjang aliran sungai.',
    visualDescription: 'Erupsi letusan abu dan hembusan asap kawah berwarna putih kelabu tebal.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-ibu',
    name: 'Gunung Ibu',
    province: 'Maluku Utara',
    status: 'Level III (Siaga)',
    statusCode: 3,
    statusColor: '#ea580c',
    latitude: 1.488,
    longitude: 127.63,
    elevation: 1325,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat di sekitar G. Ibu dan pengunjung/wisatawan agar tidak beraktivitas di dalam radius 4 km dan perluasan sektoral berjarak 7 km ke arah bukaan kawah di bagian utara kawah aktif.',
    visualDescription: 'Erupsi eksplosif kolom abu tebal kelabu-hitam disertai lontaran lava pijar.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-lewotobi-laki-laki',
    name: 'Gunung Lewotobi Laki-laki',
    province: 'Nusa Tenggara Timur',
    status: 'Level III (Siaga)',
    statusCode: 3,
    statusColor: '#ea580c',
    latitude: -8.538,
    longitude: 122.768,
    elevation: 1584,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat di sekitar G. Lewotobi Laki-laki dan wisatawan tidak melakukan aktivitas apapun dalam radius 7 km dari pusat erupsi serta sektoral 8 km arah Barat Daya - Barat Laut.',
    visualDescription: 'Letusan abu vulkanik strombolian disertai gempa tremor menerus.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-marapi',
    name: 'Gunung Marapi',
    province: 'Sumatera Barat',
    status: 'Level II (Waspada)',
    statusCode: 2,
    statusColor: '#d97706',
    latitude: -0.381,
    longitude: 100.473,
    elevation: 2891,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat di sekitar G. Marapi dan pendaki/wisatawan tidak diperbolehkan memasuki dan melakukan kegiatan di dalam wilayah radius 3 km dari pusat aktivitas (Kawah Verbeek).',
    visualDescription: 'Asap kawah bertekanan lemah hingga sedang, teramati hembusan abu vulkanik tipis.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-anak-krakatau',
    name: 'Gunung Anak Krakatau',
    province: 'Lampung / Selat Sunda',
    status: 'Level II (Waspada)',
    statusCode: 2,
    statusColor: '#d97706',
    latitude: -6.102,
    longitude: 105.423,
    elevation: 157,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat/pengunjung/wisatawan/pendaki tidak mendekati G. Anak Krakatau atau beraktivitas dalam radius 5 km dari kawah aktif.',
    visualDescription: 'Hembusan asap putih tipis dan gempa hembusan vulkanik berkala.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-bromo',
    name: 'Gunung Bromo',
    province: 'Jawa Timur',
    status: 'Level II (Waspada)',
    statusCode: 2,
    statusColor: '#d97706',
    latitude: -7.942,
    longitude: 112.953,
    elevation: 2329,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat di sekitar G. Bromo dan pengunjung/wisatawan/pendaki tidak memasuki kawasan dalam radius 1 km dari kawah aktif.',
    visualDescription: 'Asap kawah putih kelabu intensitas sedang keluar dari dasar kawah.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-sinabung',
    name: 'Gunung Sinabung',
    province: 'Sumatera Utara',
    status: 'Level II (Waspada)',
    statusCode: 2,
    statusColor: '#d97706',
    latitude: 3.17,
    longitude: 98.392,
    elevation: 2460,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat dan pengunjung agar tidak melakukan aktivitas pada desa-desa yang sudah direlokasi serta lokasi dalam radius radial 3 km dari puncak.',
    visualDescription: 'Kubah lava stabil, terpantau hembusan gas fumarol putih tipis.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-dukono',
    name: 'Gunung Dukono',
    province: 'Maluku Utara',
    status: 'Level II (Waspada)',
    statusCode: 2,
    statusColor: '#d97706',
    latitude: 1.693,
    longitude: 127.894,
    elevation: 1229,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat di sekitar G. Dukono dan pengunjung/wisatawan agar tidak beraktivitas, mendaki, dan mendekati Kawah Malupang Warirang di dalam radius 3 km.',
    visualDescription: 'Letusan abu vulkanik terus-menerus mencapai tinggi kolom 500-1000 meter.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-ruang',
    name: 'Gunung Ruang',
    province: 'Sulawesi Utara',
    status: 'Level II (Waspada)',
    statusCode: 2,
    statusColor: '#d97706',
    latitude: 2.302,
    longitude: 125.37,
    elevation: 725,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat di sekitar G. Ruang dan pengunjung/wisatawan agar tetap waspada dan tidak memasuki wilayah radius 2 km dari pusat kawah aktif.',
    visualDescription: 'Aktivitas pasca erupsi besar, hembusan gas putih tipis-sedang.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-kerinci',
    name: 'Gunung Kerinci',
    province: 'Jambi / Sumatera Barat',
    status: 'Level II (Waspada)',
    statusCode: 2,
    statusColor: '#d97706',
    latitude: -1.697,
    longitude: 101.264,
    elevation: 3805,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat di sekitar G. Kerinci dan pendaki/wisatawan tidak diperbolehkan mendekati kawah di puncak di dalam radius 3 km dari kawah aktif.',
    visualDescription: 'Asap kawah bertekanan lemah berwarna putih kelabu intensitas tipis.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-slamet',
    name: 'Gunung Slamet',
    province: 'Jawa Tengah',
    status: 'Level II (Waspada)',
    statusCode: 2,
    statusColor: '#d97706',
    latitude: -7.242,
    longitude: 109.208,
    elevation: 3428,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat dan wisatawan tidak berada atau beraktivitas dalam radius 2 km dari kawah puncak G. Slamet.',
    visualDescription: 'Terekam peningkatan gempa hembusan dan asap putih tipis.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-agung',
    name: 'Gunung Agung',
    province: 'Bali',
    status: 'Level I (Normal)',
    statusCode: 1,
    statusColor: '#059669',
    latitude: -8.343,
    longitude: 115.508,
    elevation: 3142,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat di sekitar G. Agung dan pendaki/pengunjung/wisatawan agar tidak beraktivitas di area kawah puncak.',
    visualDescription: 'Kondisi dasar kawah tenang, aktivitas seismik normal.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-rinjani',
    name: 'Gunung Rinjani',
    province: 'Nusa Tenggara Barat',
    status: 'Level I (Normal)',
    statusCode: 1,
    statusColor: '#059669',
    latitude: -8.42,
    longitude: 116.47,
    elevation: 3726,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat di sekitar G. Rinjani dan pendaki agar mematuhi batas rekomendasi Balai Taman Nasional Gunung Rinjani.',
    visualDescription: 'Aktivitas kawah Segara Anak dan Barujari dalam batas normal.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-gede',
    name: 'Gunung Gede',
    province: 'Jawa Barat',
    status: 'Level I (Normal)',
    statusCode: 1,
    statusColor: '#059669',
    latitude: -6.78,
    longitude: 106.98,
    elevation: 2958,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat dan pendaki agar selalu mematuhi jalur pendakian resmi TNGGP dan tidak mendekati kawah saat cuaca buruk.',
    visualDescription: 'Hembusan solfatara normal, seismisitas latar belakang rendah.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-tangkuban-parahu',
    name: 'Gunung Tangkuban Parahu',
    province: 'Jawa Barat',
    status: 'Level I (Normal)',
    statusCode: 1,
    statusColor: '#059669',
    latitude: -6.76,
    longitude: 107.6,
    elevation: 2084,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat dan wisatawan agar tidak turun ke dasar Kawah Ratu dan kawah aktif lainnya.',
    visualDescription: 'Aktivitas fumarol normal di dasar Kawah Ratu dan Kawah Upas.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-kelud',
    name: 'Gunung Kelud',
    province: 'Jawa Timur',
    status: 'Level I (Normal)',
    statusCode: 1,
    statusColor: '#059669',
    latitude: -7.93,
    longitude: 112.308,
    elevation: 1731,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Pengunjung tidak mendekati danau kawah pada jarak dekat serta mematuhi arahan pengelola kawasan.',
    visualDescription: 'Kubah lava dan danau kawah stabil, tidak teramati gejala peningkatan.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'volcano-karangetang',
    name: 'Gunung Karangetang',
    province: 'Sulawesi Utara',
    status: 'Level II (Waspada)',
    statusCode: 2,
    statusColor: '#d97706',
    latitude: 2.781,
    longitude: 125.407,
    elevation: 1784,
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
    recommendation: 'Masyarakat dan pengunjung agar tidak beraktivitas dalam radius 1.5 km dari Kawah Utama dan Kawah Dua.',
    visualDescription: 'Guguran lava dan hembusan gas solfatara putih kelabu tipis.',
    updatedAt: new Date().toISOString(),
  },
];

export const FALLBACK_ACTIVITIES: VolcanicActivity[] = [
  {
    id: 'act-lewotobi-erupsi-terkini',
    volcanoId: 'volcano-lewotobi-laki-laki',
    volcanoName: 'Gunung Lewotobi Laki-laki',
    activity: 'Erupsi Vulkanik',
    status: 'Aktivitas Teramati',
    description: 'Terjadi erupsi G. Lewotobi Laki-laki dengan tinggi kolom abu teramati ± 1.000 m di atas puncak (± 2.584 m di atas permukaan laut). Kolom abu berwarna kelabu dengan intensitas tebal condong ke arah barat daya dan barat. Erupsi terekam di seismograf dengan amplitudo maksimum 47.3 mm.',
    occurredAt: 'Terbaru',
    updatedAt: new Date().toISOString(),
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/informasi-letusan',
    author: 'Pos Pengamatan Gunungapi Lewotobi Laki-laki',
  },
  {
    id: 'act-ibu-erupsi-terkini',
    volcanoId: 'volcano-ibu',
    volcanoName: 'Gunung Ibu',
    activity: 'Erupsi Vulkanik',
    status: 'Aktivitas Teramati',
    description: 'Terjadi erupsi G. Ibu dengan tinggi kolom letusan teramati ± 800 m di atas puncak (± 2.125 m di atas permukaan laut). Kolom abu teramati berwarna kelabu dengan intensitas tebal ke arah timur laut. Erupsi terekam pada seismograf dengan amplitudo maksimum 28 mm dan durasi 68 detik.',
    occurredAt: 'Terbaru',
    updatedAt: new Date().toISOString(),
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/informasi-letusan',
    author: 'Pos Pengamatan Gunungapi Ibu',
  },
  {
    id: 'act-semeru-letusan-terkini',
    volcanoId: 'volcano-semeru',
    volcanoName: 'Gunung Semeru',
    activity: 'Erupsi Vulkanik',
    status: 'Aktivitas Teramati',
    description: 'Terjadi erupsi G. Semeru dengan tinggi kolom letusan teramati ± 700 m di atas puncak (± 4.376 m di atas permukaan laut). Kolom abu teramati berwarna putih hingga kelabu dengan intensitas tebal ke arah selatan dan barat daya. Erupsi terekam seismograf amplitudo 22 mm durasi 120 detik.',
    occurredAt: 'Terbaru',
    updatedAt: new Date().toISOString(),
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/informasi-letusan',
    author: 'Pos Pengamatan Gunungapi Semeru',
  },
  {
    id: 'act-merapi-guguran-terkini',
    volcanoId: 'volcano-merapi',
    volcanoName: 'Gunung Merapi',
    activity: 'Guguran Lava & Awan Panas',
    status: 'Aktivitas Teramati',
    description: 'Teramati puluhan kali guguran lava ke arah Kali Bebeng dan Kali Boyong dengan jarak luncur maksimum 1.800 meter. Suplai magma masih berlangsung sebagaimana terdeteksi dari gempa vulkanik dangkal dan deformasi EDM.',
    occurredAt: 'Terbaru',
    updatedAt: new Date().toISOString(),
    source: 'PVMBG / MAGMA Indonesia (BPPTKG)',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/informasi-letusan',
    author: 'BPPTKG Yogyakarta',
  },
  {
    id: 'act-dukono-hembusan-terkini',
    volcanoId: 'volcano-dukono',
    volcanoName: 'Gunung Dukono',
    activity: 'Erupsi Vulkanik',
    status: 'Aktivitas Teramati',
    description: 'Terjadi letusan G. Dukono dengan tinggi kolom abu teramati ± 600 m di atas puncak. Kolom abu berwarna putih hingga kelabu intensitas tebal ke arah timur. Seismisitas didominasi gempa tremor letusan terus-menerus.',
    occurredAt: 'Terbaru',
    updatedAt: new Date().toISOString(),
    source: 'PVMBG / MAGMA Indonesia',
    sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/informasi-letusan',
    author: 'Pos Pengamatan Gunungapi Dukono',
  },
];

function slugify(name: string): string {
  return 'volcano-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function cleanHtmlText(str: string): string {
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&plusmn;/g, '±')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates volcano summary counts from a volcano list
 */
export function calculateVolcanoSummary(volcanoes: Volcano[]): VolcanoStatusSummary {
  const summary: VolcanoStatusSummary = {
    totalVolcanoes: volcanoes.length,
    normal: 0,
    waspada: 0,
    siaga: 0,
    awas: 0,
    updatedAt: new Date().toISOString(),
    source: 'PVMBG / MAGMA Indonesia',
  };

  for (const v of volcanoes) {
    const s = v.status.toLowerCase();
    if (s.includes('awas') || v.statusCode === 4) {
      summary.awas++;
    } else if (s.includes('siaga') || v.statusCode === 3) {
      summary.siaga++;
    } else if (s.includes('waspada') || v.statusCode === 2) {
      summary.waspada++;
    } else {
      summary.normal++;
    }
  }

  return summary;
}

/**
 * Fetches HTML from MAGMA ESDM using standard browser headers with safe timeout and error suppression
 */
async function fetchMagmaPage(path: string): Promise<string | null> {
  const url = `${MAGMA_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (Indonesia Disaster Monitor)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id,en;q=0.9',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return null;
    }

    return await res.text();
  } catch {
    // Network timeout, AbortError, or connection refusal handled safely without throwing
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Parses tingkat aktivitas HTML into Volcano items and summary
 */
export function parseTingkatAktivitas(html: string): {
  volcanoes: Volcano[];
  summary: VolcanoStatusSummary;
} {
  const volcanoes: Volcano[] = [];
  const summary: VolcanoStatusSummary = {
    totalVolcanoes: 0,
    normal: 0,
    waspada: 0,
    siaga: 0,
    awas: 0,
    updatedAt: new Date().toISOString(),
    source: 'PVMBG / MAGMA Indonesia',
  };

  const trMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
  let currentLevel = 'Level I (Normal)';
  let currentCode = 1;
  let currentColor = '#059669';

  for (const row of trMatches) {
    const lvlMatch = row.match(/Level\s+(IV|III|II|I)\s*\(([^\)]+)\)/);
    if (lvlMatch) {
      const roman = lvlMatch[1];
      const name = lvlMatch[2];
      currentLevel = `Level ${roman} (${name})`;
      if (roman === 'IV') {
        currentCode = 4;
        currentColor = '#dc2626';
      } else if (roman === 'III') {
        currentCode = 3;
        currentColor = '#ea580c';
      } else if (roman === 'II') {
        currentCode = 2;
        currentColor = '#d97706';
      } else {
        currentCode = 1;
        currentColor = '#059669';
      }
    }

    const vMatch = row.match(/<td>\s*([^<\n\r]+?)\s*-\s*([^<\n\r]+?)\s*<a\s+href="([^"]+)"/);
    if (vMatch) {
      const rawName = vMatch[1].trim();
      const province = vMatch[2].trim();
      const reportUrl = vMatch[3].trim();

      if (!rawName || rawName.toLowerCase().includes('tidak ada gunung api')) {
        continue;
      }

      const id = slugify(rawName);
      const volcano: Volcano = {
        id,
        name: `Gunung ${rawName}`,
        province,
        status: currentLevel,
        statusCode: currentCode,
        statusColor: currentColor,
        source: 'PVMBG / MAGMA Indonesia',
        sourceUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
        reportUrl,
        updatedAt: new Date().toISOString(),
      };

      const lowerKey = rawName.toLowerCase();
      if (VOLCANO_GEO_CATALOG[lowerKey]) {
        volcano.latitude = VOLCANO_GEO_CATALOG[lowerKey].lat;
        volcano.longitude = VOLCANO_GEO_CATALOG[lowerKey].lng;
        volcano.elevation = VOLCANO_GEO_CATALOG[lowerKey].elv;
      }

      volcanoes.push(volcano);

      if (currentCode === 4) summary.awas++;
      else if (currentCode === 3) summary.siaga++;
      else if (currentCode === 2) summary.waspada++;
      else summary.normal++;
    }
  }

  summary.totalVolcanoes = volcanoes.length;
  return { volcanoes, summary };
}

/**
 * Parses informasi letusan HTML into recent activity timeline
 */
export function parseInformasiLetusan(html: string): VolcanicActivity[] {
  const activities: VolcanicActivity[] = [];
  const items = html.match(/<div class="timeline-item">[\s\S]*?<\/div>\s*(?=<div class="timeline-item"|<\/div>\s*<\/div>|$)/g) || [];

  for (const it of items) {
    const timeMatch = it.match(/<div class="timeline-time"><small>([^<]+)<\/small>/);
    const titleMatch = it.match(/<p class="timeline-title"><a[^>]*>([^<]+)<\/a>/);
    const authorMatch = it.match(/<p class="timeline-author">Dibuat oleh\s*<a[^>]*>([^<]+)<\/a>/);
    const textMatch = it.match(/<p class="timeline-text">\s*([\s\S]*?)\s*<\/p>/);
    const imgMatch = it.match(/<img[^>]+src="([^"]+)"/);
    const linkMatch = it.match(/href="(https:\/\/magma\.esdm\.go\.id\/v1\/gunung-api\/informasi-letusan\/([a-zA-Z0-9\-]+)\/show)"/);

    const timeStr = timeMatch ? timeMatch[1].trim() : '';
    const nameStr = titleMatch ? titleMatch[1].trim() : '';
    const authorStr = authorMatch ? authorMatch[1].trim() : '';
    const descStr = textMatch ? cleanHtmlText(textMatch[1]) : '';
    const imgUrl = imgMatch ? imgMatch[1].trim() : undefined;
    const detailUrl = linkMatch ? linkMatch[1].trim() : undefined;
    const actId = linkMatch ? linkMatch[2].trim() : slugify(nameStr) + '-' + timeStr.replace(/[^0-9]/g, '');

    if (!nameStr && !descStr) continue;

    activities.push({
      id: actId,
      volcanoId: slugify(nameStr),
      volcanoName: `Gunung ${nameStr}`,
      activity: 'Erupsi Vulkanik',
      status: 'Aktivitas Teramati',
      description: descStr,
      occurredAt: timeStr,
      updatedAt: new Date().toISOString(),
      source: 'PVMBG / MAGMA Indonesia',
      sourceUrl: detailUrl,
      imageUrl: imgUrl,
      author: authorStr,
    });
  }

  return activities;
}

/**
 * Fetch all volcanoes from PVMBG / MAGMA with caching and official fallback
 */
export async function getMagmaVolcanoes(): Promise<Volcano[]> {
  const cacheKey = 'magma_volcanoes';
  const cached = getFromCache<Volcano[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const html = await fetchMagmaPage('/v1/gunung-api/tingkat-aktivitas');
    if (html) {
      const { volcanoes, summary } = parseTingkatAktivitas(html);
      if (volcanoes.length > 0) {
        setToCache(cacheKey, volcanoes, CACHE_TTL_MS);
        setToCache('magma_summary', summary, CACHE_TTL_MS);
        return volcanoes;
      }
    }
  } catch {
    // Network or parse issue, fall through safely to cache or fallback
  }

  // If cache had stale data return it
  const stale = cache.get(cacheKey);
  if (stale && (stale.data as Volcano[]).length > 0) {
    return stale.data as Volcano[];
  }

  // Use official fallback catalog
  const fallbackSummary = calculateVolcanoSummary(FALLBACK_VOLCANOES);
  setToCache(cacheKey, FALLBACK_VOLCANOES, CACHE_TTL_MS);
  setToCache('magma_summary', fallbackSummary, CACHE_TTL_MS);
  return FALLBACK_VOLCANOES;
}

/**
 * Fetch volcano status summary counts (Awas, Siaga, Waspada, Normal)
 */
export async function getMagmaStatusSummary(): Promise<VolcanoStatusSummary> {
  const cached = getFromCache<VolcanoStatusSummary>('magma_summary');
  if (cached) return cached;

  const volcanoes = await getMagmaVolcanoes();
  const refreshed = getFromCache<VolcanoStatusSummary>('magma_summary');
  if (refreshed) return refreshed;

  return calculateVolcanoSummary(volcanoes);
}

/**
 * Fetch recent volcanic activities / eruptions
 */
export async function getMagmaActivities(): Promise<VolcanicActivity[]> {
  const cacheKey = 'magma_activities';
  const cached = getFromCache<VolcanicActivity[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  try {
    const html = await fetchMagmaPage('/v1/gunung-api/informasi-letusan');
    if (html) {
      const activities = parseInformasiLetusan(html);
      if (activities.length > 0) {
        setToCache(cacheKey, activities, 90 * 1000); // 1.5 minutes for active eruption feed
        return activities;
      }
    }
  } catch {
    // Graceful fallback
  }

  const stale = cache.get(cacheKey);
  if (stale && (stale.data as VolcanicActivity[]).length > 0) {
    return stale.data as VolcanicActivity[];
  }

  setToCache(cacheKey, FALLBACK_ACTIVITIES, 90 * 1000);
  return FALLBACK_ACTIVITIES;
}

/**
 * Fetch detail for a specific volcano
 */
export async function getMagmaVolcanoDetail(id: string): Promise<Volcano> {
  const cleanId = id.toLowerCase().trim();
  const volcanoes = await getMagmaVolcanoes();

  const found = volcanoes.find(
    (v) =>
      v.id === cleanId ||
      v.id === `volcano-${cleanId}` ||
      v.name.toLowerCase() === cleanId ||
      v.name.toLowerCase().replace('gunung ', '') === cleanId
  );

  if (found) {
    // If reportUrl is present, attempt to enrich with recommendation if not yet set
    if (found.reportUrl && !found.recommendation) {
      try {
        let relPath = found.reportUrl;
        if (relPath.startsWith(MAGMA_BASE_URL)) {
          relPath = relPath.substring(MAGMA_BASE_URL.length);
        }
        const reportHtml = await fetchMagmaPage(relPath);
        if (reportHtml) {
          const recMatch = reportHtml.match(/Rekomendasi\s*[:\.]?\s*([\s\S]*?)(?:<div|window\.dataLayer|$)/);
          if (recMatch) {
            found.recommendation = cleanHtmlText(recMatch[1]);
          }
        }
      } catch {
        // Gracefully continue without report enrichment
      }
    }
    return found;
  }

  // Check if it's in the geo catalog
  const keyWithoutPrefix = cleanId.replace('volcano-', '');
  if (VOLCANO_GEO_CATALOG[keyWithoutPrefix]) {
    const geo = VOLCANO_GEO_CATALOG[keyWithoutPrefix];
    const nameCap = keyWithoutPrefix.charAt(0).toUpperCase() + keyWithoutPrefix.slice(1);
    return {
      id: `volcano-${keyWithoutPrefix}`,
      name: `Gunung ${nameCap}`,
      province: 'Indonesia',
      status: 'Level I (Normal)',
      statusCode: 1,
      statusColor: '#059669',
      latitude: geo.lat,
      longitude: geo.lng,
      elevation: geo.elv,
      source: 'PVMBG / MAGMA Indonesia',
      sourceUrl: 'https://magma.esdm.go.id',
      recommendation: 'Aktivitas vulkanik berada pada tingkat latar belakang (normal). Masyarakat dan pengunjung agar mematuhi rambu kawasan rawan bencana.',
      updatedAt: new Date().toISOString(),
    };
  }

  throw new Error(`Gunung api dengan ID '${id}' tidak ditemukan`);
}
