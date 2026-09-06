'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { 
  Layers, 
  Eye, 
  MapPin, 
  Flame, 
  Mountain, 
  Waves, 
  Compass, 
  Info, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  X
} from 'lucide-react';
import { EarthquakeDetail, VolcanoDetail, Disaster } from '@/types/disaster';
import { GisLayerConfig } from '@/types/risk';

interface InteractiveMapProps {
  earthquakes: EarthquakeDetail[];
  volcanoes: VolcanoDetail[];
  latestQuake: EarthquakeDetail | null;
  riskLayers: GisLayerConfig[];
  selectedLocation?: { lat: number; lng: number; title?: string } | null;
  onSelectDisaster: (disaster: Disaster) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  earthquakes,
  volcanoes,
  latestQuake,
  riskLayers,
  selectedLocation,
  onSelectDisaster,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Filter states
  const [showM5Quakes, setShowM5Quakes] = useState(true);
  const [showFeltQuakes, setShowFeltQuakes] = useState(true);
  const [showVolcanoes, setShowVolcanoes] = useState(true);
  const [activeGisLayer, setActiveGisLayer] = useState<string>('none');
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'streets'>('streets');
  const [showLegend, setShowLegend] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Map Tile Style definitions (fast and reliable open raster/vector tile servers)
  const mapStyles = {
    dark: {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          ],
          tileSize: 256,
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        },
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
    streets: {
      version: 8,
      sources: {
        'carto-voyager': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          ],
          tileSize: 256,
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        },
      },
      layers: [
        {
          id: 'carto-voyager-layer',
          type: 'raster',
          source: 'carto-voyager',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
    satellite: {
      version: 8,
      sources: {
        'esri-sat': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '&copy; Esri & Maxar',
        },
      },
      layers: [
        {
          id: 'esri-sat-layer',
          type: 'raster',
          source: 'esri-sat',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  };

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyles.streets as any,
      center: [118.0149, -2.5489], // Center of Indonesian Archipelago
      zoom: 4.4,
      minZoom: 3.5,
      maxZoom: 14,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Switch Base Style
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(mapStyles[mapStyle] as any);
  }, [mapStyle]);

  // Handle selected location focus
  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return;
    mapRef.current.flyTo({
      center: [selectedLocation.lng, selectedLocation.lat],
      zoom: 8,
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  }, [selectedLocation]);

  // Update Markers (Earthquakes & Volcanoes)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Helper: Create customized DOM marker
    const createMarkerEl = (
      bgColor: string,
      size: number,
      pulse: boolean = false,
      label?: string,
      iconType?: 'quake' | 'volcano'
    ) => {
      const el = document.createElement('div');
      el.className = 'relative flex items-center justify-center cursor-pointer select-none';
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      if (pulse) {
        const pulseRing = document.createElement('div');
        pulseRing.className = 'absolute inset-0 rounded-full epicenter-ring';
        pulseRing.style.backgroundColor = bgColor;
        pulseRing.style.opacity = '0.5';
        el.appendChild(pulseRing);
      }

      const inner = document.createElement('div');
      inner.className = 'relative flex items-center justify-center rounded-full text-white font-bold shadow-lg transition-transform hover:scale-125';
      inner.style.width = `${size}px`;
      inner.style.height = `${size}px`;
      inner.style.backgroundColor = bgColor;
      inner.style.border = '2px solid rgba(255, 255, 255, 0.9)';
      inner.style.fontSize = size > 26 ? '11px' : '9px';

      if (label) {
        inner.innerText = label;
      } else if (iconType === 'volcano') {
        inner.innerText = '▲';
      }

      el.appendChild(inner);
      return el;
    };

    // 1. Add Earthquakes
    earthquakes.forEach((eq) => {
      if (eq.latitude === undefined || eq.longitude === undefined) return;

      const isM5 = (eq.magnitude || 0) >= 5.0;
      if (isM5 && !showM5Quakes) return;
      if (!isM5 && !showFeltQuakes) return;

      const isLatest = latestQuake?.id === eq.id;
      const mag = eq.magnitude || 4.0;
      const size = Math.max(22, Math.min(42, Math.round(mag * 6)));

      let color = '#3b82f6'; // blue
      if (mag >= 6.5) color = '#dc2626'; // red
      else if (mag >= 5.0) color = '#f97316'; // orange
      else if (mag >= 4.0) color = '#eab308'; // yellow

      const markerEl = createMarkerEl(color, size, isLatest, mag.toFixed(1), 'quake');

      // Popup content
      const popupHtml = `
        <div class="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 max-w-xs shadow-2xl">
          <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-rose-400">Gempa Bumi BMKG</span>
            <span class="px-2 py-0.5 text-xs font-black rounded ${mag >= 5.0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'}">
              M ${mag.toFixed(1)}
            </span>
          </div>
          <p class="font-bold text-sm text-white leading-tight mb-2">${eq.location}</p>
          <div class="space-y-1 text-xs text-slate-300 mb-3">
            <div>Kedalaman: <strong class="text-white">${eq.depth} km</strong></div>
            <div>Waktu: <span>${eq.occurredAt}</span></div>
            <div>Status: <span class="${eq.tsunamiPotential ? 'text-red-400 font-bold' : 'text-emerald-400'}">${eq.potential || 'Tidak berpotensi tsunami'}</span></div>
          </div>
          ${eq.felt ? `<div class="p-2 bg-slate-950 rounded text-[11px] text-amber-300 font-mono mb-2">MMI: ${eq.felt}</div>` : ''}
          <button id="popup-detail-${eq.id}" class="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold transition text-center block">
            Buka Detail Lengkap
          </button>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 15, closeButton: false }).setHTML(popupHtml);

      popup.on('open', () => {
        const btn = document.getElementById(`popup-detail-${eq.id}`);
        if (btn) {
          btn.onclick = () => {
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
          };
        }
      });

      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([eq.longitude, eq.latitude])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // 2. Add Volcanoes
    if (showVolcanoes) {
      volcanoes.forEach((v) => {
        if (!v.latitude || !v.longitude) return;

        const markerEl = createMarkerEl(v.statusColor, 24, false, undefined, 'volcano');
        const alertLabel = v.alertLevel || v.status || 'Level I (Normal)';
        const elevationText = (v.elevationMeters || v.elevation) ? `${(v.elevationMeters || v.elevation)?.toLocaleString('id-ID')} mdpl` : '-';
        const sourceText = v.source || 'PVMBG / MAGMA Indonesia';

        const popupHtml = `
          <div class="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 max-w-xs shadow-2xl">
            <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-rose-400">Gunung Api Aktif</span>
              <span class="px-2 py-0.5 text-xs font-bold rounded" style="background-color: ${v.statusColor}33; color: ${v.statusColor}">
                ${alertLabel}
              </span>
            </div>
            <h4 class="font-bold text-base text-white">${v.name}</h4>
            <div class="space-y-1 text-xs text-slate-300 mt-2 mb-3">
              <div>Ketinggian: <strong>${elevationText}</strong></div>
              <div>Provinsi: <strong>${v.province}</strong></div>
              ${v.lastActivity ? `<div>Aktivitas: <span class="text-slate-200">${v.lastActivity}</span></div>` : ''}
              ${v.recommendation ? `<div class="p-2 bg-slate-950/80 rounded border border-slate-800 text-[11px] text-amber-300 line-clamp-3 mt-1">${v.recommendation}</div>` : ''}
            </div>
            <span class="text-[10px] text-slate-400 block mb-2">Sumber: ${sourceText}</span>
            <div class="flex items-center gap-2">
              <a href="/volcanoes/${v.id}" class="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold transition text-center block">
                Buka Detail Lengkap
              </a>
              <button id="popup-volcano-${v.id}" class="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition text-center block">
                Info Cepat
              </button>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 15, closeButton: false }).setHTML(popupHtml);

        popup.on('open', () => {
          const btn = document.getElementById(`popup-volcano-${v.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectDisaster({
                id: v.id,
                type: 'volcano',
                title: `${v.name} (${alertLabel})`,
                latitude: v.latitude,
                longitude: v.longitude,
                location: `${v.name}, ${v.province}`,
                province: v.province,
                severity: alertLabel.includes('Siaga') || alertLabel.includes('Awas') ? 'high' : 'moderate',
                occurredAt: new Date().toISOString(),
                source: 'PVMBG / MAGMA Indonesia',
                potential: v.recommendation || v.lastActivity || alertLabel,
                verified: true,
              });
            };
          }
        });

        const marker = new maplibregl.Marker({ element: markerEl })
          .setLngLat([v.longitude, v.latitude])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  }, [earthquakes, volcanoes, latestQuake, showM5Quakes, showFeltQuakes, showVolcanoes]);

  // Active GIS Layer details for Legend
  const currentGisLayer = riskLayers.find((l) => l.id === activeGisLayer);

  return (
    <div id="interactive-map-wrapper" className="relative h-[420px] sm:h-[480px] lg:h-[560px] w-full overflow-hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] shadow-sm">
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Top Left: Compact Collapsible Layer Filter */}
      <div className="absolute top-3 left-3 z-10">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface)]/95 px-3 py-1.5 text-xs font-semibold text-[var(--gh-text)] shadow-md backdrop-blur-md hover:bg-[var(--gh-surface-raised)] active:scale-95 transition"
        >
          <Layers className="h-3.5 w-3.5 text-red-500" strokeWidth={1.75} />
          <span>Filter Layer</span>
          <ChevronDown className={`h-3 w-3 text-[var(--gh-text-muted)] transition-transform duration-200 ${showLayerMenu ? 'rotate-180' : ''}`} strokeWidth={1.75} />
        </button>

        {showLayerMenu && (
          <div className="mt-2 w-72 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)]/95 p-3.5 shadow-xl backdrop-blur-md space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150 text-xs text-[var(--gh-text)]">
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-2">
              <span className="font-bold uppercase tracking-wider text-[var(--gh-text)] text-[11px] flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-red-500" strokeWidth={1.75} />
                Layer Bencana
              </span>
              <button
                onClick={() => setShowLayerMenu(false)}
                className="rounded p-1 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-2 pt-0.5">
              <label className="flex items-center justify-between cursor-pointer text-[var(--gh-text)] hover:opacity-80">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                  Gempa M &ge; 5.0 (BMKG)
                </span>
                <input
                  type="checkbox"
                  checked={showM5Quakes}
                  onChange={(e) => setShowM5Quakes(e.target.checked)}
                  className="rounded border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-red-600 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-[var(--gh-text)] hover:opacity-80">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                  Gempa Dirasakan (MMI)
                </span>
                <input
                  type="checkbox"
                  checked={showFeltQuakes}
                  onChange={(e) => setShowFeltQuakes(e.target.checked)}
                  className="rounded border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-red-600 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-[var(--gh-text)] hover:opacity-80">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  Gunung Api Aktif (PVMBG)
                </span>
                <input
                  type="checkbox"
                  checked={showVolcanoes}
                  onChange={(e) => setShowVolcanoes(e.target.checked)}
                  className="rounded border-[var(--gh-border)] bg-[var(--gh-surface-raised)] text-red-600 focus:ring-0"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-[var(--gh-border)]">
              <span className="block text-[10px] font-semibold text-[var(--gh-text-muted)] mb-1">
                Layer Bahaya InaRISK BNPB:
              </span>
              <select
                value={activeGisLayer}
                onChange={(e) => setActiveGisLayer(e.target.value)}
                className="w-full rounded-md border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] px-2 py-1 text-xs text-[var(--gh-text)] focus:border-[var(--gh-border-active)] focus:outline-none"
              >
                <option value="none">Tanpa Layer InaRISK</option>
                {riskLayers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Top Right: Basemap Selector & Quick Zoom */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <div className="flex rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface)]/95 p-0.5 backdrop-blur-md shadow-md text-[11px] font-medium text-[var(--gh-text-muted)]">
          <button
            onClick={() => setMapStyle('streets')}
            className={`px-2 py-1 rounded-md transition ${mapStyle === 'streets' ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold shadow-sm' : 'hover:text-[var(--gh-text)]'}`}
          >
            Terang
          </button>
          <button
            onClick={() => setMapStyle('dark')}
            className={`px-2 py-1 rounded-md transition ${mapStyle === 'dark' ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold shadow-sm' : 'hover:text-[var(--gh-text)]'}`}
          >
            Gelap
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-2 py-1 rounded-md transition ${mapStyle === 'satellite' ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold shadow-sm' : 'hover:text-[var(--gh-text)]'}`}
          >
            Satelit
          </button>
        </div>

        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo({ center: [118.0149, -2.5489], zoom: 4.4 });
            }
          }}
          className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface)]/95 p-1.5 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)] backdrop-blur-md shadow-md transition active:scale-95"
          title="Reset Tampilan Indonesia"
        >
          <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Bottom Left: Interactive GIS Dynamic Legend (Collapsible) */}
      <div className="absolute bottom-3 left-3 z-10">
        {!showLegend ? (
          <button
            onClick={() => setShowLegend(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface)]/95 px-2.5 py-1 text-[11px] font-medium text-[var(--gh-text)] backdrop-blur-md shadow-md hover:bg-[var(--gh-surface-raised)] active:scale-95 transition"
          >
            <Info className="h-3 w-3 text-red-500" strokeWidth={1.75} />
            <span>Legenda</span>
          </button>
        ) : (
          <div className="w-64 sm:w-72 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)]/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150 text-[var(--gh-text)]">
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-1.5">
              <span className="font-bold uppercase tracking-wider text-[var(--gh-text)] text-[10px] flex items-center gap-1.5">
                <Info className="h-3 w-3 text-red-500" strokeWidth={1.75} />
                Legenda Simbol Peta
              </span>
              <button
                onClick={() => setShowLegend(false)}
                className="rounded p-0.5 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Earthquake Magnitude Legend */}
            <div className="space-y-1">
              <span className="text-[9px] font-semibold text-[var(--gh-text-muted)] uppercase">Magnitudo:</span>
              <div className="flex items-center justify-between text-[10px] text-[var(--gh-text-muted)]">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-600"></span> &ge;6.5
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-500"></span> 5.0-6.4
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span> &lt;5.0
                </span>
              </div>
            </div>

            {/* Volcano Status Legend */}
            <div className="space-y-1">
              <span className="text-[9px] font-semibold text-[var(--gh-text-muted)] uppercase">Gunung Api:</span>
              <div className="flex items-center justify-between text-[10px] text-[var(--gh-text-muted)]">
                <span className="flex items-center gap-1">
                  <span className="text-orange-500 font-bold text-xs">▲</span> Siaga
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400 font-bold text-xs">▲</span> Waspada
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-500 font-bold text-xs">▲</span> Normal
                </span>
              </div>
            </div>

            {/* InaRISK Layer Specific Legend if active */}
            {currentGisLayer && (
              <div className="pt-1.5 border-t border-[var(--gh-border)]">
                <span className="text-[10px] font-bold text-red-500 block mb-1">
                  {currentGisLayer.name}:
                </span>
                <div className="space-y-0.5">
                  {currentGisLayer.legend.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-[var(--gh-text-muted)]">
                      <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
