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

// Mock data for development
const mockRecommendations: Recommendation[] = [
  {
    id: "rec1",
    track: {
      id: "track1",
      title: "Dreamers",
      artist: "Jung Kook, BTS",
      album: "FIFA World Cup Qatar 2022",
      coverUrl: "https://place-hold.it/300x300/333/fff&text=Dreamers",
      duration: 198,
      genres: ["K-Pop", "Pop"],
      playCount: 1250000
    },
    explanation: "Based on your interest in global pop music and recent K-pop exploration. This track features uplifting vocals with a catchy melody."
  },
  {
    id: "rec2",
    track: {
      id: "track2",
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      coverUrl: "https://place-hold.it/300x300/333/fff&text=Blinding%20Lights",
      duration: 203,
      genres: ["Synth-pop", "R&B"],
      playCount: 2780000
    },
    explanation: "You've enjoyed similar synth-pop tracks with R&B influences. This track features nostalgic 80s-inspired production."
  },
  {
    id: "rec3",
    track: {
      id: "track3",
      title: "As It Was",
      artist: "Harry Styles",
      album: "Harry's House",
      coverUrl: "https://place-hold.it/300x300/333/fff&text=As%20It%20Was",
      duration: 167,
      genres: ["Pop", "Indie"],
      playCount: 1890000
    },
    explanation: "Recommended based on your affinity for melodic pop with introspective lyrics and indie-pop production."
  },
  {
    id: "rec4",
    track: {
      id: "track4",
      title: "Unholy",
      artist: "Sam Smith, Kim Petras",
      album: "Gloria",
      coverUrl: "https://place-hold.it/300x300/333/fff&text=Unholy",
      duration: 156,
      genres: ["Pop", "Dance"],
      playCount: 1345000
    },
    explanation: "This recommendation stems from your interest in boundary-pushing pop collaborations with distinctive vocal performances."
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
  
  likeTrack: (trackId) => set((state) => ({
    likedTracks: [...state.likedTracks, trackId]
  })),
  
  unlikeTrack: (trackId) => set((state) => ({
    likedTracks: state.likedTracks.filter(id => id !== trackId)
  })),
  
  isTrackLiked: (trackId) => {
    return get().likedTracks.includes(trackId);
  }
})); 