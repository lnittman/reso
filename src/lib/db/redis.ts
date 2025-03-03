import { Redis } from '@upstash/redis';

// Create Redis client singleton
let redis: Redis;

export function getRedisClient() {
  if (!redis) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL || '',
      token: process.env.KV_REST_API_TOKEN || '',
    });
  }
  
  return redis;
}

// Cache functions
export async function cacheSet(key: string, value: any, expirationInSeconds?: number) {
  const client = getRedisClient();
  
  if (expirationInSeconds) {
    return client.set(key, JSON.stringify(value), { ex: expirationInSeconds });
  }
  
  return client.set(key, JSON.stringify(value));
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  const data = await client.get(key);
  
  if (!data) return null;
  
  try {
    return JSON.parse(data as string) as T;
  } catch (error) {
    console.error('Failed to parse cached data:', error);
    return null;
  }
}

export async function cacheDelete(key: string) {
  const client = getRedisClient();
  return client.del(key);
}

// Rate limiting helper
export async function rateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowInSeconds: number = 60
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const client = getRedisClient();
  const now = Math.floor(Date.now() / 1000);
  const key = `ratelimit:${identifier}`;
  
  // Get current data or create new record
  const data = await client.get(key) as { count: number; reset: number } | null;
  const reset = data?.reset || now + windowInSeconds;
  
  if (!data) {
    // First request, create new record
    await client.set(key, JSON.stringify({ count: 1, reset }), { ex: windowInSeconds });
    return { success: true, remaining: maxRequests - 1, reset };
  }
  
  // Check if window has expired
  if (now > data.reset) {
    // Reset counter
    await client.set(key, JSON.stringify({ count: 1, reset: now + windowInSeconds }), { ex: windowInSeconds });
    return { success: true, remaining: maxRequests - 1, reset: now + windowInSeconds };
  }
  
  // Check if limit exceeded
  if (data.count >= maxRequests) {
    return { success: false, remaining: 0, reset: data.reset };
  }
  
  // Increment counter
  const newCount = data.count + 1;
  await client.set(key, JSON.stringify({ count: newCount, reset: data.reset }), { ex: data.reset - now });
  
  return { success: true, remaining: maxRequests - newCount, reset: data.reset };
}

// Session cache helpers
export async function setSessionData(sessionId: string, data: any, expirationInSeconds: number = 3600) {
  return cacheSet(`session:${sessionId}`, data, expirationInSeconds);
}

export async function getSessionData<T>(sessionId: string): Promise<T | null> {
  return cacheGet<T>(`session:${sessionId}`);
}

export async function deleteSessionData(sessionId: string) {
  return cacheDelete(`session:${sessionId}`);
} 