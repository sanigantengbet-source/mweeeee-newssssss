'use client';

import React from 'react';
import { 
  Activity, 
  Map, 
  ShieldAlert, 
  Compass, 
  BookOpen, 
  Search, 
  RefreshCw, 
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface NavbarProps {
  activeTab: 'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation';
  setActiveTab: (tab: 'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  lastUpdated,
  onOpenSearch,
}) => {
  const { theme, toggleTheme } = useTheme();

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--gh-surface)]/95 backdrop-blur-md shadow-xs border-b border-[var(--gh-border)] transition-colors duration-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative p-0.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] shadow-xs transition-transform duration-200 group-hover:scale-105">
            <img
              src="/logo.png"
              alt="Logo Indonesia Disaster Monitor"
              className="h-9 w-9 rounded-[10px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-[var(--gh-text)] sm:text-base group-hover:text-[var(--gh-accent)] transition-colors">
                Indonesia Disaster Monitor
              </span>
              <span className="hidden rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20 sm:inline-block">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-[var(--gh-text-muted)] hidden sm:block">
              Data Resmi BMKG & BNPB / InaRISK • Non-AI
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs: GitHub-style Segmented Control */}
        <nav className="hidden lg:flex items-center gap-0.5 rounded-xl bg-[var(--gh-bg)] p-1 border border-[var(--gh-border)]">
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] shadow-xs border border-[var(--gh-border)] font-semibold'
                : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]/60'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />
            Dashboard
          </button>
          <button
            id="nav-tab-map"
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'map'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] shadow-xs border border-[var(--gh-border)] font-semibold'
                : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]/60'
            }`}
          >
            <Map className="h-3.5 w-3.5 text-blue-500" strokeWidth={1.75} />
            Peta Interaktif
          </button>
          <button
            id="nav-tab-volcanoes"
            onClick={() => setActiveTab('volcanoes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'volcanoes'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] shadow-xs border border-[var(--gh-border)] font-semibold'
                : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]/60'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />
            Gunung Api
          </button>
          <button
            id="nav-tab-risk"
            onClick={() => setActiveTab('risk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'risk'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] shadow-xs border border-[var(--gh-border)] font-semibold'
                : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]/60'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-indigo-500" strokeWidth={1.75} />
            Peta Risiko (IRBI)
          </button>
          <button
            id="nav-tab-regions"
            onClick={() => setActiveTab('regions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'regions'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] shadow-xs border border-[var(--gh-border)] font-semibold'
                : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]/60'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.75} />
            Eksplorasi Wilayah
          </button>
          <button
            id="nav-tab-mitigation"
            onClick={() => setActiveTab('mitigation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'mitigation'
                ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] shadow-xs border border-[var(--gh-border)] font-semibold'
                : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)]/60'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-teal-500" strokeWidth={1.75} />
            Panduan Mitigasi
          </button>
        </nav>

        {/* Action Controls: Search, Theme Toggle, Refresh */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            id="btn-global-search"
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg bg-[var(--gh-surface-raised)] px-2.5 py-1.5 text-xs text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] border border-[var(--gh-border)] hover:border-[var(--gh-border-active)] transition shadow-xs"
            title="Cari Bencana atau Wilayah (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="hidden md:inline">Cari Wilayah / Bencana...</span>
            <kbd className="hidden md:inline rounded bg-[var(--gh-bg)] border border-[var(--gh-border)] px-1.5 py-0.2 text-[10px] text-[var(--gh-text-muted)]">
              /
            </kbd>
          </button>

          {/* Theme Toggle Button (Dark / Light Mode) */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--gh-surface-raised)] px-2.5 py-1.5 text-xs font-medium text-[var(--gh-text)] hover:text-[var(--gh-accent)] border border-[var(--gh-border)] hover:border-[var(--gh-border-active)] transition shadow-xs"
            title={theme === 'dark' ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (GitHub Dark)'}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />
                <span className="hidden sm:inline text-[11px]">Terang</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-indigo-500" strokeWidth={1.75} />
                <span className="hidden sm:inline text-[11px]">Gelap</span>
              </>
            )}
          </button>

          {/* Refresh Button */}
          <button
            id="btn-refresh-data"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--gh-surface-raised)] px-2.5 py-1.5 text-xs font-medium text-[var(--gh-text)] hover:text-[var(--gh-accent)] border border-[var(--gh-border)] hover:border-[var(--gh-border-active)] transition disabled:opacity-50 shadow-xs"
            title="Perbarui Data BMKG & InaRISK"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-rose-500 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={1.75} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="hidden xl:flex flex-col text-right pl-2 border-l border-[var(--gh-border)] text-[10px] text-[var(--gh-text-muted)]">
            <span>Pembaruan:</span>
            <span className="font-mono text-[var(--gh-text)]">{formatTime(lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Tab Navigation */}
      <div className="flex lg:hidden overflow-x-auto bg-[var(--gh-surface)] px-3 py-1.5 no-scrollbar gap-1 border-t border-[var(--gh-border)]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            activeTab === 'dashboard'
              ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold border border-[var(--gh-border)]'
              : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
          }`}
        >
          <Activity className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            activeTab === 'map'
              ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold border border-[var(--gh-border)]'
              : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
          }`}
        >
          <Map className="h-3.5 w-3.5 text-blue-500" strokeWidth={1.75} />
          Peta
        </button>
        <button
          onClick={() => setActiveTab('volcanoes')}
          className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            activeTab === 'volcanoes'
              ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold border border-[var(--gh-border)]'
              : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
          }`}
        >
          <Flame className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />
          Gunung Api
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            activeTab === 'risk'
              ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold border border-[var(--gh-border)]'
              : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5 text-indigo-500" strokeWidth={1.75} />
          Risiko
        </button>
        <button
          onClick={() => setActiveTab('regions')}
          className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            activeTab === 'regions'
              ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold border border-[var(--gh-border)]'
              : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
          }`}
        >
          <Compass className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.75} />
          Wilayah
        </button>
        <button
          onClick={() => setActiveTab('mitigation')}
          className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            activeTab === 'mitigation'
              ? 'bg-[var(--gh-surface-raised)] text-[var(--gh-text)] font-semibold border border-[var(--gh-border)]'
              : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5 text-teal-500" strokeWidth={1.75} />
          Mitigasi
        </button>
      </div>
    </header>
  );
};
