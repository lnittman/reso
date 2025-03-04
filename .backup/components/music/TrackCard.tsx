import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayIcon, HeartIcon, ShareIcon, MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Track {
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  duration?: number;
}

interface TrackCardProps {
  track: Track;
  explanation?: string;
}

export function TrackCard({ track, explanation }: TrackCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-square bg-muted">
        {track.coverImage ? (
          <img 
            src={track.coverImage} 
            alt={`${track.title} by ${track.artist}`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-accent">
            <span className="text-accent-foreground text-4xl font-bold opacity-20">
              {track.title[0] + track.artist[0]}
            </span>
          </div>
        )}
        <button className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
          <PlayIcon className="h-6 w-6" />
        </button>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-1">{track.title}</CardTitle>
        <CardDescription className="line-clamp-1">{track.artist}</CardDescription>
      </CardHeader>
      
      {explanation && (
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {explanation}
          </p>
        </CardContent>
      )}
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {track.album && <span>{track.album} • </span>}
          <span>{formatDuration(track.duration)}</span>
        </div>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <HeartIcon className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <ShareIcon className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 