// Caching Service for Performance Optimization

import { createClient, RedisClientType } from 'redis';

export class CacheService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor(redisUrl?: string) {
    this.client = createClient({
      url: redisUrl || process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('Redis connected successfully');
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Cache product analysis results
   */
  async cacheAnalysis(
    productName: string,
    language: string,
    result: any,
    ttl: number = 3600
  ): Promise<void> {
    const key = this.generateCacheKey(productName, language);
    await this.client.setEx(key, ttl, JSON.stringify(result));
  }

  /**
   * Get cached analysis
   */
  async getCachedAnalysis(
    productName: string,
    language: string
  ): Promise<any | null> {
    const key = this.generateCacheKey(productName, language);
    const cached = await this.client.get(key);
    
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Cache price data with shorter TTL (prices change frequently)
   */
  async cachePrices(
    productName: string,
    prices: any[],
    ttl: number = 600 // 10 minutes
  ): Promise<void> {
    const key = `prices:${productName.toLowerCase()}`;
    await this.client.setEx(key, ttl, JSON.stringify(prices));
  }

  /**
   * Implement rate limiting
   */
  async checkRateLimit(
    userId: string,
    maxRequests: number = 100,
    windowSeconds: number = 60
  ): Promise<{ allowed: boolean; remaining: number }> {
    const key = `ratelimit:${userId}`;
    const current = await this.client.incr(key);
    
    if (current === 1) {
      await this.client.expire(key, windowSeconds);
    }
    
    const allowed = current <= maxRequests;
    const remaining = Math.max(0, maxRequests - current);
    
    return { allowed, remaining };
  }

  /**
   * Cache trending products
   */
  async trackProductSearch(productName: string): Promise<void> {
    const key = 'trending:products';
    await this.client.zIncrBy(key, 1, productName.toLowerCase());
    await this.client.expire(key, 86400); // 24 hours
  }

  /**
   * Get trending products
   */
  async getTrendingProducts(limit: number = 10): Promise<string[]> {
    const key = 'trending:products';
    return await this.client.zRange(key, 0, limit - 1, { REV: true });
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(productName: string, language: string): string {
    return `analysis:${productName.toLowerCase().replace(/\s+/g, '-')}:${language}`;
  }

  /**
   * Clear cache for a product
   */
  async invalidateCache(productName: string): Promise<void> {
    const pattern = `analysis:${productName.toLowerCase().replace(/\s+/g, '-')}:*`;
    const keys = await this.client.keys(pattern);
    
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<any> {
    const info = await this.client.info('stats');
    const dbSize = await this.client.dbSize();
    
    return {
      databaseSize: dbSize,
      info: info
    };
  }
}

// Load Balancer Strategy
export class LoadBalancer {
  private servers: string[];
  private currentIndex: number = 0;
  private healthStatus: Map<string, boolean> = new Map();

  constructor(servers: string[]) {
    this.servers = servers;
    this.servers.forEach(server => this.healthStatus.set(server, true));
    this.startHealthChecks();
  }

  /**
   * Round-robin load balancing
   */
  getNextServer(): string {
    let attempts = 0;
    
    while (attempts < this.servers.length) {
      const server = this.servers[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.servers.length;
      
      if (this.healthStatus.get(server)) {
        return server;
      }
      
      attempts++;
    }
    
    throw new Error('No healthy servers available');
  }

  /**
   * Health check for servers
   */
  private async checkHealth(server: string): Promise<boolean> {
    try {
      const response = await fetch(`${server}/health`, {
        method: 'GET',
        timeout: 5000
      } as any);
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    setInterval(async () => {
      for (const server of this.servers) {
        const isHealthy = await this.checkHealth(server);
        this.healthStatus.set(server, isHealthy);
        
        if (!isHealthy) {
          console.warn(`Server ${server} is unhealthy`);
        }
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Get server health status
   */
  getHealthStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    this.healthStatus.forEach((health, server) => {
      status[server] = health;
    });
    return status;
  }
}

// Export singleton instances
export const cacheService = new CacheService();
