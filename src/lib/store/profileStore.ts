/**
 * Profile Store
 * 
 * Manages profile-related state using Zustand instead of React Context.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  stats: {
    followers: number;
    following: number;
    tracks: number;
    favGenres: string[];
  };
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  playCount: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  trackCount: number;
}

export interface ProfileState {
  // User profile
  profile: UserProfile | null;
  isLoading: boolean;
  activeTab: 'favorites' | 'playlists' | 'stats';
  
  // Favorite tracks
  favoriteTracks: Track[];
  
  // Playlists
  playlists: Playlist[];
  
  // Actions
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setActiveTab: (tab: 'favorites' | 'playlists' | 'stats') => void;
  setFavoriteTracks: (tracks: Track[]) => void;
  setPlaylists: (playlists: Playlist[]) => void;
}

// Mock data for development
const mockUser: UserProfile = {
  name: 'Alex Johnson',
  username: 'alexj',
  bio: 'Music enthusiast with a passion for discovering new artists and genres. Always on the lookout for fresh sounds.',
  avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
  stats: {
    followers: 248,
    following: 186,
    tracks: 1342,
    favGenres: ['Electronic', 'Indie', 'Hip Hop']
  }
};

const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Late Night Talking',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=HS',
    playCount: 47
  },
  {
    id: '2',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=HS',
    playCount: 36
  },
  {
    id: '3',
    title: 'Break My Soul',
    artist: 'Beyoncé',
    album: 'Renaissance',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=B',
    playCount: 29
  },
  {
    id: '4',
    title: 'RESENTMENT (feat. Kanna)',
    artist: 'Fred again..',
    album: 'USB Flash Drive',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=FA',
    playCount: 25
  },
  {
    id: '5',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=TS',
    playCount: 21
  },
];

const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Summer Vibes 2023',
    description: 'Perfect playlist for sunny days',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=SV',
    trackCount: 23
  },
  {
    id: '2',
    name: 'Workout Mix',
    description: 'High energy tracks to keep you moving',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=WM',
    trackCount: 18
  },
  {
    id: '3',
    name: 'Late Night Coding',
    description: 'Focus-enhancing music for productive sessions',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=LNC',
    trackCount: 32
  },
];

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      // Initial state with mock data for development
      profile: mockUser,
      isLoading: false,
      activeTab: 'favorites',
      favoriteTracks: mockTracks,
      playlists: mockPlaylists,
      
      // Actions
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setFavoriteTracks: (favoriteTracks) => set({ favoriteTracks }),
      setPlaylists: (playlists) => set({ playlists }),
    }),
    {
      name: 'profile-store'
    }
  )
); 