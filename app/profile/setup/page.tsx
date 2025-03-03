"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from '@phosphor-icons/react';

// Mock genre options
const GENRE_OPTIONS = [
  "Pop", "Rock", "Hip Hop", "R&B", "Jazz", "Classical", "Electronic", 
  "Folk", "Country", "Blues", "Metal", "Punk", "Reggae", "Soul", 
  "Funk", "Disco", "House", "Techno", "Ambient", "Indie"
];

export default function ProfileSetup() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if session is loading
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAddGenre = () => {
    if (newGenre && !selectedGenres.includes(newGenre)) {
      setSelectedGenres([...selectedGenres, newGenre]);
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genre));
  };

  const handleSelectGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      handleRemoveGenre(genre);
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, we would make an API call to update the user profile
      // For now, we'll just simulate a delay and redirect to the home page
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to home page after successful profile setup
      router.push('/');
    } catch (error) {
      console.error('Error setting up profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us about your musical preferences so we can tailor recommendations for you
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Display Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How you want to be known on reso"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a bit about your music taste and interests"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">
                Favorite Genres
              </label>
              
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer"
                    onClick={() => handleRemoveGenre(genre)}
                  >
                    {genre} ✕
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="Add a genre"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGenre();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddGenre}
                >
                  {React.createElement(PlusCircle, { size: 20, weight: "duotone" })}
                </Button>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Popular genres:</p>
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((genre) => (
                    <Badge 
                      key={genre} 
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleSelectGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!name || selectedGenres.length === 0 || loading}
            >
              {loading ? "Setting up your profile..." : "Continue to reso"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 