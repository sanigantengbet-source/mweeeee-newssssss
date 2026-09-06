'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { AlertBanner } from '@/components/AlertBanner';
import { StatsOverview } from '@/components/StatsOverview';
import { LatestQuakeCard } from '@/components/LatestQuakeCard';
import { InteractiveMap } from '@/components/InteractiveMap';
import { DisasterList } from '@/components/DisasterList';
import { DisasterDetailModal } from '@/components/DisasterDetailModal';
import { RiskMapView } from '@/components/RiskMapView';
import { RegionExplorerView } from '@/components/RegionExplorerView';
import { MitigationGuideView } from '@/components/MitigationGuideView';
import { VolcanoMonitorView } from '@/components/VolcanoMonitorView';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';

import { EarthquakeDetail, VolcanoDetail, Disaster } from '@/types/disaster';
import { RegionRiskProfile, GisLayerConfig } from '@/types/risk';
import { OFFICIAL_ACTIVE_VOLCANOES, INARISK_GIS_LAYERS, OFFICIAL_PROVINCE_RISK } from '@/lib/inarisk-data';
import { Flame } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation'>('dashboard');

  // State data
  const [latestQuake, setLatestQuake] = useState<EarthquakeDetail | null>(null);
  const [earthquakes, setEarthquakes] = useState<EarthquakeDetail[]>([]);
  const [volcanoes, setVolcanoes] = useState<VolcanoDetail[]>(OFFICIAL_ACTIVE_VOLCANOES);
  const [provinces, setProvinces] = useState<RegionRiskProfile[]>(OFFICIAL_PROVINCE_RISK);
  const [riskLayers, setRiskLayers] = useState<GisLayerConfig[]>(INARISK_GIS_LAYERS);

  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Interaction modals & focus
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; title?: string } | null>(null);

  const siagaVolcanoCount = React.useMemo(() => {
    return volcanoes.filter((v) => {
      const lvl = (v.alertLevel || v.status || '').toLowerCase();
      return (
        lvl.includes('siaga') ||
        lvl.includes('awas') ||
        lvl.includes('level 3') ||
        lvl.includes('level 4') ||
        lvl.includes('level iii') ||
        lvl.includes('level iv')
      );
    }).length;
  }, [volcanoes]);

  // Fetch real data from our API gateway
  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // 1. Fetch latest earthquake
      const resLatest = await fetch('/api/earthquakes/latest', { cache: 'no-store' });
      const dataLatest = await resLatest.json();
      if (dataLatest.success && dataLatest.data) {
        setLatestQuake(dataLatest.data);
      }

      // 2. Fetch recent earthquakes list
      const resQuakes = await fetch('/api/earthquakes', { cache: 'no-store' });
      const dataQuakes = await resQuakes.json();
      if (dataQuakes.success && dataQuakes.data) {
        setEarthquakes(dataQuakes.data);
      }

      // 3. Fetch volcanoes from PVMBG / MAGMA
      const resVolcanoes = await fetch('/api/volcanoes', { cache: 'no-store' });
      const dataVolcanoes = await resVolcanoes.json();
      if (dataVolcanoes.success && Array.isArray(dataVolcanoes.data)) {
        const mapped = dataVolcanoes.data
          .filter((v: any) => v.latitude != null && v.longitude != null)
          .map((v: any) => ({
            id: v.id,
            name: v.name,
            latitude: v.latitude,
            longitude: v.longitude,
            elevationMeters: v.elevation,
            province: v.province,
            alertLevel: v.status || 'Level I (Normal)',
            statusColor: v.statusColor || '#059669',
            lastActivity: v.lastActivity || v.status,
            source: 'PVMBG / MAGMA Indonesia',
            reportUrl: v.reportUrl,
            recommendation: v.recommendation,
          }));
        if (mapped.length > 0) {
          setVolcanoes(mapped);
        }
      }

      // 4. Fetch risk overview
      const resRisk = await fetch('/api/risk', { cache: 'no-store' });
      const dataRisk = await resRisk.json();
      if (dataRisk.success && dataRisk.provinces) {
        setProvinces(dataRisk.provinces);
      }

      // 5. Fetch layers
      const resLayers = await fetch('/api/map/layers', { cache: 'no-store' });
      const dataLayers = await resLayers.json();
      if (dataLayers.success && dataLayers.data) {
        setRiskLayers(dataLayers.data);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching disaster data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load & automatic polling every 60 seconds for live BMKG updates
  useEffect(() => {
    let isMounted = true;

    // Check URL parameters on mount
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const tab = searchParams.get('tab');
        if (tab === 'volcanoes' || tab === 'map' || tab === 'risk' || tab === 'regions' || tab === 'mitigation' || tab === 'dashboard') {
          setActiveTab(tab as any);
        }
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const name = searchParams.get('name');
        if (lat && lng) {
          setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lng), title: name || undefined });
        }
      }
    }, 0);

    const runInitialFetch = async () => {
      await loadData(false);
    };
    runInitialFetch();

    const interval = setInterval(() => {
      if (isMounted) {
        loadData(true);
      }
    }, 60000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [loadData]);

  // Handler for focusing on map
  const handleFocusMap = (lat: number, lng: number, title?: string) => {
    setSelectedLocation({ lat, lng, title });
    setActiveTab('map');
  };

  // Handler for province selection from search
  const handleSelectProvinceByName = (name: string) => {
    const prov = provinces.find((p) => p.provinceName.toLowerCase().includes(name.toLowerCase()));
    if (prov) {
      setActiveTab('regions');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Sticky Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Emergency Alert Banner for M >= 6.0 or Tsunami */}
      <AlertBanner
        latestDisaster={
          latestQuake
            ? {
                id: latestQuake.id,
                type: 'earthquake',
                title: latestQuake.title,
                latitude: latestQuake.latitude,
                longitude: latestQuake.longitude,
                magnitude: latestQuake.magnitude,
                depth: latestQuake.depth,
                depthUnit: 'km',
                location: latestQuake.location,
                severity: latestQuake.severity,
                occurredAt: latestQuake.occurredAt,
                source: 'BMKG',
                potential: latestQuake.potential,
                tsunamiPotential: latestQuake.tsunamiPotential,
                shakemapUrl: latestQuake.shakemapUrl,
                verified: true,
              }
            : null
        }
        onSelectDisaster={(d) => setSelectedDisaster(d)}
      />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 pb-24 md:pb-6">
        {/* Tab 1: Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Stat Metrics */}
            <StatsOverview
              latestQuake={latestQuake}
              allEarthquakes={earthquakes}
              volcanoes={volcanoes}
              provinces={provinces}
              isLoading={loading}
              onOpenQuakeTab={() => setActiveTab('dashboard')}
              onOpenVolcanoTab={() => setActiveTab('volcanoes')}
              onOpenRiskTab={() => setActiveTab('risk')}
            />

            {/* Volcano Quick Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-4 shadow-sm transition-colors duration-150">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0">
                  <Flame className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--gh-text)] uppercase tracking-wider">
                      Volcano Monitor Indonesia (PVMBG / MAGMA)
                    </span>
                    <span className="text-[10px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded font-medium">
                      AKTIF
                    </span>
                  </div>
                  <p className="text-xs text-[var(--gh-text-muted)]">
                    {volcanoes.length} gunung api dipantau secara resmi. Pantau status Level I-IV &amp; riwayat erupsi terkini.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('volcanoes')}
                className="self-start sm:self-center shrink-0 rounded-md bg-[var(--gh-surface-raised)] hover:bg-[var(--gh-btn-hover)] text-[var(--gh-text)] border border-[var(--gh-border)] hover:border-[var(--gh-border-active)] px-3 py-1.5 text-xs font-medium transition"
              >
                Buka Volcano Monitor &rarr;
              </button>
            </div>

            {/* Showcase Card for Latest Quake */}
            <LatestQuakeCard
              quake={latestQuake}
              isLoading={loading}
              onViewOnMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
              onOpenDetails={(q) => {
                setSelectedDisaster({
                  id: q.id,
                  type: 'earthquake',
                  title: q.title,
                  latitude: q.latitude,
                  longitude: q.longitude,
                  magnitude: q.magnitude,
                  depth: q.depth,
                  depthUnit: 'km',
                  location: q.location,
                  severity: q.severity,
                  occurredAt: q.occurredAt,
                  source: 'BMKG',
                  potential: q.potential,
                  felt: q.felt,
                  shakemapUrl: q.shakemapUrl,
                  verified: true,
                });
              }}
            />

            {/* Interactive Map & Live Disasters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--gh-text)]">
                    Peta Pantauan Bencana Interaktif
                  </h2>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="text-xs font-medium text-[var(--gh-accent)] hover:underline transition"
                  >
                    Buka Mode Layar Penuh &rarr;
                  </button>
                </div>
                <InteractiveMap
                  earthquakes={earthquakes}
                  volcanoes={volcanoes}
                  latestQuake={latestQuake}
                  riskLayers={riskLayers}
                  selectedLocation={selectedLocation}
                  onSelectDisaster={(d) => setSelectedDisaster(d)}
                />
              </div>

              <div className="lg:col-span-5">
                <DisasterList
                  earthquakes={earthquakes}
                  volcanoes={volcanoes}
                  isLoading={loading}
                  onFocusMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
                  onSelectDisaster={(d) => setSelectedDisaster(d)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Map View */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[var(--gh-text)]">Peta Interaktif Kebencanaan Indonesia</h1>
                <p className="text-xs text-[var(--gh-text-muted)]">
                  Visualisasi GIS seismik BMKG, PVMBG, dan layer bahaya InaRISK BNPB
                </p>
              </div>
              <span className="rounded-md bg-[var(--gh-surface)] border border-[var(--gh-border)] px-2.5 py-1 font-mono text-xs text-[var(--gh-text-muted)]">
                WGS 84 • EPSG:4326
              </span>
            </div>

            <InteractiveMap
              earthquakes={earthquakes}
              volcanoes={volcanoes}
              latestQuake={latestQuake}
              riskLayers={riskLayers}
              selectedLocation={selectedLocation}
              onSelectDisaster={(d) => setSelectedDisaster(d)}
            />
          </div>
        )}

        {/* Tab 3: Risk Map (IRBI BNPB) */}
        {activeTab === 'risk' && (
          <RiskMapView
            provinces={provinces}
            riskLayers={riskLayers}
            isLoading={loading}
            onSelectProvince={(prov) => {
              // open province view
            }}
          />
        )}

        {/* Tab 4: Region Explorer */}
        {activeTab === 'regions' && (
          <RegionExplorerView
            provinces={provinces}
            isLoading={loading}
            onFocusMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
          />
        )}

        {/* Tab 5: Mitigation & Safety Guides */}
        {activeTab === 'mitigation' && <MitigationGuideView />}

        {/* Tab 6: Volcano Monitor (PVMBG / MAGMA) */}
        {activeTab === 'volcanoes' && (
          <VolcanoMonitorView
            onFocusMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        siagaVolcanoCount={siagaVolcanoCount}
      />

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onFocusMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
        onSelectDisaster={(d) => setSelectedDisaster(d)}
        onSelectProvinceByName={handleSelectProvinceByName}
      />

      {/* Disaster Technical Detail Modal */}
      <DisasterDetailModal
        disaster={selectedDisaster}
        onClose={() => setSelectedDisaster(null)}
        onViewOnMap={(lat, lng, title) => handleFocusMap(lat, lng, title)}
      />

      {/* Standard Footer */}
      <Footer />
    </div>
  );
}
