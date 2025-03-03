import { create } from 'zustand';

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
  genres: string[];
  playCount: number;
};

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  progress: number;
  duration: number;
  queue: Track[];
  
  // Player controls
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  currentTrack: null,
  volume: 70,
  progress: 0,
  duration: 0,
  queue: [],
  
  playTrack: (track) => set({ 
    currentTrack: track, 
    isPlaying: true,
    duration: track.duration || 0,
    progress: 0 
  }),
  
  pauseTrack: () => set({ isPlaying: false }),
  
  resumeTrack: () => set({ isPlaying: true }),
  
  nextTrack: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;
    
    const currentIndex = currentTrack 
      ? queue.findIndex(track => track.id === currentTrack.id)
      : -1;
    
    const nextIndex = currentIndex + 1 < queue.length ? currentIndex + 1 : 0;
    
    if (nextIndex >= 0 && nextIndex < queue.length) {
      set({ 
        currentTrack: queue[nextIndex],
        progress: 0,
        duration: queue[nextIndex].duration,
        isPlaying: true
      });
    }
  },
  
  previousTrack: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;
    
    const currentIndex = currentTrack 
      ? queue.findIndex(track => track.id === currentTrack.id)
      : -1;
    
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    
    if (prevIndex >= 0 && prevIndex < queue.length) {
      set({ 
        currentTrack: queue[prevIndex],
        progress: 0,
        duration: queue[prevIndex].duration,
        isPlaying: true
      });
    }
  },
  
  setVolume: (volume) => set({ volume }),
  
  setProgress: (progress) => set({ progress }),
  
  addToQueue: (track) => set((state) => ({
    queue: [...state.queue, track]
  })),
  
  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter(track => track.id !== trackId)
  }))
})); 