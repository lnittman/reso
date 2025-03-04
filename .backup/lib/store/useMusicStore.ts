import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  duration?: number;
  playCount?: number;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  trackCount: number;
  tracks?: Track[];
}

interface MusicState {
  // Recommendations
  dailyRecommendations: {
    id: string;
    track: Track;
    explanation?: string;
  }[];
  
  // Favorites
  favoriteTracks: Track[];
  addToFavorites: (track: Track) => void;
  removeFromFavorites: (trackId: string) => void;
  
  // Playlists
  userPlaylists: Playlist[];
  createPlaylist: (playlist: Omit<Playlist, 'id' | 'trackCount'> & { tracks?: Track[] }) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  
  // Mock data setup (would be replaced with API calls in production)
  loadMockData: () => void;
}

// Mock data initialization
const mockRecommendations = [
  {
    id: '1',
    track: {
      id: 'track1',
      title: 'Motion',
      artist: 'Fred Again..',
      album: 'USB Flash Drive',
      coverImage: 'https://place-hold.it/300x300/333/fff&text=Motion',
      duration: 210
    },
    explanation: 'Based on your interest in electronic music with emotive vocals, this track combines ambient textures with UK garage influences.'
  },
  {
    id: '2',
    track: {
      id: 'track2',
      title: 'Bitch, Don\'t Kill My Vibe',
      artist: 'Kendrick Lamar',
      album: 'good kid, m.A.A.d city',
      coverImage: 'https://place-hold.it/300x300/333/fff&text=GKMC',
      duration: 308
    },
    explanation: 'Your listening history shows appreciation for lyrical hip-hop with introspective themes, which is a hallmark of this track.'
  },
  {
    id: '3',
    track: {
      id: 'track3',
      title: 'Heather',
      artist: 'Conan Gray',
      album: 'Kid Krow',
      coverImage: 'https://place-hold.it/300x300/333/fff&text=Heather',
      duration: 198
    },
    explanation: 'This recommendation stems from your recent exploration of indie pop with vulnerable lyrics and minimalist production.'
  },
];

const mockFavoriteTracks = [
  {
    id: 'fav1',
    title: 'Late Night Talking',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=HS',
    playCount: 47
  },
  {
    id: 'fav2',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=HS',
    playCount: 36
  },
  {
    id: 'fav3',
    title: 'Break My Soul',
    artist: 'Beyoncé',
    album: 'Renaissance',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=B',
    playCount: 29
  },
];

const mockPlaylists = [
  {
    id: 'playlist1',
    name: 'Summer Vibes 2023',
    description: 'Perfect playlist for sunny days',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=SV',
    trackCount: 23,
    tracks: []
  },
  {
    id: 'playlist2',
    name: 'Workout Mix',
    description: 'High energy tracks to keep you moving',
    coverImage: 'https://place-hold.it/300x300/333/fff&text=WM',
    trackCount: 18,
    tracks: []
  },
];

export const useMusicStore = create<MusicState>((set) => ({
  dailyRecommendations: [],
  favoriteTracks: [],
  userPlaylists: [],
  
  addToFavorites: (track) => set((state) => ({
    favoriteTracks: [...state.favoriteTracks.filter(t => t.id !== track.id), track]
  })),
  
  removeFromFavorites: (trackId) => set((state) => ({
    favoriteTracks: state.favoriteTracks.filter(track => track.id !== trackId)
  })),
  
  createPlaylist: (playlistData) => set((state) => {
    const tracks = playlistData.tracks || [];
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      ...playlistData,
      trackCount: tracks.length,
      tracks
    };
    return {
      userPlaylists: [...state.userPlaylists, newPlaylist]
    };
  }),
  
  addToPlaylist: (playlistId, track) => set((state) => ({
    userPlaylists: state.userPlaylists.map(playlist => 
      playlist.id === playlistId 
        ? { 
            ...playlist, 
            tracks: [...(playlist.tracks || []).filter(t => t.id !== track.id), track],
            trackCount: (playlist.tracks || []).filter(t => t.id !== track.id).length + 1
          }
        : playlist
    )
  })),
  
  removeFromPlaylist: (playlistId, trackId) => set((state) => ({
    userPlaylists: state.userPlaylists.map(playlist => 
      playlist.id === playlistId 
        ? { 
            ...playlist, 
            tracks: (playlist.tracks || []).filter(t => t.id !== trackId),
            trackCount: (playlist.tracks || []).filter(t => t.id !== trackId).length
          }
        : playlist
    )
  })),
  
  loadMockData: () => set({
    dailyRecommendations: mockRecommendations,
    favoriteTracks: mockFavoriteTracks,
    userPlaylists: mockPlaylists
  })
})); 