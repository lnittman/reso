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

type Recommendation = {
  id: string;
  track: Track;
  explanation: string;
};

// Mock data for recommendations
const mockRecommendations: Recommendation[] = [
  {
    id: 'rec1',
    track: {
      id: 'track1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZ0ZXIlMjBob3Vyc3xlbnwwfHwwfHx8MA%3D%3D',
      duration: 200,
      genres: ['Pop', 'Synth-pop'],
      playCount: 2500000,
    },
    explanation: 'Based on your love for upbeat tracks with strong synth elements',
  },
  {
    id: 'rec2',
    track: {
      id: 'track2',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cXVlZW4lMjBiYW5kfGVufDB8fDB8fHww',
      duration: 355,
      genres: ['Rock', 'Progressive Rock'],
      playCount: 5000000,
    },
    explanation: 'Classic rock masterpieces similar to your recent listening history',
  },
  {
    id: 'rec3',
    track: {
      id: 'track3',
      title: 'Dusk Till Dawn',
      artist: 'ZAYN ft. Sia',
      album: 'Icarus Falls',
      coverUrl: 'https://images.unsplash.com/photo-1581315628079-f03f19c3158c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHVzayUyMHRpbGwlMjBkYXdufGVufDB8fDB8fHww',
      duration: 239,
      genres: ['Pop', 'R&B'],
      playCount: 1800000,
    },
    explanation: 'Matches your preference for powerful vocal performances',
  }
];

export interface MusicState {
  dailyRecommendations: Recommendation[];
  likedTracks: string[];
  userPlaylists: any[];
  
  // Actions
  loadMockData: () => void;
  likeTrack: (trackId: string) => void;
  unlikeTrack: (trackId: string) => void;
  isTrackLiked: (trackId: string) => boolean;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  dailyRecommendations: [],
  likedTracks: [],
  userPlaylists: [],
  
  loadMockData: () => set({ 
    dailyRecommendations: mockRecommendations 
  }),
  
  likeTrack: (trackId) => set((state) => {
    // If already liked, unlike it
    if (state.likedTracks.includes(trackId)) {
      return { 
        likedTracks: state.likedTracks.filter(id => id !== trackId) 
      };
    }
    // Otherwise add to liked tracks
    return { 
      likedTracks: [...state.likedTracks, trackId] 
    };
  }),
  
  unlikeTrack: (trackId) => set((state) => ({ 
    likedTracks: state.likedTracks.filter(id => id !== trackId) 
  })),
  
  isTrackLiked: (trackId) => {
    return get().likedTracks.includes(trackId);
  },
})); 