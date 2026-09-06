'use client';

import React from 'react';
import { DashboardSkeleton } from '@/components/LoadingSkeletons';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header skeleton placeholder */}
      <div className="w-full border-b border-slate-800 bg-slate-950/90 py-3 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-800 animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 w-44 rounded bg-slate-800 animate-pulse" />
              <div className="h-2.5 w-32 rounded bg-slate-800 animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-lg bg-slate-800 animate-pulse" />
            <div className="h-8 w-20 rounded-lg bg-slate-800 animate-pulse" />
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <DashboardSkeleton />
      </main>
    </div>
  );
}
