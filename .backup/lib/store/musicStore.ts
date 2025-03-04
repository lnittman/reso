/**
 * Music Store
 * 
 * Manages music-related state using Zustand instead of React Context.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  genres?: string[];
}

export interface MusicState {
  // Liked tracks
  likedTracks: string[];
  likeTrack: (trackId: string) => void;
  unlikeTrack: (trackId: string) => void;
  
  // Recently played
  recentlyPlayed: Track[];
  addToRecentlyPlayed: (track: Track) => void;
  
  // Current recommendations
  recommendations: Track[];
  setRecommendations: (tracks: Track[]) => void;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      // Liked tracks
      likedTracks: [],
      likeTrack: (trackId) => set((state) => ({
        likedTracks: [...state.likedTracks, trackId]
      })),
      unlikeTrack: (trackId) => set((state) => ({
        likedTracks: state.likedTracks.filter(id => id !== trackId)
      })),
      
      // Recently played
      recentlyPlayed: [],
      addToRecentlyPlayed: (track) => set((state) => {
        // Remove the track if it's already in the list
        const filteredTracks = state.recentlyPlayed.filter(t => t.id !== track.id);
        
        // Add the track to the beginning of the list and keep only the last 20
        return {
          recentlyPlayed: [track, ...filteredTracks].slice(0, 20)
        };
      }),
      
      // Current recommendations
      recommendations: [],
      setRecommendations: (tracks) => set({ recommendations: tracks }),
    }),
    {
      name: 'music-store'
    }
  )
); 