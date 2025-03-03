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
  volume: 80,
  progress: 0,
  duration: 0,
  queue: [],
  
  playTrack: (track) => set({ 
    currentTrack: track, 
    isPlaying: true,
    progress: 0,
    duration: track.duration
  }),
  
  pauseTrack: () => set({ isPlaying: false }),
  
  resumeTrack: () => set({ isPlaying: true }),
  
  nextTrack: () => {
    const { queue } = get();
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const newQueue = queue.slice(1);
      set({ 
        currentTrack: nextTrack, 
        isPlaying: true,
        progress: 0,
        duration: nextTrack.duration,
        queue: newQueue
      });
    }
  },
  
  previousTrack: () => {
    // In a real implementation, this would maintain a history of played tracks
    set({ progress: 0 });
  },
  
  setVolume: (volume) => set({ volume }),
  
  setProgress: (progress) => set({ progress }),
  
  addToQueue: (track) => set((state) => ({ 
    queue: [...state.queue, track] 
  })),
  
  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter(track => track.id !== trackId)
  })),
})); 