/**
 * Streaming service integration utilities
 * 
 * This module provides utilities for integrating with music streaming services
 * such as Spotify and Apple Music, focusing on playlist export, deep linking, 
 * and embedding functionality.
 */

import { GeneratedTrack } from '@/lib/ai/openai';

export type StreamingService = 'spotify' | 'apple' | 'youtube';

export interface ExportPlaylistParams {
  name: string;
  description?: string;
  tracks: GeneratedTrack[];
  service: StreamingService;
  isPublic?: boolean;
}

export interface StreamingServiceLink {
  webUrl: string;
  appDeepLink?: string;
  embeddable: boolean;
  embedCode?: string;
}

/**
 * Determines the optimal streaming service based on user agent and device
 * @param userAgent The browser's user agent string
 * @returns The recommended streaming service for the user's device
 */
export function detectOptimalService(userAgent: string): StreamingService {
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isMac = /Mac/.test(userAgent) && !/iPhone|iPad|iPod/.test(userAgent);
  
  if (isIOS || isMac) {
    return 'apple';
  }
  
  // Default to Spotify for most users
  return 'spotify';
}

/**
 * Generates deep links and embed codes for a track across streaming services
 * @param track The track to generate links for
 * @param preferredService The user's preferred streaming service
 * @returns Links for the track on various streaming platforms
 */
export function getStreamingLinks(
  trackName: string, 
  artistName: string, 
  preferredService: StreamingService = 'spotify'
): StreamingServiceLink {
  // In a real implementation, this would use actual APIs to search for tracks
  // and get verified links. For now, we'll generate plausible fake links.
  
  const encodedTrack = encodeURIComponent(`${trackName} ${artistName}`);
  
  if (preferredService === 'spotify') {
    // Generate Spotify-focused links
    return {
      webUrl: `https://open.spotify.com/search/${encodedTrack}`,
      appDeepLink: `spotify:search:${encodedTrack}`,
      embeddable: true,
      embedCode: `<iframe src="https://open.spotify.com/embed/search/${encodedTrack}" 
        width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
    };
  }
  
  if (preferredService === 'apple') {
    // Generate Apple Music-focused links
    return {
      webUrl: `https://music.apple.com/us/search?term=${encodedTrack}`,
      appDeepLink: `music://music.apple.com/us/search?term=${encodedTrack}`,
      embeddable: true,
      embedCode: `<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="150" 
        style="width:100%;max-width:660px;overflow:hidden;background:transparent;" 
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
        src="https://embed.music.apple.com/us/search?term=${encodedTrack}"></iframe>`
    };
  }
  
  // YouTube Music fallback
  return {
    webUrl: `https://music.youtube.com/search?q=${encodedTrack}`,
    embeddable: true,
    embedCode: `<iframe width="560" height="315" 
      src="https://www.youtube.com/embed?listType=search&list=${encodedTrack}" 
      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen></iframe>`
  };
}

/**
 * Exports a generated playlist to a streaming service
 * Note: This would require actual authentication with the streaming service APIs
 * @param params The parameters for exporting the playlist
 * @returns A link to the created playlist (mock implementation for now)
 */
export async function exportPlaylist(params: ExportPlaylistParams): Promise<StreamingServiceLink> {
  const { name, description, tracks, service, isPublic = false } = params;
  
  console.log(`Exporting playlist "${name}" to ${service} with ${tracks.length} tracks`);
  console.log(`Public: ${isPublic}, Description: ${description || 'None'}`);
  
  // In a real implementation, this would call the appropriate streaming service API
  // after authenticating the user with OAuth
  
  // For mock purposes, just create a plausible streaming link
  const encodedName = encodeURIComponent(name);
  
  if (service === 'spotify') {
    return {
      webUrl: `https://open.spotify.com/playlist/mock_id_for_${encodedName}`,
      appDeepLink: `spotify:playlist:mock_id_for_${encodedName}`,
      embeddable: true,
      embedCode: `<iframe src="https://open.spotify.com/embed/playlist/mock_id_for_${encodedName}" 
        width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
    };
  }
  
  if (service === 'apple') {
    return {
      webUrl: `https://music.apple.com/us/playlist/mock-id-for-${encodedName}/pl.u-mock-id`,
      appDeepLink: `music://music.apple.com/us/playlist/mock-id-for-${encodedName}/pl.u-mock-id`,
      embeddable: true,
      embedCode: `<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="450" 
        style="width:100%;max-width:660px;overflow:hidden;background:transparent;" 
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
        src="https://embed.music.apple.com/us/playlist/mock-id-for-${encodedName}/pl.u-mock-id"></iframe>`
    };
  }
  
  return {
    webUrl: `https://music.youtube.com/playlist?list=mock_id_for_${encodedName}`,
    embeddable: true,
    embedCode: `<iframe width="560" height="315" 
      src="https://www.youtube.com/embed/playlist?list=mock_id_for_${encodedName}" 
      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen></iframe>`
  };
} 