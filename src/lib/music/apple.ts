/**
 * Apple Music integration utility
 * 
 * This module provides functions for interacting with the Apple Music API,
 * including authentication and deep linking.
 */

// Function to generate an Apple Music URL for a track
export function getAppleMusicTrackUrl(trackId: string, countryCode: string = 'us'): string {
  return `https://music.apple.com/${countryCode}/song/${trackId}`;
}

// Function to generate an Apple Music URL for a playlist
export function getAppleMusicPlaylistUrl(playlistId: string, countryCode: string = 'us'): string {
  return `https://music.apple.com/${countryCode}/playlist/${playlistId}`;
}

// Function to generate an Apple Music app link for iOS
export function getAppleMusicAppLink(trackId: string): string {
  return `music://song/${trackId}`;
}

// Function to generate an Apple Music app link for a playlist on iOS
export function getAppleMusicPlaylistAppLink(playlistId: string): string {
  return `music://playlist/${playlistId}`;
}

// Function to search for tracks on Apple Music (requires Apple Music API integration)
export async function searchAppleMusicTracks(
  developerToken: string,
  query: string,
  limit: number = 20,
  countryCode: string = 'us'
): Promise<any> {
  // This is a placeholder that would need to be implemented with the actual Apple Music API
  // See: https://developer.apple.com/documentation/applemusicapi
  const params = new URLSearchParams({
    term: query,
    limit: limit.toString(),
    types: 'songs'
  });

  const response = await fetch(`https://api.music.apple.com/v1/catalog/${countryCode}/search?${params}`, {
    headers: {
      Authorization: `Bearer ${developerToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

// Helper function to get a platform-appropriate link based on user's device
export function getOptimizedMusicLink(
  appleMusicId: string | null,
  spotifyId: string | null,
  userAgent: string
): string {
  // Check if user is on iOS
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  
  if (isIOS && appleMusicId) {
    // Return deep link for Apple Music on iOS
    return getAppleMusicAppLink(appleMusicId);
  } else if (spotifyId) {
    // Default to Spotify web for other platforms
    return getSpotifyTrackUrl(spotifyId);
  } else if (appleMusicId) {
    // Fallback to Apple Music web if no Spotify ID
    return getAppleMusicTrackUrl(appleMusicId);
  } else {
    // Ultimate fallback
    return '#';
  }
}

// This function would need to be imported from the Spotify utility
function getSpotifyTrackUrl(trackId: string): string {
  return `https://open.spotify.com/track/${trackId}`;
} 