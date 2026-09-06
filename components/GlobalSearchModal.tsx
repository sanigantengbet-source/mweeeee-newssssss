'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Mountain, Activity, ShieldAlert, ChevronRight } from 'lucide-react';
import { Disaster } from '@/types/disaster';

interface SearchResultItem {
  type: 'earthquake' | 'volcano' | 'province' | 'district';
  id: string;
  title: string;
  subtitle: string;
  latitude?: number;
  longitude?: number;
  severity?: string;
  url?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusMap: (lat: number, lng: number, title?: string) => void;
  onSelectDisaster: (disaster: Disaster) => void;
  onSelectProvinceByName: (name: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onFocusMap,
  onSelectDisaster,
  onSelectProvinceByName,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleModalClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const displayedResults = query.trim().length < 2 ? [] : results;

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      } else if (e.key === 'Escape' && isOpen) {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm">
      <div
        id="global-search-dialog"
        className="w-full max-w-xl rounded-xl border border-[var(--gh-border)] bg-[var(--gh-surface)] shadow-2xl overflow-hidden transition-colors duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--gh-border)]">
          <Search className="h-4 w-4 text-[var(--gh-text-muted)] mr-3 shrink-0" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Ketik wilayah (misal: Jawa Tengah, Padang, Cianjur) atau bencana..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[var(--gh-text)] placeholder-[var(--gh-text-subtle)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="p-1 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] mr-1"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}
          <button
            onClick={handleModalClose}
            className="rounded-md bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 scrollbar-thin">
          {loading && (
            <div className="py-8 text-center text-xs text-[var(--gh-text-muted)]">
              Mencari data BMKG &amp; InaRISK...
            </div>
          )}

          {!loading && displayedResults.length === 0 && query.length >= 2 && (
            <div className="py-8 text-center text-xs text-[var(--gh-text-muted)]">
              Tidak ditemukan data untuk &quot;{query}&quot;
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="py-8 text-center text-xs text-[var(--gh-text-subtle)]">
              Ketik minimal 2 karakter untuk mencari gempa, gunung api, atau wilayah...
            </div>
          )}

          {displayedResults.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => {
                handleModalClose();
                if (item.type === 'earthquake' || item.type === 'volcano') {
                  if (item.latitude && item.longitude) {
                    onFocusMap(item.latitude, item.longitude, item.title);
                  }
                } else if (item.type === 'province') {
                  onSelectProvinceByName(item.title);
                }
              }}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--gh-surface-raised)] cursor-pointer transition border border-transparent hover:border-[var(--gh-border)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--gh-surface-raised)] border border-[var(--gh-border)] text-[var(--gh-text-muted)]">
                  {item.type === 'earthquake' && <Activity className="h-3.5 w-3.5 text-rose-500" strokeWidth={1.75} />}
                  {item.type === 'volcano' && <Mountain className="h-3.5 w-3.5 text-orange-500" strokeWidth={1.75} />}
                  {item.type === 'province' && <ShieldAlert className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />}
                  {item.type === 'district' && <MapPin className="h-3.5 w-3.5 text-blue-500" strokeWidth={1.75} />}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--gh-text)]">{item.title}</h4>
                  <p className="text-[11px] text-[var(--gh-text-muted)]">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--gh-text-subtle)]" strokeWidth={1.75} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
