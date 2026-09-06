'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Activity, Flame, ShieldAlert, Mountain, Radio, Compass, MapPin } from 'lucide-react';

/**
 * Base animated skeleton primitive with smooth pulsing gradient
 */
export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[var(--gh-surface-raised)] relative overflow-hidden after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-[var(--gh-border)]/40 after:to-transparent',
        className
      )}
      {...props}
    />
  );
};

/**
 * Skeleton for Top KPI Stats Overview Cards
 */
export const StatsOverviewSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Memuat statistik...">
      {[
        { label: 'Gempa Terkini', icon: Activity, color: 'rose' },
        { label: 'Total Gempa', icon: Flame, color: 'amber' },
        { label: 'Gunung Api Siaga', icon: Mountain, color: 'orange' },
        { label: 'Provinsi Risiko Tinggi', icon: ShieldAlert, color: 'red' },
      ].map((item, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-md space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Latest Quake Showcase Banner
 */
export const LatestQuakeCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 sm:p-6 shadow-xl space-y-4">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main Info Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-2">
        {/* Magnitude Block */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48 sm:w-64" />
            <Skeleton className="h-4 w-36" />
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-6 w-28 rounded-lg" />
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-4 w-52" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Interactive Map Stage
 */
export const InteractiveMapSkeleton: React.FC<{ heightClass?: string }> = ({
  heightClass = 'h-[460px] sm:h-[540px]',
}) => {
  return (
    <div
      className={cn(
        'relative w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-6 shadow-xl',
        heightClass
      )}
    >
      {/* Grid line background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Top Left Floating Layer Skeleton */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Skeleton className="h-8 w-28 rounded-xl bg-slate-900/90" />
        <Skeleton className="h-8 w-32 rounded-xl bg-slate-900/90" />
      </div>

      {/* Top Right Floating Switcher Skeleton */}
      <div className="absolute top-4 right-4 z-10 flex gap-1.5">
        <Skeleton className="h-8 w-36 rounded-xl bg-slate-900/90" />
        <Skeleton className="h-8 w-8 rounded-xl bg-slate-900/90" />
      </div>

      {/* Center Radar Scanner indicator */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full rounded-full bg-rose-500/20 animate-ping" />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-700 shadow-lg text-rose-500">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-44 mx-auto" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
      </div>

      {/* Bottom Legend Skeleton */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:block">
        <Skeleton className="h-16 w-52 rounded-xl bg-slate-900/90" />
      </div>
    </div>
  );
};

/**
 * Skeleton for Disaster Feed List
 */
export const DisasterListSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
      </div>

      {/* Search Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl hidden sm:block" />
      </div>

      {/* Items list */}
      <div className="space-y-3 pt-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 w-full">
                <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-3/4 max-w-xs" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-4 w-10 shrink-0 rounded" />
            </div>

            <div className="pt-2 border-t border-slate-900 flex justify-end gap-2">
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-7 w-28 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for Volcano Monitor Page & View
 */
export const VolcanoMonitorSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat data gunung api...">
      {/* Header Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
        <div className="flex gap-2 overflow-hidden">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-full sm:w-64 rounded-lg" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Volcano Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-6 w-6 rounded-lg" />
                    <Skeleton className="h-6 w-6 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Feed Skeleton */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800/60 p-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-28 w-full rounded-lg" />
                <div className="flex justify-between items-center pt-1">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Volcano Detail Page
 */
export const VolcanoDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat detail gunung api...">
      {/* Profile Card Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-9 w-64 sm:w-80" />
            <div className="flex flex-wrap gap-4 pt-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl mt-2" />
          </div>

          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            <Skeleton className="h-10 w-44 rounded-xl" />
            <Skeleton className="h-10 w-44 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Recommendation Box Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-60" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>

      {/* Recent Eruptions Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-4 pt-2">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2 border-b border-slate-800/60 pb-4 last:border-0">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Risk Map View (IRBI BNPB)
 */
export const RiskMapViewSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat data peta risiko...">
      {/* Formula Banner Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-72" />
            <Skeleton className="h-3 w-full max-w-lg" />
          </div>
          <Skeleton className="h-14 w-60 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>

      {/* 2 Column Split Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <Skeleton className="h-5 w-44" />
            <div className="flex gap-1.5">
              <Skeleton className="h-6 w-14 rounded" />
              <Skeleton className="h-6 w-14 rounded" />
            </div>
          </div>
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-7 w-48" />
            </div>
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-40" />
          <div className="grid grid-cols-2 gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Region Explorer View
 */
export const RegionExplorerSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat eksplorasi wilayah...">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3 w-80" />
          </div>
          <Skeleton className="h-9 w-full sm:w-72 rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * Full Dashboard Skeleton combining all top widgets
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Memuat dashboard bencana...">
      <StatsOverviewSkeleton />
      <LatestQuakeCardSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-32" />
          </div>
          <InteractiveMapSkeleton />
        </div>
        <div className="lg:col-span-5">
          <DisasterListSkeleton />
        </div>
      </div>
    </div>
  );
};
