import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  duration?: number;
}

interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  progress: number;
  queue: Track[];
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTrack: (track: Track | null) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  currentTrack: null,
  volume: 70,
  progress: 0,
  queue: [],
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  setCurrentTrack: (track) => set({ 
    currentTrack: track,
    isPlaying: track !== null
  }),
  
  setVolume: (volume) => set({ volume }),
  
  setProgress: (progress) => set({ progress }),
  
  addToQueue: (track) => set((state) => ({
    queue: [...state.queue, track]
  })),
  
  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter(track => track.id !== trackId)
  })),
  
  clearQueue: () => set({ queue: [] }),
  
  skipToNext: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;
    
    const currentIndex = currentTrack 
      ? queue.findIndex(track => track.id === currentTrack.id)
      : -1;
    
    const nextIndex = currentIndex + 1 < queue.length ? currentIndex + 1 : 0;
    set({ 
      currentTrack: queue[nextIndex],
      progress: 0
    });
  },
  
  skipToPrevious: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;
    
    const currentIndex = currentTrack 
      ? queue.findIndex(track => track.id === currentTrack.id)
      : -1;
    
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    set({ 
      currentTrack: queue[prevIndex],
      progress: 0
    });
  }
})); 