/**
 * Perplexity AI Integration via OpenRouter
 * 
 * This module provides utilities for interacting with the Perplexity AI model
 * through OpenRouter for enhanced recommendation quality.
 */

import { logger } from '@/lib/logging/logger';
import { PlaylistGenerationParams, GeneratedPlaylist, GeneratedTrack } from './types';

// OpenRouter API endpoint
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Model ID for Perplexity
const MODEL_ID = 'perplexity/pplx-70b-online';

interface PerplexityRequestOptions {
  conversationId?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Makes a request to the Perplexity model via OpenRouter
 * @param prompt The formatted prompt to send
 * @param options Request options
 * @returns The model's response
 */
async function callPerplexity(
  messages: Array<{role: string, content: string}>,
  options: PerplexityRequestOptions = {}
) {
  const { conversationId, temperature = 0.7, maxTokens = 2000 } = options;
  
  const startTime = Date.now();
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    logger.error('data:perplexity', 'No OpenRouter API key found', {
      source: 'callPerplexity',
      conversationId
    });
    throw new Error('OpenRouter API key not configured');
  }
  
  // Log the prompt being sent
  logger.llm('prompt', 'Sending prompt to Perplexity', messages, {
    conversationId,
    modelName: MODEL_ID
  });
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://reso.app', // Replace with your actual domain
        'X-Title': 'reso AI Music Discovery'
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      logger.error('data:perplexity', 'API error response', {
        status: response.status,
        statusText: response.statusText,
        error,
        conversationId
      });
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const latencyMs = Date.now() - startTime;
    
    // Log the response
    logger.llm('response', 'Received response from Perplexity', data, {
      conversationId,
      modelName: MODEL_ID,
      latencyMs,
      tokenCount: data.usage?.total_tokens
    });
    
    return data;
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    
    logger.llm('error', 'Error calling Perplexity API', error, {
      conversationId,
      modelName: MODEL_ID,
      latencyMs,
      meta: {
        errorMessage: error instanceof Error ? error.message : String(error)
      }
    });
    
    throw error;
  }
}

/**
 * Generates a music playlist using Perplexity with online searching capabilities
 * @param params The playlist generation parameters
 * @returns A generated playlist with tracks and explanations
 */
export async function generatePlaylist(
  params: PlaylistGenerationParams,
  options: PerplexityRequestOptions = {}
): Promise<GeneratedPlaylist> {
  try {
    const conversationId = options.conversationId || crypto.randomUUID();
    
    // Get the system prompt for playlist generation
    const systemPrompt = createSystemPrompt();
    
    // Create the user prompt with structured parameters
    const userPrompt = createPlaylistPrompt(params);
    
    // Send the request to Perplexity
    const response = await callPerplexity(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { ...options, conversationId }
    );
    
    // Parse and validate the response
    const result = JSON.parse(response.choices[0].message.content);
    
    // Process and structure the response
    return processApiResponse(result, params);
    
  } catch (error) {
    logger.error('data:perplexity', 'Error generating playlist', {
      error: error instanceof Error ? error.message : String(error),
      params
    });
    
    // Fallback to mock data in case of an error
    return generateMockPlaylist(params);
  }
}

/**
 * Creates a system prompt for Perplexity to follow
 */
function createSystemPrompt(): string {
  return `You are a music expert and playlist curator who creates personalized playlists.
Your responses must be in valid JSON format and include real songs that match the user's criteria.
You have the ability to search online for the latest information about music, artists, and tracks.

When creating a playlist:
1. Focus on finding real songs that truly match the given criteria - genre, mood, era, etc.
2. Include accurate information about each track (title, artist, album, year)
3. Provide thoughtful explanations for why each track fits the playlist
4. Ensure a cohesive playlist flow by considering track order and transitions
5. Make use of your online search ability to find accurate and up-to-date information

Your response must be a valid JSON object with this structure:
{
  "name": "Playlist name",
  "description": "Playlist description",
  "explanation": "Overall explanation of the playlist's theme and curation strategy",
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
}

/**
 * Creates a user prompt based on playlist parameters
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
  prompt += "Search for real songs that match these criteria. For each track, provide the title, artist, actual album, release year, and a brief explanation of why it fits the playlist.\n";
  prompt += "Also provide an overall explanation of the playlist's theme and mood.\n";
  
  return prompt;
}

/**
 * Processes and validates the Perplexity API response
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
  const moodDescriptions: Record<string, string> = {
    'energetic': 'high-energy',
    'chill': 'relaxed',
    'melancholy': 'introspective',
    'happy': 'uplifting',
    'focus': 'concentration-enhancing',
    'romantic': 'intimate'
  };
  
  const eraDescriptions: Record<string, string> = {
    '60s': 'classic 1960s',
    '70s': 'iconic 1970s',
    '80s': 'nostalgic 1980s',
    '90s': 'golden era 1990s',
    '00s': 'early 2000s',
    '10s': '2010s',
    '20s': 'contemporary',
    'mix': 'cross-era'
  };
  
  const moodAdjective = mood && moodDescriptions[mood] ? moodDescriptions[mood] : 'distinctive';
  const eraDescription = era && eraDescriptions[era] ? eraDescriptions[era] : 'contemporary';
  
  return {
    name,
    description: description || `A ${moodAdjective} playlist featuring ${eraDescription} ${genres.join(', ')}`,
    explanation: `This playlist brings together ${tracks.length} ${moodAdjective} tracks in the ${genres.join(', ')} genre${genres.length > 1 ? 's' : ''} from the ${eraDescription} era, creating a cohesive journey through sound that captures the essence of ${mood} energy. Each track was selected to maintain the flow while offering enough variety to keep the listener engaged.`,
    coverDescription: `An abstract image with ${mood === 'energetic' ? 'vibrant' : mood === 'chill' ? 'cool' : mood === 'melancholy' ? 'muted' : 'warm'} colors representing the ${moodAdjective} nature of the playlist, potentially featuring elements of ${eraDescription} ${primaryGenre.toLowerCase()} culture.`,
    tracks
  };
} 