/**
 * OpenAI API integration for reso
 * 
 * This module provides utilities for interacting with the OpenAI API
 * to generate playlists and explanations based on user preferences.
 */

// Types for playlist generation parameters
export interface PlaylistGenerationParams {
  name: string;
  description?: string;
  mood?: string;
  genres?: string[];
  era?: string;
  trackCount?: number;
}

// Types for the generated playlist
export interface GeneratedTrack {
  title: string;
  artist: string;
  album?: string;
  year?: string;
  explanation: string;
  genres?: string[];
}

export interface GeneratedPlaylist {
  name: string;
  description: string;
  tracks: GeneratedTrack[];
  coverDescription?: string;
  explanation: string;
}

/**
 * Generates a music playlist based on user preferences using OpenAI
 * @param params The parameters for playlist generation
 * @returns A generated playlist with tracks and explanations
 */
export async function generatePlaylist(params: PlaylistGenerationParams): Promise<GeneratedPlaylist> {
  try {
    // In a production environment, you would use an actual API key stored in environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // For development, use mock data if no API key is present
      return generateMockPlaylist(params);
    }
    
    // Prepare the prompt for the OpenAI API
    const prompt = createPlaylistPrompt(params);
    
    // Call the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'You are a music expert who creates personalized playlists based on user preferences. Your responses should be in JSON format.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    // Process and validate the response
    return processApiResponse(result, params);
    
  } catch (error) {
    console.error('Error generating playlist:', error);
    
    // Fallback to mock data in case of an error
    return generateMockPlaylist(params);
  }
}

/**
 * Creates a prompt for the OpenAI API based on playlist parameters
 * @param params The playlist generation parameters
 * @returns A formatted prompt string
 */
function createPlaylistPrompt(params: PlaylistGenerationParams): string {
  const { name, description, mood, genres, era, trackCount = 10 } = params;
  
  let prompt = `Create a playlist called "${name}"`;
  
  if (description) {
    prompt += ` described as "${description}"`;
  }
  
  prompt += ` with ${trackCount} tracks`;
  
  if (mood) {
    prompt += ` with a ${mood} mood`;
  }
  
  if (genres && genres.length > 0) {
    prompt += ` in the ${genres.join(', ')} genre${genres.length > 1 ? 's' : ''}`;
  }
  
  if (era) {
    prompt += ` from the ${era}`;
  }
  
  prompt += ".\n\n";
  prompt += "For each track, provide the title, artist, album, release year, and a brief explanation of why it fits the playlist.\n";
  prompt += "Also provide an overall explanation of the playlist's theme and mood.\n";
  prompt += "Format your response as a JSON object with the following structure:\n";
  prompt += `{
    "name": "Playlist name",
    "description": "Playlist description",
    "explanation": "Overall explanation of the playlist's theme",
    "coverDescription": "A description of what would make a good cover image for this playlist",
    "tracks": [
      {
        "title": "Track title",
        "artist": "Artist name",
        "album": "Album name",
        "year": "Release year",
        "explanation": "Why this track fits the playlist",
        "genres": ["genre1", "genre2"]
      }
    ]
  }`;
  
  return prompt;
}

/**
 * Processes and validates the OpenAI API response
 * @param result The parsed API response
 * @param params The original parameters for fallback values
 * @returns A properly formatted generated playlist
 */
function processApiResponse(result: any, params: PlaylistGenerationParams): GeneratedPlaylist {
  // Basic validation and defaults
  const playlist: GeneratedPlaylist = {
    name: result.name || params.name,
    description: result.description || params.description || `A ${params.mood || 'custom'} playlist`,
    explanation: result.explanation || `A playlist based on your preferences.`,
    tracks: [],
    coverDescription: result.coverDescription
  };
  
  // Process tracks
  if (Array.isArray(result.tracks)) {
    playlist.tracks = result.tracks.map((track: any) => ({
      title: track.title || 'Unknown Title',
      artist: track.artist || 'Unknown Artist',
      album: track.album,
      year: track.year,
      explanation: track.explanation || 'This track fits the playlist theme.',
      genres: Array.isArray(track.genres) ? track.genres : params.genres
    }));
  }
  
  return playlist;
}

/**
 * Generates mock playlist data for development without API calls
 * @param params The playlist generation parameters
 * @returns A mock generated playlist
 */
function generateMockPlaylist(params: PlaylistGenerationParams): GeneratedPlaylist {
  const { name, description, mood = 'energetic', genres = ['Pop'], era = '2020s', trackCount = 10 } = params;
  
  // Sample artists, titles, and albums for different genres
  const genreData: Record<string, { artists: string[], albums: string[], titlePrefixes: string[] }> = {
    'Pop': {
      artists: ['Taylor Swift', 'Ariana Grande', 'The Weeknd', 'Dua Lipa', 'Harry Styles', 'Olivia Rodrigo'],
      albums: ['Midnights', 'Positions', 'After Hours', 'Future Nostalgia', 'Fine Line', 'SOUR'],
      titlePrefixes: ['Love', 'Dance', 'Sweet', 'Night', 'Summer', 'Heart']
    },
    'Hip-Hop': {
      artists: ['Kendrick Lamar', 'Drake', 'J. Cole', 'Megan Thee Stallion', 'Tyler, The Creator'],
      albums: ['Mr. Morale & The Big Steppers', 'Certified Lover Boy', 'The Off-Season', 'Good News', 'CALL ME IF YOU GET LOST'],
      titlePrefixes: ['Flow', 'Beat', 'Rhythm', 'City', 'Dream', 'Move']
    },
    'Rock': {
      artists: ['Arctic Monkeys', 'Tame Impala', 'The Killers', 'Twenty One Pilots', 'Imagine Dragons'],
      albums: ['AM', 'Currents', 'Imploding the Mirage', 'Scaled and Icy', 'Mercury – Act 1'],
      titlePrefixes: ['Electric', 'Wild', 'Storm', 'Midnight', 'Epic', 'Freedom']
    },
    'Electronic': {
      artists: ['Calvin Harris', 'Daft Punk', 'Disclosure', 'Flume', 'ODESZA'],
      albums: ['Funk Wav Bounces Vol. 1', 'Random Access Memories', 'Energy', 'Palaces', 'A Moment Apart'],
      titlePrefixes: ['Pulse', 'Wave', 'Digital', 'Neon', 'Cyber', 'Space']
    }
  };
  
  // Use the first genre provided or default to Pop
  const primaryGenre = genres[0] || 'Pop';
  const genreInfo = genreData[primaryGenre] || genreData['Pop'];
  
  // Generate random tracks
  const tracks: GeneratedTrack[] = [];
  for (let i = 0; i < trackCount; i++) {
    const artist = genreInfo.artists[Math.floor(Math.random() * genreInfo.artists.length)];
    const album = genreInfo.albums[Math.floor(Math.random() * genreInfo.albums.length)];
    const titlePrefix = genreInfo.titlePrefixes[Math.floor(Math.random() * genreInfo.titlePrefixes.length)];
    const titleSuffix = ['Nights', 'Dreams', 'Love', 'Life', 'Time', 'Soul', 'Heart'][Math.floor(Math.random() * 7)];
    
    tracks.push({
      title: `${titlePrefix} ${titleSuffix}`,
      artist,
      album,
      year: era.includes('0s') ? era.substring(0, 3) + '5' : '2022',
      explanation: `This ${primaryGenre.toLowerCase()} track by ${artist} perfectly captures the ${mood} vibe of the playlist with its ${['catchy', 'melodic', 'rhythmic', 'pulsating', 'smooth'][Math.floor(Math.random() * 5)]} production and ${['emotional', 'upbeat', 'chill', 'energetic', 'thoughtful'][Math.floor(Math.random() * 5)]} lyrics.`,
      genres: [primaryGenre, ...(genres.slice(1, 2))]
    });
  }
  
  // Create overall explanation based on parameters
  const moodAdjective = {
    'energetic': 'high-energy',
    'chill': 'relaxed',
    'melancholy': 'introspective',
    'happy': 'uplifting',
    'focus': 'concentration-enhancing',
    'romantic': 'intimate'
  }[mood] || 'distinctive';
  
  const eraDescription = {
    '60s': 'classic 1960s',
    '70s': 'iconic 1970s',
    '80s': 'nostalgic 1980s',
    '90s': 'golden era 1990s',
    '00s': 'early 2000s',
    '10s': '2010s',
    '20s': 'contemporary',
    'mix': 'cross-era'
  }[era] || 'contemporary';
  
  return {
    name,
    description: description || `A ${moodAdjective} playlist featuring ${eraDescription} ${genres.join(', ')}`,
    explanation: `This playlist brings together ${tracks.length} ${moodAdjective} tracks in the ${genres.join(', ')} genre${genres.length > 1 ? 's' : ''} from the ${eraDescription} era, creating a cohesive journey through sound that captures the essence of ${mood} energy. Each track was selected to maintain the flow while offering enough variety to keep the listener engaged.`,
    coverDescription: `An abstract image with ${mood === 'energetic' ? 'vibrant' : mood === 'chill' ? 'cool' : mood === 'melancholy' ? 'muted' : 'warm'} colors representing the ${moodAdjective} nature of the playlist, potentially featuring elements of ${eraDescription} ${primaryGenre.toLowerCase()} culture.`,
    tracks
  };
} 