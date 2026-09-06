interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  source: string;
}

class InMemoryCache {
  private store: Map<string, CacheEntry<unknown>> = new Map();

  set<T>(key: string, data: T, ttlSeconds: number, source: string = 'official'): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
      source,
    });
  }

  get<T>(key: string): { data: T; isCached: true; source: string } | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return {
      data: entry.data as T,
      isCached: true,
      source: entry.source,
    };
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  clear(): void {
    this.store.clear();
  }
}

// Global cache instance
export const globalCache = new InMemoryCache();

export const CACHE_TTL = {
  EARTHQUAKE_REALTIME: 35, // 35 seconds
  EARTHQUAKE_LIST: 60, // 60 seconds
  DISASTERS: 180, // 3 minutes
  VOLCANOES: 600, // 10 minutes
  GIS_LAYERS: 3600, // 1 hour
  REGIONS: 86400, // 24 hours
};
