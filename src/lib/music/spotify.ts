/**
 * Spotify integration utility
 * 
 * This module provides functions for interacting with the Spotify API,
 * including authentication, playlist management, and deep linking.
 */

// Function to generate a Spotify deep link for a track
export function getSpotifyTrackLink(trackId: string): string {
  return `spotify:track:${trackId}`;
}

// Function to generate a Spotify deep link for a playlist
export function getSpotifyPlaylistLink(playlistId: string): string {
  return `spotify:playlist:${playlistId}`;
}

// Function to generate a web URL for a track (used as fallback)
export function getSpotifyTrackUrl(trackId: string): string {
  return `https://open.spotify.com/track/${trackId}`;
}

// Function to generate a web URL for a playlist
export function getSpotifyPlaylistUrl(playlistId: string): string {
  return `https://open.spotify.com/playlist/${playlistId}`;
}

// Function to create a new playlist on a user's Spotify account
export async function createSpotifyPlaylist(
  accessToken: string,
  name: string,
  description: string,
  isPublic: boolean = false
): Promise<any> {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      public: isPublic,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create playlist: ${response.statusText}`);
  }

  return response.json();
}

// Function to add tracks to a Spotify playlist
export async function addTracksToSpotifyPlaylist(
  accessToken: string,
  playlistId: string,
  trackUris: string[]
): Promise<any> {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: trackUris,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add tracks to playlist: ${response.statusText}`);
  }

  return response.json();
}

// Function to search for tracks on Spotify
export async function searchSpotifyTracks(
  accessToken: string,
  query: string,
  limit: number = 20
): Promise<any> {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: limit.toString(),
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

// Function to generate a playlist from AI recommendations and add it to the user's Spotify account
export async function createAIGeneratedPlaylist(
  accessToken: string,
  name: string,
  description: string,
  trackIds: string[],
  isPublic: boolean = false
): Promise<any> {
  try {
    // 1. Create a new playlist
    const playlist = await createSpotifyPlaylist(accessToken, name, description, isPublic);
    
    // 2. Convert track IDs to Spotify URIs
    const trackUris = trackIds.map(id => `spotify:track:${id}`);
    
    // 3. Add tracks to the playlist
    await addTracksToSpotifyPlaylist(accessToken, playlist.id, trackUris);
    
    return {
      id: playlist.id,
      url: playlist.external_urls.spotify,
      uri: playlist.uri,
      name: playlist.name,
      description: playlist.description
    };
  } catch (error) {
    console.error('Failed to create AI-generated playlist:', error);
    throw error;
  }
} 