'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Map, 
  Flame, 
  ShieldAlert, 
  Compass, 
  BookOpen, 
  PhoneCall, 
  X, 
  ArrowUp,
  AlertTriangle,
  LifeBuoy
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation';
  setActiveTab: (tab: 'dashboard' | 'map' | 'volcanoes' | 'risk' | 'regions' | 'mitigation') => void;
  siagaVolcanoCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  siagaVolcanoCount = 0,
}) => {
  const [showEmergency, setShowEmergency] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Activity },
    { id: 'map' as const, label: 'Peta', icon: Map },
    { 
      id: 'volcanoes' as const, 
      label: 'Gunung Api', 
      icon: Flame, 
      badge: siagaVolcanoCount > 0 ? `${siagaVolcanoCount}` : undefined 
    },
    { id: 'risk' as const, label: 'Risiko', icon: ShieldAlert },
    { id: 'regions' as const, label: 'Wilayah', icon: Compass },
    { id: 'mitigation' as const, label: 'Mitigasi', icon: BookOpen },
  ];

  return (
    <>
      {/* Discreet Scroll to Top only when user scrolls deep down */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-16 right-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] shadow-md backdrop-blur-md active:scale-90 transition md:hidden"
        >
          <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      )}

      {/* Emergency Hotlines Modal / Bottom Sheet */}
      {showEmergency && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <LifeBuoy className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[var(--gh-text)]">Nomor Darurat Kebencanaan</h3>
                  <span className="text-[10px] text-[var(--gh-text-muted)]">Panggilan Darurat Bebas Pulsa / Hotline</span>
                </div>
              </div>
              <button
                onClick={() => setShowEmergency(false)}
                className="rounded-md p-1.5 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-surface-raised)] transition"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:112"
                className="flex flex-col p-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/15 transition text-center"
              >
                <span className="text-xl font-bold text-red-500 font-mono">112</span>
                <span className="font-medium text-[var(--gh-text)] mt-0.5">Call Center Darurat</span>
                <span className="text-[10px] text-[var(--gh-text-muted)]">Bebas Pulsa Nasional</span>
              </a>

              <a
                href="tel:115"
                className="flex flex-col p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 transition text-center"
              >
                <span className="text-xl font-bold text-amber-500 font-mono">115</span>
                <span className="font-medium text-[var(--gh-text)] mt-0.5">BASARNAS (SAR)</span>
                <span className="text-[10px] text-[var(--gh-text-muted)]">Pencarian & Pertolongan</span>
              </a>

              <a
                href="tel:117"
                className="flex flex-col p-3 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-surface-raised)] hover:border-[var(--gh-border-active)] transition text-center"
              >
                <span className="text-xl font-bold text-[var(--gh-text)] font-mono">117</span>
                <span className="font-medium text-[var(--gh-text)] mt-0.5">Posko BNPB</span>
                <span className="text-[10px] text-[var(--gh-text-muted)]">Pusdalops Kebencanaan</span>
              </a>

              <a
                href="tel:119"
                className="flex flex-col p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 transition text-center"
              >
                <span className="text-xl font-bold text-emerald-500 font-mono">119</span>
                <span className="font-medium text-[var(--gh-text)] mt-0.5">Ambulans Medis</span>
                <span className="text-[10px] text-[var(--gh-text-muted)]">Kemenkes RI</span>
              </a>
            </div>

            <div className="rounded-lg bg-[var(--gh-surface-raised)] p-3 border border-[var(--gh-border)] text-[11px] text-[var(--gh-text-muted)]">
              <span className="font-semibold text-[var(--gh-text)] block mb-0.5">Tips Cepat:</span>
              Tetap tenang, sebutkan lokasi spesifik Anda, jumlah korban bila ada, dan jalur aman terdekat kepada operator penanganan bencana.
            </div>
          </div>
        </div>
      )}

      {/* Main Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[var(--gh-border)] bg-[var(--gh-surface)]/95 backdrop-blur-md shadow-lg px-1.5 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-6 items-center gap-0.5 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all duration-150 min-h-[48px] ${
                  isActive
                    ? 'text-[var(--gh-text)] bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] font-semibold shadow-xs'
                    : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] active:scale-95'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[var(--gh-text)]' : 'text-[var(--gh-text-muted)]'}`} strokeWidth={1.75} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white ring-1 ring-[var(--gh-surface)]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap leading-tight truncate w-full text-center ${
                  isActive ? 'text-[var(--gh-text)] font-semibold' : 'text-[var(--gh-text-muted)] font-normal'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
