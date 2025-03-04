"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Robot, MusicNotes, SpotifyLogo, AppleLogo, YoutubeLogo } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratedPlaylist } from '@/lib/ai/openai';
import { StreamingService } from '@/lib/music/streaming';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock genre options
const genreOptions = [
  "Pop", "Rock", "Hip-Hop", "R&B", "Jazz", "Classical", "Electronic", 
  "Country", "Folk", "Metal", "Blues", "Reggae", "Punk", "Indie"
];

// Mood options with emoji representation
const moodOptions = [
  { value: "energetic", label: "Energetic ⚡", description: "Upbeat, fast-paced tracks to boost energy" },
  { value: "chill", label: "Chill 😌", description: "Relaxed, laid-back tracks for unwinding" },
  { value: "focus", label: "Focus 🧠", description: "Concentration-enhancing tracks for work or study" },
  { value: "melancholy", label: "Melancholy 😢", description: "Emotional, reflective tracks for introspection" },
  { value: "happy", label: "Happy 😊", description: "Cheerful, uplifting tracks to boost mood" },
  { value: "romantic", label: "Romantic ❤️", description: "Love songs and intimate ballads" }
];

// Era options
const eraOptions = [
  { value: "60s", label: "1960s" },
  { value: "70s", label: "1970s" },
  { value: "80s", label: "1980s" },
  { value: "90s", label: "1990s" },
  { value: "00s", label: "2000s" },
  { value: "10s", label: "2010s" },
  { value: "20s", label: "2020s" },
  { value: "mix", label: "Mix of eras" }
];

// Service options
const streamingServiceOptions = [
  { value: 'spotify', label: 'Spotify', icon: SpotifyLogo, color: 'text-green-500' },
  { value: 'apple', label: 'Apple Music', icon: AppleLogo, color: 'text-rose-500' },
  { value: 'youtube', label: 'YouTube Music', icon: YoutubeLogo, color: 'text-red-500' },
];

export function AIPlaylistGenerator() {
  // Playlist generator state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedEra, setSelectedEra] = useState("");
  const [trackCount, setTrackCount] = useState([15]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<GeneratedPlaylist | null>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'result'>('form');
  
  // Export dialog state
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<StreamingService>('spotify');
  const [isExporting, setIsExporting] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [exportLinks, setExportLinks] = useState<{webUrl: string, appDeepLink?: string} | null>(null);

  // Handle adding/removing genres
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else if (selectedGenres.length < 5) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      toast.warning("You can select up to 5 genres");
    }
  };

  // Reset form to generate a new playlist
  const resetForm = () => {
    setGeneratedPlaylist(null);
    setCurrentStep('form');
    setExportLinks(null);
  };

  // Handle playlist generation
  const handleGeneratePlaylist = async () => {
    // Validate inputs
    if (!name) {
      toast.error("Please enter a playlist name");
      return;
    }

    if (selectedGenres.length === 0) {
      toast.error("Please select at least one genre");
      return;
    }

    setIsGenerating(true);

    try {
      // Call the API to generate a playlist
      const response = await fetch('/api/playlists/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          mood: selectedMood,
          genres: selectedGenres,
          era: selectedEra,
          trackCount: trackCount[0]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate playlist');
      }

      const data = await response.json();
      setGeneratedPlaylist(data);
      setCurrentStep('result');
      toast.success("Playlist generated successfully!");
    } catch (error) {
      console.error('Error generating playlist:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate playlist');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle playlist export
  const handleExportPlaylist = async () => {
    if (!generatedPlaylist) return;
    
    setIsExporting(true);
    
    try {
      const response = await fetch('/api/playlists/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: generatedPlaylist.name,
          description: generatedPlaylist.description,
          tracks: generatedPlaylist.tracks,
          service: selectedService,
          isPublic
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export playlist');
      }
      
      const data = await response.json();
      setExportLinks({
        webUrl: data.links.webUrl,
        appDeepLink: data.links.appDeepLink
      });
      
      toast.success(`Playlist exported to ${selectedService}!`);
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error('Error exporting playlist:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export playlist');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Open export dialog
  const openExportDialog = () => {
    setSelectedService('spotify');
    setIsPublic(false);
    setIsExportDialogOpen(true);
  };

  // Render the playlist generation form
  const renderForm = () => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          {React.createElement(Robot, { size: 24, weight: "duotone" })}
          <div>
            <CardTitle>AI Playlist Generator</CardTitle>
            <CardDescription>Let AI create your perfect playlist</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Playlist Name & Description */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="playlist-name">Playlist Name</Label>
            <Input 
              id="playlist-name"
              placeholder="e.g., Summer Road Trip Mix"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="playlist-description">Description (Optional)</Label>
            <Input 
              id="playlist-description"
              placeholder="What's this playlist for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        
        {/* Mood Selection */}
        <div>
          <Label>Mood</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {moodOptions.map((mood) => (
              <Button
                key={mood.value}
                variant={selectedMood === mood.value ? "default" : "outline"}
                className="justify-start h-auto py-2"
                onClick={() => setSelectedMood(mood.value)}
              >
                <div className="text-left">
                  <div className="font-medium">{mood.label}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{mood.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Genre Selection */}
        <div>
          <div className="flex items-center justify-between">
            <Label>Genres (up to 5)</Label>
            <span className="text-xs text-muted-foreground">{selectedGenres.length}/5 selected</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {genreOptions.map((genre) => (
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
        </div>
        
        {/* Era Selection */}
        <div>
          <Label htmlFor="era-select">Era</Label>
          <Select value={selectedEra} onValueChange={setSelectedEra}>
            <SelectTrigger id="era-select">
              <SelectValue placeholder="Select an era" />
            </SelectTrigger>
            <SelectContent>
              {eraOptions.map((era) => (
                <SelectItem key={era.value} value={era.value}>
                  {era.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Track Count */}
        <div>
          <div className="flex items-center justify-between">
            <Label>Number of Tracks</Label>
            <span className="text-sm font-medium">{trackCount[0]}</span>
          </div>
          <Slider
            value={trackCount}
            onValueChange={setTrackCount}
            min={5}
            max={30}
            step={1}
            className="mt-2"
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleGeneratePlaylist} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {React.createElement(MusicNotes, { size: 18, weight: "duotone" })}
              <span>Generate Playlist</span>
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  // Render the generated playlist
  const renderResult = () => {
    if (!generatedPlaylist) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{generatedPlaylist.name}</h2>
          <Button variant="outline" onClick={resetForm}>
            Create Another
          </Button>
        </div>
        
        <p className="text-muted-foreground">{generatedPlaylist.description}</p>
        
        <div className="bg-accent/50 p-4 rounded-lg">
          <p className="italic">{generatedPlaylist.explanation}</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Tracks</h3>
          
          <div className="divide-y">
            {generatedPlaylist.tracks.map((track, index) => (
              <div key={index} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{track.title}</h4>
                    <p>{track.artist}</p>
                    {track.album && <p className="text-sm text-muted-foreground">{track.album} {track.year ? `(${track.year})` : ''}</p>}
                  </div>
                  
                  <div className="flex gap-1">
                    {track.genres?.map(genre => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-muted-foreground">{track.explanation}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-8">
          <Button variant="outline" onClick={resetForm}>
            Create New Playlist
          </Button>
          
          <Button onClick={openExportDialog}>
            Export to Streaming Service
          </Button>
        </div>
        
        {exportLinks && (
          <div className="mt-4 p-4 border rounded-lg bg-accent/10">
            <h3 className="font-medium mb-2">Playlist Exported!</h3>
            <div className="flex flex-col gap-2">
              <a 
                href={exportLinks.webUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Open in Browser
              </a>
              
              {exportLinks.appDeepLink && (
                <a 
                  href={exportLinks.appDeepLink}
                  className="text-blue-500 hover:underline"
                >
                  Open in App
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Export dialog component
  const renderExportDialog = () => (
    <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Playlist</DialogTitle>
          <DialogDescription>
            Choose a streaming service to export your generated playlist.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Label>Streaming Service</Label>
          <div className="grid grid-cols-3 gap-2">
            {streamingServiceOptions.map((service) => (
              <Button
                key={service.value}
                variant={selectedService === service.value ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24"
                onClick={() => setSelectedService(service.value as StreamingService)}
              >
                {React.createElement(service.icon, { 
                  size: 32, 
                  weight: "duotone",
                  className: service.color
                })}
                <span className="mt-2">{service.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <input 
              type="checkbox" 
              id="isPublic" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
              className="w-4 h-4"
            />
            <Label htmlFor="isPublic">Make playlist public</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsExportDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExportPlaylist}
            disabled={isExporting}
          >
            {isExporting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Exporting...</span>
              </div>
            ) : (
              <span>Export Playlist</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div>
      {currentStep === 'form' ? renderForm() : renderResult()}
      {renderExportDialog()}
    </div>
  );
} 