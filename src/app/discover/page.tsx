"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MagnifyingGlass, Shuffle } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDiscoverStore } from '@/lib/store';

// Mock genre data
const genres = [
  { id: 'pop', name: 'Pop', color: 'bg-pink-500' },
  { id: 'rock', name: 'Rock', color: 'bg-red-500' },
  { id: 'hip-hop', name: 'Hip Hop', color: 'bg-yellow-500' },
  { id: 'electronic', name: 'Electronic', color: 'bg-blue-500' },
  { id: 'indie', name: 'Indie', color: 'bg-purple-500' },
  { id: 'r-b', name: 'R&B', color: 'bg-green-500' },
  { id: 'jazz', name: 'Jazz', color: 'bg-orange-500' },
  { id: 'classical', name: 'Classical', color: 'bg-slate-500' },
];

// Mock mood data
const moods = [
  { id: 'chill', name: 'Chill', emoji: '😌' },
  { id: 'energetic', name: 'Energetic', emoji: '⚡' },
  { id: 'happy', name: 'Happy', emoji: '😊' },
  { id: 'sad', name: 'Sad', emoji: '😢' },
  { id: 'focus', name: 'Focus', emoji: '🧠' },
  { id: 'workout', name: 'Workout', emoji: '💪' },
];

export default function DiscoverPage() {
  // Use the Zustand store instead of local state or context
  const { 
    genres, 
    moods, 
    selectedGenreId, 
    selectedMoodId, 
    searchQuery,
    setSelectedGenreId,
    setSelectedMoodId,
    setSearchQuery
  } = useDiscoverStore();
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle genre selection
  const handleGenreClick = (genreId: string) => {
    setSelectedGenreId(selectedGenreId === genreId ? null : genreId);
  };
  
  // Handle mood selection
  const handleMoodClick = (moodId: string) => {
    setSelectedMoodId(selectedMoodId === moodId ? null : moodId);
  };
  
  // Handle shuffle button click
  const handleShuffle = () => {
    const randomGenreIndex = Math.floor(Math.random() * genres.length);
    setSelectedGenreId(genres[randomGenreIndex].id);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Discover</h1>
        <div className="relative">
          {React.createElement(MagnifyingGlass, { 
            className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground", 
            weight: "duotone" 
          })}
          <Input 
            placeholder="Search for artists, songs, or albums..." 
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </section>
      
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Browse by Genre</h2>
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleShuffle}>
            {React.createElement(Shuffle, { className: "h-4 w-4", weight: "duotone" })}
            Shuffle
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <Card 
              key={genre.id} 
              className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                selectedGenreId === genre.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleGenreClick(genre.id)}
            >
              <div className={`h-2 ${genre.color}`} />
              <CardContent className="p-4">
                <p className="font-medium">{genre.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Explore by Mood</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {moods.map((mood) => (
            <Card 
              key={mood.id} 
              className={`text-center hover:shadow-md transition-shadow cursor-pointer ${
                selectedMoodId === mood.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleMoodClick(mood.id)}
            >
              <CardContent className="p-4">
                <p className="text-3xl mb-2">{mood.emoji}</p>
                <p className="font-medium">{mood.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Personalized Stations</CardTitle>
            <CardDescription>
              AI-generated stations based on your listening history
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Chill Electronic Mix', 'Indie Discoveries', 'Hip Hop Essentials'].map((station) => (
              <div key={station} className="bg-accent rounded-lg p-4 flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/20 rounded-md flex items-center justify-center">
                  {React.createElement(Shuffle, { className: "h-6 w-6 text-primary", weight: "duotone" })}
                </div>
                <div>
                  <p className="font-medium">{station}</p>
                  <p className="text-sm text-muted-foreground">Based on your recent plays</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 