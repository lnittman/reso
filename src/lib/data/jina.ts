/**
 * Jina Reader API Integration
 * 
 * This module provides utilities for extracting structured data about songs
 * from web content using the Jina Reader API.
 */

import { logger } from '@/lib/logging/logger';

// Jina Reader API endpoint
const JINA_API_URL = 'https://r.jina.ai/reader/v1';

// Types for song data extraction
export interface SongData {
  title: string;
  artist: string;
  album?: string;
  releaseYear?: string;
  genres?: string[];
  duration?: string;
  popularity?: number;
  lyrics?: string;
  coverArtUrl?: string;
  streamingLinks?: {
    spotify?: string;
    appleMusicId?: string;
    youtubeId?: string;
    [key: string]: string | undefined;
  };
  sourceUrl: string;
  extractedAt: string;
}

interface JinaReaderOptions {
  requestId?: string;
  timeout?: number;
}

/**
 * Extracts song information from a web page using Jina Reader API
 * @param url The URL of the web page containing song information
 * @returns Structured data about the song
 */
export async function extractSongInfo(
  url: string, 
  options: JinaReaderOptions = {}
): Promise<SongData | null> {
  const { requestId = crypto.randomUUID(), timeout = 30000 } = options;
  
  const startTime = Date.now();
  const apiKey = process.env.JINA_READER_API_KEY;
  
  if (!apiKey) {
    logger.error('data:jina', 'No Jina Reader API key found', {
      requestId,
      url
    });
    throw new Error('Jina Reader API key not configured');
  }
  
  logger.info('data:jina', `Extracting song info from ${url}`, {
    requestId,
    url
  });
  
  try {
    // Set up a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), timeout);
    });
    
    // Create the fetch promise
    const fetchPromise = fetch(`${JINA_API_URL}/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url,
        fields: [
          'song_title',
          'artist_name',
          'album_name',
          'release_year',
          'genres',
          'duration',
          'popularity',
          'lyrics',
          'cover_art_url',
          'streaming_links'
        ]
      })
    });
    
    // Race between the fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    
    if (!response.ok) {
      const error = await response.text();
      logger.error('data:jina', 'API error response', {
        status: response.status,
        statusText: response.statusText,
        error,
        requestId
      });
      throw new Error(`Jina Reader API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const latencyMs = Date.now() - startTime;
    
    logger.info('data:jina', `Successfully extracted song info from ${url}`, {
      requestId,
      latencyMs
    });
    
    // Map the Jina API response to our SongData format
    return mapToSongData(data, url);
    
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    
    logger.error('data:jina', 'Error extracting song info', {
      requestId,
      url,
      latencyMs,
      error: error instanceof Error ? error.message : String(error)
    });
    
    return null;
  }
}

/**
 * Extracts song information from multiple URLs in parallel
 * @param urls List of URLs to extract song information from
 * @returns Array of structured song data objects
 */
export async function batchExtractSongInfo(
  urls: string[],
  options: JinaReaderOptions = {}
): Promise<SongData[]> {
  logger.info('data:jina', `Batch extracting song info from ${urls.length} URLs`, {
    count: urls.length
  });
  
  // Process in batches of 5 to avoid rate limiting
  const batchSize = 5;
  const results: SongData[] = [];
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchPromises = batch.map(url => extractSongInfo(url, options));
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter((r): r is SongData => r !== null));
    
    // Wait 1 second between batches to avoid rate limiting
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  logger.info('data:jina', `Successfully extracted info for ${results.length}/${urls.length} songs`, {
    successCount: results.length,
    totalCount: urls.length
  });
  
  return results;
}

/**
 * Maps the Jina API response to our standardized SongData format
 */
function mapToSongData(jinaResponse: any, sourceUrl: string): SongData {
  return {
    title: jinaResponse.song_title || 'Unknown Title',
    artist: jinaResponse.artist_name || 'Unknown Artist',
    album: jinaResponse.album_name,
    releaseYear: jinaResponse.release_year,
    genres: jinaResponse.genres || [],
    duration: jinaResponse.duration,
    popularity: jinaResponse.popularity,
    lyrics: jinaResponse.lyrics,
    coverArtUrl: jinaResponse.cover_art_url,
    streamingLinks: {
      spotify: jinaResponse.streaming_links?.spotify,
      appleMusicId: jinaResponse.streaming_links?.apple_music,
      youtubeId: jinaResponse.streaming_links?.youtube
    },
    sourceUrl,
    extractedAt: new Date().toISOString()
  };
} 