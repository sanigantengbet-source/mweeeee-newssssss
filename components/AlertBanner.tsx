'use client';

import React from 'react';
import { AlertTriangle, Waves, ChevronRight, X } from 'lucide-react';
import { Disaster } from '@/types/disaster';

interface AlertBannerProps {
  latestDisaster: Disaster | null;
  onSelectDisaster: (disaster: Disaster) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ latestDisaster, onSelectDisaster }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (!latestDisaster || dismissed) return null;

  const isTsunamiAlert = latestDisaster.tsunamiPotential;
  const isMajorEarthquake = (latestDisaster.magnitude || 0) >= 6.0;

  if (!isTsunamiAlert && !isMajorEarthquake) {
    return null;
  }

  return (
    <div
      id="emergency-alert-banner"
      className="relative z-30 border-b border-red-500/30 bg-red-950/90 text-red-100 px-4 py-2.5 shadow-sm backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>

          <div className="flex items-center gap-2">
            {isTsunamiAlert ? (
              <Waves className="h-4 w-4 text-red-300" strokeWidth={1.75} />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-300" strokeWidth={1.75} />
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold tracking-wider uppercase text-[10px] text-red-300 bg-red-900/60 px-2 py-0.5 rounded border border-red-500/40">
                {isTsunamiAlert ? 'PERINGATAN TSUNAMI' : 'GEMPA BUMI SIGNIFIKAN'}
              </span>
              <span className="text-xs font-medium text-white">
                {latestDisaster.title} ({latestDisaster.location})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectDisaster(latestDisaster)}
            className="flex items-center gap-1 text-xs font-medium bg-red-900/80 hover:bg-red-800 text-white px-2.5 py-1 rounded-md border border-red-500/40 transition"
          >
            Lihat Detail
            <ChevronRight className="h-3 w-3" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-md p-1 text-red-300 hover:text-white hover:bg-red-900/50 transition"
            title="Tutup Peringatan"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
};
