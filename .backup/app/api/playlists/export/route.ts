import { NextRequest, NextResponse } from 'next/server';
import { exportPlaylist, StreamingService } from '@/lib/music/streaming';
import { GeneratedTrack } from '@/lib/ai/types';
import { logger } from '@/lib/logging/logger';
import { z } from 'zod';

// Validation schema for playlist export request
const exportRequestSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().optional(),
  tracks: z.array(z.object({
    title: z.string(),
    artist: z.string(),
    album: z.string().optional(),
    year: z.string().optional(),
    explanation: z.string().optional(),
    genres: z.array(z.string()).optional()
  })).min(1, "At least one track is required"),
  service: z.enum(['spotify', 'apple', 'youtube'] as const),
  isPublic: z.boolean().optional().default(false)
});

/**
 * POST handler for exporting playlists to streaming services
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  logger.api('/api/playlists/export', 'POST', 'Exporting playlist to streaming service', {
    meta: { requestId }
  });
  
  try {
    // Parse and validate the request body
    const body = await request.json();
    
    logger.debug('api:playlists', 'Request body received', {
      requestId,
      body: {
        ...body,
        tracks: body.tracks?.length ? `${body.tracks.length} tracks` : undefined
      }
    });
    
    // Validate the request body
    const result = exportRequestSchema.safeParse(body);
    
    if (!result.success) {
      logger.warn('api:playlists', 'Invalid export request', {
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
    const params = result.data;
    
    // In a real implementation, we would check if the user is authenticated
    // and has authorization to access the requested streaming service
    logger.info('api:playlists', `Exporting playlist to ${params.service}`, {
      requestId,
      service: params.service,
      trackCount: params.tracks.length,
      isPublic: params.isPublic
    });
    
    // Process tracks to ensure they match the GeneratedTrack type
    const processedTracks: GeneratedTrack[] = params.tracks.map(track => ({
      ...track,
      explanation: track.explanation || 'No explanation provided' // Ensure explanation is always a string
    }));
    
    // Export the playlist
    const playlistLinks = await exportPlaylist({
      name: params.name,
      description: params.description,
      tracks: processedTracks,
      service: params.service as StreamingService,
      isPublic: params.isPublic
    });
    
    logger.info('api:playlists', 'Playlist exported successfully', {
      requestId,
      service: params.service,
      links: {
        webUrl: playlistLinks.webUrl,
        hasAppDeepLink: !!playlistLinks.appDeepLink
      }
    });
    
    // Return the export links
    return NextResponse.json({
      success: true,
      service: params.service,
      links: playlistLinks
    });
    
  } catch (error) {
    logger.error('api:playlists', 'Error in playlist export API', {
      requestId,
      error: error instanceof Error ? error.message : String(error)
    });
    
    return NextResponse.json(
      { error: 'Failed to export playlist', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET handler to return information about the playlist export API
 */
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  logger.api('/api/playlists/export', 'GET', 'API info request', {
    meta: { requestId }
  });
  
  return NextResponse.json({
    description: "Playlist Export API",
    usage: {
      method: "POST",
      bodyParameters: {
        name: "Name of the playlist (required)",
        description: "Description of the playlist (optional)",
        tracks: "Array of track objects (required)",
        service: "Streaming service (spotify, apple, youtube)",
        isPublic: "Whether the playlist should be public (default: false)"
      },
      example: {
        name: "Summer Road Trip",
        description: "Upbeat tracks for a long drive",
        tracks: [
          {
            title: "Track Title",
            artist: "Artist Name",
            album: "Album Name",
            year: "2023",
            genres: ["Pop", "Electronic"]
          }
        ],
        service: "spotify",
        isPublic: true
      }
    }
  });
} 