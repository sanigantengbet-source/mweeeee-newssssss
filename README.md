# Indonesia Disaster Monitor

Platform monitoring dan visualisasi data kebencanaan di Indonesia secara faktual, real-time, dan terintegrasi menggunakan data resmi dari **Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)** serta **Badan Nasional Penanggulangan Bencana (BNPB) / InaRISK**.

> **Komitmen Integritas Data (Non-AI Guarantee):**  
> Sistem ini **TIDAK menggunakan analisis AI, machine learning, chatbot, atau prediksi buatan apa pun**. Seluruh data seismik, parameter magnitudo, kedalaman, skala MMI, dan zonasi risiko disajikan murni dari sensor resmi BMKG, PVMBG (Badan Geologi), dan InaRISK BNPB.

---

## 1. Architecture Overview

Aplikasi ini menggunakan arsitektur modern terpisah antara **Frontend GIS Interactive (Next.js)** dan **Backend API Gateway & Data Normalizer (Golang Fiber)**:

```
[ BMKG Open TEWS API ]          [ InaRISK ArcGIS REST ]          [ PVMBG Magma ESDM ]
           |                                |                             |
           +--------------------------------+-----------------------------+
                                            |
                                            v
                        [ Golang Fiber REST API Gateway ]
                     - Caching Layer TTL (In-Memory)
                     - Normalizer & Fallback Handler
                     - GeoJSON Serializer
                     - Vercel Serverless Ready Adapter
                                            |
                                            v
                         [ Next.js App Router Frontend ]
                     - MapLibre GL JS Interactive Maps
                     - Real-time Polling & Live Alerts
                     - Dark Mode First Design (Tailwind CSS)
                     - Responsive (Mobile-First)
```

---

## 2. Sumber Data Resmi

1. **BMKG TEWS (Tsunami Early Warning System):**
   - `https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json` (Gempa bumi terkini real-time)
   - `https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json` (Daftar 15 gempa bumi M ≥ 5.0 terbaru)
   - `https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json` (Daftar gempa bumi dirasakan dan skala MMI)
   - Gambar shakemap isoseismal resmi BMKG

2. **BNPB / InaRISK (Indonesia Risk Assessment):**
   - Layanan ArcGIS REST ImageServer & FeatureServer untuk zonasi bahaya gempa bumi, tsunami, banjir, longsor, karhutla, dan likuefaksi.
   - Indeks Risiko Bencana Indonesia (IRBI) per provinsi dan kabupaten/kota.

3. **PVMBG (Pusat Vulkanologi dan Mitigasi Bencana Geologi):**
   - Status aktivitas gunung api aktif Indonesia (Normal, Waspada, Siaga, Awas).

---

## 3. Struktur Direktori Proyek

```
indonesia-disaster-monitor/
├── app/                              # Next.js App Router
│   ├── api/                          # Next.js API Routes (Proxy & Fallback)
│   │   ├── disasters/                # Endpoint daftar & detail bencana
│   │   ├── earthquakes/              # Endpoint gempa terkini & signifikan
│   │   ├── volcanoes/                # Endpoint gunung api aktif
│   │   ├── risk/                     # Endpoint indeks risiko bencana IRBI
│   │   ├── regions/                  # Endpoint wilayah & kabupaten
│   │   ├── map/                      # Endpoint konfigurasi layer GIS
│   │   ├── search/                   # Endpoint pencarian instan
│   │   └── health/                   # Endpoint status kesehatan sistem
│   ├── globals.css                   # Tailwind CSS v4 & MapLibre styling
│   ├── layout.tsx                    # Root Layout dengan dark mode
│   └── page.tsx                      # Halaman utama aplikasi (Single-view dashboard)
├── backend/                          # Golang Fiber REST API Gateway
│   ├── api/
│   │   └── index.go                  # Vercel Serverless Function entrypoint
│   ├── cmd/
│   │   └── server/main.go            # Standalone binary entrypoint
│   ├── internal/
│   │   ├── app/app.go                # Inisialisasi Fiber & routing
│   │   ├── cache/cache.go            # Thread-safe in-memory cache dengan TTL
│   │   ├── client/                   # HTTP client ke BMKG, BNPB, InaRISK
│   │   ├── config/config.go          # Manajemen konfigurasi environment
│   │   ├── handler/                  # HTTP route handlers
│   │   ├── model/                    # Data transfer objects & structs
│   │   └── service/                  # Business logic & data normalization
│   ├── go.mod                        # Go module dependencies
│   └── vercel.json                   # Konfigurasi serverless deployment backend
├── components/                       # Reusable UI Components
│   ├── AlertBanner.tsx               # Banner darurat gempa M ≥ 6.0 / tsunami
│   ├── DisasterDetailModal.tsx       # Modal detail teknis, MMI & SOP mitigasi
│   ├── DisasterList.tsx              # Feed bencana dengan filter interaktif
│   ├── Footer.tsx                    # Kontak darurat & atribusi sumber resmi
│   ├── GlobalSearchModal.tsx         # Dialog pencarian global (Ctrl+K)
│   ├── InteractiveMap.tsx            # Peta GIS interaktif MapLibre GL
│   ├── LatestQuakeCard.tsx           # Showcase guncangan gempa bumi teranyar
│   ├── MitigationGuideView.tsx       # SOP keselamatan BNPB & skala MMI
│   ├── Navbar.tsx                    # Header navigasi & status koneksi
│   ├── RegionExplorerView.tsx        # Eksplorasi profil risiko daerah
│   ├── RiskMapView.tsx               # Visualisasi peringkat IRBI provinsi
│   └── StatsOverview.tsx             # Ringkasan 4 metrik utama
├── lib/                              # Utilities & Clients
│   ├── api-client.ts                 # Unified frontend API client
│   ├── bmkg.ts                       # BMKG data fetcher & parser
│   ├── cache.ts                      # In-memory TTL cache
│   └── inarisk-data.ts               # Dataset InaRISK & katalog GIS layers
├── types/                            # TypeScript interfaces
│   ├── disaster.ts                   # Tipe data bencana seismik & vulkanik
│   └── risk.ts                       # Tipe data IRBI & layer GIS
├── metadata.json                     # Metadata aplikasi AI Studio
├── package.json                      # Node.js dependencies
├── vercel.json                       # Konfigurasi Vercel deployment frontend
└── README.md                         # Dokumentasi lengkap
```

---

## 4. Cara Instalasi & Menjalankan Proyek

### Prasyarat:
- Node.js 18+ atau 20+
- Go 1.21+ (jika menjalankan Go backend secara mandiri)
- Koneksi internet aktif untuk polling data BMKG & tile peta GIS

### Menjalankan Frontend (Next.js)

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# Aplikasi dapat diakses di http://localhost:3000
```

### Menjalankan Backend (Golang Fiber)

```bash
# Masuk ke direktori backend
cd backend

# Download dependensi Go
go mod tidy

# Jalankan server
go run cmd/server/main.go

# Backend API akan aktif di http://localhost:8080/api
```

---

## 5. Daftar API Endpoints

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/health` | Status operasional gateway & sumber data |
| `GET` | `/api/disasters` | Daftar gabungan peristiwa bencana terkini |
| `GET` | `/api/disasters/latest` | Bencana teranyar yang tercatat |
| `GET` | `/api/disasters/:id` | Detail teknis peristiwa bencana tertentu |
| `GET` | `/api/earthquakes` | Daftar gempa bumi (M ≥ 5.0 & dirasakan) |
| `GET` | `/api/earthquakes/latest` | Gempa bumi teranyar dari autogempa BMKG |
| `GET` | `/api/earthquakes/significant` | Gempa bumi bermagnitudo ≥ 5.0 |
| `GET` | `/api/volcanoes` | Daftar status gunung api aktif Indonesia |
| `GET` | `/api/risk` | Ringkasan Indeks Risiko Bencana Indonesia (IRBI) |
| `GET` | `/api/risk/:type` | Analisis risiko per jenis bahaya |
| `GET` | `/api/regions` | Profil risiko 38 provinsi di Indonesia |
| `GET` | `/api/regions/:id` | Profil risiko provinsi / kabupaten tertentu |
| `GET` | `/api/map/layers` | Katalog layer bahaya ArcGIS REST InaRISK |
| `GET` | `/api/search?q=...` | Pencarian instan gempa, gunung api, atau wilayah |

### Contoh Response `/api/earthquakes/latest`

```json
{
  "success": true,
  "data": {
    "id": "bmkg-2025-09-06-081520",
    "type": "earthquake",
    "title": "Gempa M 5.2 - 85 km BaratDaya KAWALU-JABAR",
    "latitude": -7.92,
    "longitude": 108.12,
    "magnitude": 5.2,
    "depth": 10,
    "depthUnit": "km",
    "location": "85 km BaratDaya KAWALU-JABAR",
    "severity": "high",
    "occurredAt": "06 Sep 2025",
    "jam": "08:15:20",
    "source": "BMKG",
    "potential": "Tidak berpotensi tsunami",
    "tsunamiPotential": false,
    "felt": "III Kawalu, II Pangandaran, II Garut",
    "shakemapUrl": "https://data.bmkg.go.id/DataMKG/TEWS/20250906081520.mmi.cn.gif",
    "verified": true
  },
  "source": "BMKG",
  "cached": true,
  "timestamp": "2026-09-06T08:15:25.120Z"
}
```

---

## 6. Panduan Deployment

### Deployment ke Vercel

Proyek ini telah dilengkapi dengan berkas konfigurasi `vercel.json`:
- **Frontend**: Dideploy sebagai Next.js App Router secara otomatis oleh Vercel.
- **Backend (Go Fiber)**: Direktori `backend/api/index.go` menggunakan adapter `@vercel/go` untuk berjalan sebagai Serverless Function tanpa perlu server dedicated.

### Deployment ke Docker / Cloud Run

Untuk backend mandiri di Google Cloud Run atau Docker:

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY backend/ .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /server cmd/server/main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /server .
EXPOSE 8080
CMD ["./server"]
```

---

## 7. Keterbatasan Data & Layanan

1. **Jeda Waktu BMKG:** Parameter gempa bumi awal biasanya dirilis 3–5 menit setelah gempa terjadi dan diperbarui setelah verifikasi seismolog BMKG.
2. **Ketersediaan Shakemap:** Gambar peta goncangan (shakemap) hanya diproduksi oleh BMKG untuk gempa bumi signifikan (M ≥ 5.0 atau gempa dangkal berpotensi merusak).
3. **CORS & Rate Limiting:** Endpoint backend menggunakan caching TTL 30–60 detik untuk mematuhi etika polling layanan publik BMKG dan mencegah pemblokiran IP.

---

## 8. Kontak Darurat Kebencanaan

- **BNPB Call Center:** 117
- **Panggilan Darurat BPBD:** 112
- **Basarnas (Pencarian & Pertolongan):** 115
- **Call Center Cuaca & Gempa BMKG:** 196
