'use client';

import React from 'react';
import { VolcanoDetailSkeleton } from '@/components/LoadingSkeletons';

export default function VolcanoDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="w-full border-b border-slate-800 bg-slate-950/90 py-3 px-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-28 rounded-lg bg-slate-800 animate-pulse" />
            <div className="h-4 w-40 rounded bg-slate-800 animate-pulse" />
          </div>
          <div className="h-4 w-36 rounded bg-slate-800 animate-pulse" />
        </div>
      </div>

      <main className="mx-auto max-w-5xl w-full flex-1 px-4 py-6 sm:px-6">
        <VolcanoDetailSkeleton />
      </main>
    </div>
  );
}
