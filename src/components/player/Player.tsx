"use client";

import React, { useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { usePlayerStore, useUIStore } from '@/lib/store';
import { SkipBack, SkipForward, Play, Pause, SpeakerHigh, Queue, ArrowsOutCardinal, ArrowsInCardinal } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Player() {
  // Access stores directly
  const playerStore = usePlayerStore();
  const uiStore = useUIStore();

  // Debug log stores
  useEffect(() => {
    console.log("Player store:", playerStore);
    console.log("UI store:", uiStore);
  }, [playerStore, uiStore]);

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for the slider with safety checks
  const duration = playerStore?.duration || 0;
  const progress = playerStore?.progress || 0;
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  // Handle play/pause toggle
  const handlePlayPause = () => {
    if (playerStore?.isPlaying) {
      playerStore?.pauseTrack?.();
    } else {
      playerStore?.resumeTrack?.();
    }
  };

  // If no track is playing, show minimized player with placeholder
  if (!playerStore?.currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t h-16 flex items-center px-4 md:px-6">
        <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            No track playing
          </div>
        </div>
      </div>
    );
  }

  // Safely access currentTrack
  const currentTrack = playerStore.currentTrack;
  const isPlayerExpanded = uiStore?.isPlayerExpanded || false;
  const isPlaying = playerStore?.isPlaying || false;
  const volume = playerStore?.volume || 50;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background border-t transition-all duration-300",
      isPlayerExpanded ? "h-96" : "h-16"
    )}>
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col h-full">
        {/* Expanded View */}
        {isPlayerExpanded && (
          <div className="flex-1 p-6 flex gap-6">
            <div className="aspect-square h-full max-h-64 rounded-lg overflow-hidden">
              <img 
                src={currentTrack?.coverUrl} 
                alt={`${currentTrack?.album} by ${currentTrack?.artist}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-bold">{currentTrack?.title}</h3>
              <p className="text-lg text-muted-foreground">{currentTrack?.artist}</p>
              <p className="text-sm text-muted-foreground mt-1">{currentTrack?.album}</p>
              
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <Slider
                    value={[progressPercentage]}
                    max={100}
                    step={0.1}
                    onValueChange={(values) => {
                      const newProgress = (values[0] / 100) * duration;
                      playerStore?.setProgress?.(newProgress);
                    }}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="flex justify-center items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => playerStore?.previousTrack?.()}>
                    {React.createElement(SkipBack, { size: 24, weight: "duotone" })}
                  </Button>
                  <Button variant="default" size="icon" className="h-12 w-12 rounded-full" onClick={handlePlayPause}>
                    {isPlaying
                      ? React.createElement(Pause, { size: 24, weight: "duotone" })
                      : React.createElement(Play, { size: 24, weight: "duotone" })}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => playerStore?.nextTrack?.()}>
                    {React.createElement(SkipForward, { size: 24, weight: "duotone" })}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  {React.createElement(SpeakerHigh, { size: 16, weight: "duotone" })}
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={(values) => playerStore?.setVolume?.(values[0])}
                    className="w-28 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Compact Player */}
        <div className="h-16 px-4 flex items-center justify-between border-t">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded overflow-hidden">
              <img 
                src={currentTrack?.coverUrl} 
                alt={`${currentTrack?.album} by ${currentTrack?.artist}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{currentTrack?.title}</div>
              <div className="text-xs text-muted-foreground">{currentTrack?.artist}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => playerStore?.previousTrack?.()}>
              {React.createElement(SkipBack, { size: 20, weight: "duotone" })}
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8 rounded-full" onClick={handlePlayPause}>
              {isPlaying
                ? React.createElement(Pause, { size: 16, weight: "duotone" })
                : React.createElement(Play, { size: 16, weight: "duotone" })}
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => playerStore?.nextTrack?.()}>
              {React.createElement(SkipForward, { size: 20, weight: "duotone" })}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              {React.createElement(Queue, { size: 18, weight: "duotone" })}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => uiStore?.togglePlayer?.()}>
              {isPlayerExpanded
                ? React.createElement(ArrowsInCardinal, { size: 18, weight: "duotone" })
                : React.createElement(ArrowsOutCardinal, { size: 18, weight: "duotone" })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 