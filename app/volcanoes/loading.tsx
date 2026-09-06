'use client';

import React from 'react';
import { VolcanoMonitorSkeleton } from '@/components/LoadingSkeletons';

export default function VolcanoesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="w-full border-b border-slate-800 bg-slate-950/90 py-3 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 rounded-lg bg-slate-800 animate-pulse" />
            <div className="h-8 w-8 rounded-lg bg-slate-800 animate-pulse" />
            <div className="h-4 w-44 rounded bg-slate-800 animate-pulse" />
          </div>
          <div className="h-8 w-28 rounded-lg bg-slate-800 animate-pulse" />
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <VolcanoMonitorSkeleton />
      </main>
    </div>
  );
}
