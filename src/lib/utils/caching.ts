interface CacheConfig {
  maxAge: number;
  maxSize: number;
}

export class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }>;
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.cache = new Map();
    this.config = config;
  }

  set(key: string, data: any): void {
    if (this.cache.size >= this.config.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > this.config.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Create a global cache instance
export const globalCache = new CacheManager({
  maxAge: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
});