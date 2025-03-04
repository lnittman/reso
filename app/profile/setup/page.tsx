"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const POPULAR_GENRES = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 
  'Country', 'Folk', 'Indie', 'Metal', 'Punk', 'Blues', 'Reggae', 'Soul'
];

export default function ProfileSetup() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });
  
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customGenre, setCustomGenre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Skip if already loading
  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  const handleAddGenre = () => {
    if (customGenre && !selectedGenres.includes(customGenre)) {
      setSelectedGenres([...selectedGenres, customGenre]);
      setCustomGenre('');
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
    
    if (!username) {
      toast.error('Please enter a username');
      return;
    }
    
    if (selectedGenres.length === 0) {
      toast.error('Please select at least one genre');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          bio,
          favoriteGenres: selectedGenres,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create profile');
      }
      
      toast.success('Profile created successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us about your music taste to get personalized recommendations
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your music taste and interests"
                rows={3}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Favorite Genres</Label>
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveGenre(genre)}
                  >
                    {genre} ✕
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  placeholder="Add a custom genre"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddGenre}
                  disabled={!customGenre}
                >
                  Add
                </Button>
              </div>
              
              <div className="mt-2">
                <Label className="text-sm text-muted-foreground">Popular Genres</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {POPULAR_GENRES.map((genre) => (
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Profile...' : 'Complete Setup'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 