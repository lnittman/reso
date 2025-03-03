/**
 * Discover Store
 * 
 * Manages discover page state using Zustand instead of React Context.
 */

import { create } from 'zustand';

export interface Genre {
  id: string;
  name: string;
  color: string;
}

export interface Mood {
  id: string;
  name: string;
  emoji: string;
}

export interface DiscoverState {
  // Genres
  genres: Genre[];
  selectedGenreId: string | null;
  setSelectedGenreId: (id: string | null) => void;
  
  // Moods
  moods: Mood[];
  selectedMoodId: string | null;
  setSelectedMoodId: (id: string | null) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Default data
const defaultGenres: Genre[] = [
  { id: 'pop', name: 'Pop', color: 'bg-pink-500' },
  { id: 'rock', name: 'Rock', color: 'bg-red-500' },
  { id: 'hip-hop', name: 'Hip Hop', color: 'bg-yellow-500' },
  { id: 'electronic', name: 'Electronic', color: 'bg-blue-500' },
  { id: 'indie', name: 'Indie', color: 'bg-purple-500' },
  { id: 'r-b', name: 'R&B', color: 'bg-green-500' },
  { id: 'jazz', name: 'Jazz', color: 'bg-orange-500' },
  { id: 'classical', name: 'Classical', color: 'bg-slate-500' },
];

const defaultMoods: Mood[] = [
  { id: 'chill', name: 'Chill', emoji: '😌' },
  { id: 'energetic', name: 'Energetic', emoji: '⚡' },
  { id: 'happy', name: 'Happy', emoji: '😊' },
  { id: 'sad', name: 'Sad', emoji: '😢' },
  { id: 'focus', name: 'Focus', emoji: '🧠' },
  { id: 'workout', name: 'Workout', emoji: '💪' },
];

export const useDiscoverStore = create<DiscoverState>((set) => ({
  // Genres
  genres: defaultGenres,
  selectedGenreId: null,
  setSelectedGenreId: (id) => set({ selectedGenreId: id }),
  
  // Moods
  moods: defaultMoods,
  selectedMoodId: null,
  setSelectedMoodId: (id) => set({ selectedMoodId: id }),
  
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
})); 