import { NextRequest, NextResponse } from 'next/server';
import { generatePlaylist } from '@/lib/ai/perplexity';
import { PlaylistGenerationParams } from '@/lib/ai/types';
import { logger } from '@/lib/logging/logger';
import { z } from 'zod';

// Validation schema for playlist generation request
const playlistRequestSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().optional(),
  mood: z.string().optional(),
  genres: z.array(z.string()).optional(),
  era: z.string().optional(),
  trackCount: z.number().min(5).max(50).optional()
});

/**
 * POST handler for generating playlists with AI
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  logger.api('/api/playlists/ai-generate', 'POST', 'Generating AI playlist', {
    meta: { requestId }
  });
  
  try {
    // Parse and validate the request body
    const body = await request.json();
    
    logger.debug('api:playlists', 'Request body received', {
      requestId,
      body
    });
    
    // Validate the request body
    const result = playlistRequestSchema.safeParse(body);
    
    if (!result.success) {
      logger.warn('api:playlists', 'Invalid request body', {
        requestId,
        errors: result.error.format()
      });
      
      return NextResponse.json(
        { 
          error: "Invalid request",
          details: result.error.format() 
        }, 
        { status: 400 }
      );
    }
    
    // Extract validated data
    const params: PlaylistGenerationParams = result.data;
    
    // Generate the playlist using Perplexity
    logger.info('api:playlists', 'Calling Perplexity to generate playlist', {
      requestId,
      params
    });
    
    const playlist = await generatePlaylist(params, { conversationId: requestId });
    
    logger.info('api:playlists', 'Playlist generated successfully', {
      requestId,
      trackCount: playlist.tracks.length
    });
    
    // Return the generated playlist
    return NextResponse.json(playlist);
    
  } catch (error) {
    logger.error('api:playlists', 'Error in playlist generation API', {
      requestId,
      error: error instanceof Error ? error.message : String(error)
    });
    
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    );
  }
}

/**
 * GET handler to return information about the playlist generation API
 */
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  logger.api('/api/playlists/ai-generate', 'GET', 'API info request', {
    meta: { requestId }
  });
  
  return NextResponse.json({
    description: "AI Playlist Generation API",
    usage: {
      method: "POST",
      bodyParameters: {
        name: "Name of the playlist (required)",
        description: "Description of the playlist (optional)",
        mood: "Mood of the playlist (optional)",
        genres: "Array of genres (optional)",
        era: "Musical era (optional)",
        trackCount: "Number of tracks (optional, default: 10)"
      },
      example: {
        name: "Summer Road Trip",
        description: "Upbeat tracks for a long drive",
        mood: "energetic",
        genres: ["Pop", "Rock"],
        era: "2010s",
        trackCount: 15
      }
    }
  });
} 