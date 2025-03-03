"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackCard } from './TrackCard';
import { useMusicStore } from '@/lib/store';

// Define a complete track type to ensure proper data structure
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

// Ensure each track has all required fields
const ensureCompleteTrack = (track: any): Track => {
  return {
    id: track?.id || `temp-${Math.random()}`,
    title: track?.title || 'Unknown Title',
    artist: track?.artist || 'Unknown Artist',
    album: track?.album || 'Unknown Album',
    coverUrl: track?.coverUrl || 'https://placehold.co/400x400/333/FFF?text=No+Image',
    duration: track?.duration || 0,
    genres: Array.isArray(track?.genres) ? track.genres : [],
    playCount: track?.playCount || 0
  };
};

// Mock data for initial development
const mockRecommendations = [
  {
    id: '1',
    track: {
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
      title: 'Heather',
      artist: 'Conan Gray',
      album: 'Kid Krow',
      coverImage: 'https://place-hold.it/300x300/333/fff&text=Heather',
      duration: 198
    },
    explanation: 'This recommendation stems from your recent exploration of indie pop with vulnerable lyrics and minimalist production.'
  },
];

export function DailyRecommendations() {
  // Use the store directly
  const musicStore = useMusicStore();
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Load mock data when component mounts
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      musicStore?.loadMockData?.();
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [musicStore]);

  // Console log to debug what's in the store
  useEffect(() => {
    console.log("Music store:", musicStore);
  }, [musicStore]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Today's Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Get recommendations with safe fallback
  const recommendationsRaw = musicStore?.dailyRecommendations || [];
  
  // Ensure each recommendation has a complete track
  const recommendations = recommendationsRaw.map(rec => ({
    id: rec?.id || `temp-${Math.random()}`,
    track: ensureCompleteTrack(rec?.track),
    explanation: rec?.explanation || ''
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Today's Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation) => (
          <TrackCard
            key={recommendation.id}
            track={recommendation.track}
            explanation={recommendation.explanation}
          />
        ))}
      </div>
    </div>
  );
} 