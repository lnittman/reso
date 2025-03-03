/**
 * Type definitions for AI integrations
 */

// Types for playlist generation parameters
export interface PlaylistGenerationParams {
  name: string;
  description?: string;
  mood?: string;
  genres?: string[];
  era?: string;
  trackCount?: number;
}

// Types for the generated playlist
export interface GeneratedTrack {
  title: string;
  artist: string;
  album?: string;
  year?: string;
  explanation: string;
  genres?: string[];
}

export interface GeneratedPlaylist {
  name: string;
  description: string;
  tracks: GeneratedTrack[];
  coverDescription?: string;
  explanation: string;
} 