"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PlusCircle, SpotifyLogo, AppleLogo, Shuffle } from '@phosphor-icons/react';

// Popular genres to choose from
const GENRE_OPTIONS = [
  "Pop", "Rock", "Hip Hop", "R&B", "Jazz", "Classical", "Electronic", 
  "Folk", "Country", "Blues", "Metal", "Punk", "Reggae", "Soul", 
  "Funk", "Disco", "House", "Techno", "Ambient", "Indie"
];

// Popular mood options
const MOOD_OPTIONS = [
  "Happy", "Energetic", "Calm", "Melancholic", "Romantic", "Focused", 
  "Nostalgic", "Uplifting", "Dark", "Dreamy", "Intense", "Relaxed"
];

// Era options
const ERA_OPTIONS = [
  "2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s", "Classic"
];

export function AIPlaylistGenerator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [mood, setMood] = useState<string>('');
  const [duration, setDuration] = useState<number>(60); // minutes
  const [tempo, setTempo] = useState<string>('medium');
  const [era, setEra] = useState<string>('');
  const [isPublic, setIsPublic] = useState(false);
  
  // Loading state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [generatedPlaylist, setGeneratedPlaylist] = useState<any>(null);
  
  // Check if user is logged in
  if (status === 'unauthenticated') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            Please sign in to create AI-generated playlists
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push('/auth/signin')}>Sign In</Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Handle genre selection
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await fetch('/api/playlists/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          genres: selectedGenres,
          mood,
          duration,
          tempo,
          era,
          isPublic,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      
      const data = await response.json();
      setGeneratedPlaylist(data);
      setSuccess(true);
      
      // Optional: redirect to the playlist page
      // router.push(`/playlists/${data.playlist.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate playlist');
    } finally {
      setLoading(false);
    }
  };
  
  // Success view
  if (success && generatedPlaylist) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Playlist Generated!</CardTitle>
          <CardDescription className="text-center">
            Your AI-generated playlist is ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold">{generatedPlaylist.playlist.name}</h3>
            <p className="text-muted-foreground">{generatedPlaylist.playlist.description}</p>
            <p className="mt-2">Contains {generatedPlaylist.playlist.trackCount} tracks</p>
          </div>
          
          {generatedPlaylist.externalPlaylist && (
            <div className="flex flex-col items-center gap-3 mt-6">
              <p className="text-sm text-muted-foreground">Your playlist was also added to:</p>
              
              {generatedPlaylist.externalPlaylist.url.includes('spotify') && (
                <Button
                  className="w-full max-w-sm bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open(generatedPlaylist.externalPlaylist.url, '_blank')}
                >
                  {React.createElement(SpotifyLogo, { size: 20, weight: "duotone" })}
                  <span className="ml-2">Open in Spotify</span>
                </Button>
              )}
              
              {generatedPlaylist.externalPlaylist.url.includes('apple') && (
                <Button
                  className="w-full max-w-sm bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={() => window.open(generatedPlaylist.externalPlaylist.url, '_blank')}
                >
                  {React.createElement(AppleLogo, { size: 20, weight: "duotone" })}
                  <span className="ml-2">Open in Apple Music</span>
                </Button>
              )}
            </div>
          )}
          
          <div className="flex justify-center gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setGeneratedPlaylist(null);
                setName('');
                setDescription('');
                setSelectedGenres([]);
                setMood('');
                setDuration(60);
                setTempo('medium');
                setEra('');
                setIsPublic(false);
              }}
            >
              Create Another Playlist
            </Button>
            
            <Button
              onClick={() => router.push(`/playlists/${generatedPlaylist.playlist.id}`)}
            >
              View Playlist Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">AI Playlist Generator</CardTitle>
        <CardDescription className="text-center">
          Create a personalized playlist using our AI assistant
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Playlist Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer Vibes 2023"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this playlist about?"
                rows={2}
              />
            </div>
          </div>
          
          {/* Genres */}
          <div className="space-y-2">
            <Label>Genres (select up to 5)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {GENRE_OPTIONS.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
            {selectedGenres.length > 5 && (
              <p className="text-sm text-red-500">
                Please select no more than 5 genres
              </p>
            )}
          </div>
          
          {/* Mood */}
          <div>
            <Label htmlFor="mood">Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger id="mood">
                <SelectValue placeholder="Select a mood" />
              </SelectTrigger>
              <SelectContent>
                {MOOD_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Duration */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="duration">Duration</Label>
              <span className="text-sm text-muted-foreground">{duration} minutes</span>
            </div>
            <Slider
              id="duration"
              value={[duration]}
              min={15}
              max={180}
              step={15}
              onValueChange={(values) => setDuration(values[0])}
            />
          </div>
          
          {/* Tempo */}
          <div>
            <Label htmlFor="tempo">Tempo</Label>
            <Select value={tempo} onValueChange={setTempo}>
              <SelectTrigger id="tempo">
                <SelectValue placeholder="Select a tempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Era */}
          <div>
            <Label htmlFor="era">Era</Label>
            <Select value={era} onValueChange={setEra}>
              <SelectTrigger id="era">
                <SelectValue placeholder="Select an era" />
              </SelectTrigger>
              <SelectContent>
                {ERA_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Public/Private option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={isPublic}
              onCheckedChange={(checked: boolean) => setIsPublic(checked)}
            />
            <Label htmlFor="isPublic">Make this playlist public</Label>
          </div>
          
          {/* Error display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => {
              setSelectedGenres([]);
              setMood('');
              setTempo('medium');
              setEra('');
              setDuration(60);
              setIsPublic(false);
            }}
          >
            Reset
          </Button>
          
          <Button 
            type="submit"
            disabled={loading || !name || selectedGenres.length > 5}
            className="gap-2"
          >
            {loading ? (
              'Generating...'
            ) : (
              <>
                {React.createElement(Shuffle, { size: 18, weight: "duotone" })}
                Generate Playlist
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 