import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

// Paths that should be rate limited
const RATE_LIMITED_PATHS = [
  '/api/playlists/generate',
  '/api/recommendations'
];

// Rate limit configuration
const RATE_LIMIT = {
  DEFAULT: {
    limit: 60,          // requests
    window: 60 * 1000,  // 1 minute in ms
  },
  PLAYLIST_GENERATE: {
    limit: 10,           // requests
    window: 60 * 60 * 1000, // 1 hour in ms
  }
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Get IP from headers or default to anonymous
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'anonymous';
  
  // Only rate limit specific API paths
  if (!RATE_LIMITED_PATHS.some(limitedPath => path.startsWith(limitedPath))) {
    return NextResponse.next();
  }
  
  const config = path.startsWith('/api/playlists/generate')
    ? RATE_LIMIT.PLAYLIST_GENERATE
    : RATE_LIMIT.DEFAULT;
  
  const { limit, window } = config;
  
  // Create a unique key for this IP and path
  const key = `ratelimit:${ip}:${path}`;
  
  try {
    // Get the current count for this IP and path
    const currentCount = await redis.get(key) as number || 0;
    
    // If the count is too high, return a 429 response
    if (currentCount >= limit) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Date.now() + window + '',
          }
        }
      );
    }
    
    // Increment the count and set the TTL
    await redis.incr(key);
    
    // Set the TTL if this is the first request
    if (currentCount === 0) {
      await redis.expire(key, Math.floor(window / 1000));
    }
    
    // Continue with the request
    const remaining = Math.max(0, limit - (currentCount + 1));
    const response = NextResponse.next();
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', (Date.now() + window).toString());
    
    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    
    // If there's an error with rate limiting, still allow the request to proceed
    return NextResponse.next();
  }
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 