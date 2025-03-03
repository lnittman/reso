import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
import { createAIGeneratedPlaylist } from '@/lib/music/spotify';

type PlaylistParams = {
  name: string;
  description: string;
  mood?: string;
  genres?: string[];
  duration?: number; // in minutes
  tempo?: 'slow' | 'medium' | 'fast';
  era?: string;
  isPublic?: boolean;
};

// Mock function for generating playlist tracks based on AI recommendations
// In a real implementation, this would connect to an AI recommendation system
async function generatePlaylistTracks(userId: string, params: PlaylistParams): Promise<string[]> {
  // Get user's favorite genres from their profile
  const userProfile = await prisma.musicProfile.findFirst({
    where: { userId },
    select: { favoriteGenres: true }
  });
  
  const favoriteGenres = userProfile?.favoriteGenres || [];
  const targetGenres = params.genres?.length ? params.genres : favoriteGenres;
  
  // For demo purposes, return mock Spotify track IDs based on genres
  // In a real implementation, this would use AI to select appropriate tracks
  const genreToTrackMap: Record<string, string[]> = {
    'Pop': ['5Z01UMMf7V1o0MzF86s6WJ', '7KXjTSCq5nL1LoYtL7XAwS', '0e7ipj03S05BNilyu5bRzt'],
    'Rock': ['4cluDES4hQEUhmXj6TXkSo', '3ZrRvdLDTzVxcMcyqErHfE', '7ouMYWpwJ422jRcDASZB7P'],
    'Hip Hop': ['7LR85XLWw2yXqKBSI5brbG', '2mfUa8bLs2s5N4VaqJZ4lZ', '1zi7xx7UVEFkmKfv06H8x0'],
    'R&B': ['0GO8y8jQk1PkHzS31d699N', '4VXIryQMWpIdGgYR4TrjT1', '5dn6QANKbf76pANGVubKlw'],
    'Electronic': ['7ImZeAqaqrSYZQyXGNUU7Z', '05wIrZSwuaVWhcv5FfqeH0', '0DiDStADDVh3SvAsoJAFMk'],
    'Jazz': ['2bgTY4UwhfBYhGT4HUYStN', '74X1epeRfdVdAkp1vZiTK8', '5mVfkKRwdjDzpP5IVWTgAD'],
    'Classical': ['1JSTJqkT5qHq8MDJnJbRE1', '7G7tgvGJDQQQ19EGXpFRiQ', '6JdX9MGiAMPLQ5N343LEX6'],
    'Country': ['1c8gk2PeTE04A1pHN0YYRs', '55S2PQgSMYAhgoTCcGCDlV', '5MwynWK9s4hlyKHqzpIv29'],
    'Folk': ['1r1fPuhj9H4VdXr7mNJ0r5', '0hDQV9X1Da5JrwhK8Qch3S', '1o1Rlg42UCf2r88NvPPSrN'],
    'Indie': ['0tQ9vBYpldCuikPsbgOVKA', '3qQbCzHBycnDpGskqOWY0E', '4rZLdXVDBVXMJyJNSp9Nqy']
  };
  
  // Collect tracks for each selected genre
  let trackIds: string[] = [];
  
  targetGenres.forEach(genre => {
    const genreTracks = genreToTrackMap[genre] || [];
    trackIds = [...trackIds, ...genreTracks];
  });
  
  // Ensure uniqueness and limit to 20 tracks
  trackIds = [...new Set(trackIds)].slice(0, 20);
  
  return trackIds;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the request body
    const body = await request.json();
    const { name, description, mood, genres, duration, tempo, era, isPublic } = body as PlaylistParams;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Playlist name is required' },
        { status: 400 }
      );
    }
    
    // Get session to access tokens
    const req = { headers: { cookie: request.headers.get('cookie') } } as any;
    const token = await getToken({ req });
    
    // Generate the playlist tracks using AI
    const trackIds = await generatePlaylistTracks(user.id, {
      name,
      description,
      mood,
      genres,
      duration,
      tempo,
      era,
      isPublic
    });
    
    // Create a playlist in the database
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        isPublic: isPublic || false,
        creatorId: user.id
      }
    });
    
    // Add the songs to the playlist
    const songRecords = await Promise.all(
      trackIds.map(async (trackId, index) => {
        // Check if the song exists in our database
        let song = await prisma.song.findFirst({
          where: { externalId: trackId }
        });
        
        // If not, create a placeholder record for now
        // In a real app, we'd fetch metadata from the streaming service
        if (!song) {
          song = await prisma.song.create({
            data: {
              title: `Track ${index + 1}`,
              artist: 'Unknown Artist',
              externalId: trackId,
              externalUrl: `https://open.spotify.com/track/${trackId}`,
              genres: genres || [],
              playCount: 0
            }
          });
        }
        
        // Add to the playlist
        return prisma.playlistSong.create({
          data: {
            playlistId: playlist.id,
            songId: song.id,
            addedById: user.id,
            order: index
          }
        });
      })
    );
    
    // If Spotify token is available, create the playlist on Spotify too
    let externalPlaylist = null;
    if (token?.spotifyAccessToken) {
      try {
        externalPlaylist = await createAIGeneratedPlaylist(
          token.spotifyAccessToken as string,
          name,
          description || 'AI-generated playlist by reso',
          trackIds,
          isPublic || false
        );
      } catch (spotifyError) {
        console.error('Failed to create Spotify playlist:', spotifyError);
        // Continue anyway, as we've created the playlist in our database
      }
    }
    
    // Return success response with the created playlist info
    return NextResponse.json({
      playlist: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        isPublic: playlist.isPublic,
        trackCount: songRecords.length,
      },
      externalPlaylist,
      message: 'AI-generated playlist created successfully'
    });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    );
  }
} 