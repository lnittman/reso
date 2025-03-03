"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Heart, Plus, Shuffle } from "@phosphor-icons/react";
import { usePlayerStore, useMusicStore } from '@/lib/store';

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

type TrackCardProps = {
  track: Track;
  explanation?: string;
};

export function TrackCard({ track, explanation }: TrackCardProps) {
  // Add debugging log to see what track data we're receiving
  React.useEffect(() => {
    console.log("TrackCard received:", track);
  }, [track]);
  
  const playerStore = usePlayerStore();
  const musicStore = useMusicStore();
  
  // Use optional chaining and nullish coalescing to safely access properties
  const liked = musicStore?.likedTracks?.includes(track?.id) ?? false;

  const handlePlay = () => {
    playerStore?.playTrack?.(track);
  };

  const handleLike = () => {
    musicStore?.likeTrack?.(track?.id);
  };

  // Ensure we have safe access to all track properties
  const title = track?.title || 'Unknown Title';
  const artist = track?.artist || 'Unknown Artist';
  const album = track?.album || 'Unknown Album';
  const coverUrl = track?.coverUrl || 'https://placehold.co/400x400/333/FFF?text=No+Image';
  const genres = track?.genres || [];
  const playCount = track?.playCount || 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img 
            src={coverUrl} 
            alt={`${album} by ${artist}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button size="icon" variant="secondary" className="rounded-full h-10 w-10" onClick={handlePlay}>
              {React.createElement(Play, { size: 18, weight: "duotone" })}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-1 text-lg font-semibold line-clamp-1">{title}</div>
        <div className="text-sm text-muted-foreground line-clamp-1">{artist}</div>
        <div className="mt-3 flex flex-wrap gap-1">
          {genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        {explanation && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {explanation}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="text-xs text-muted-foreground">
          {Math.floor(playCount / 1000)}k plays
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleLike}>
            {React.createElement(Heart, { 
              size: 18, 
              weight: liked ? "fill" : "duotone",
              className: liked ? "text-red-500" : ""
            })}
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            {React.createElement(Plus, { size: 18, weight: "duotone" })}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 