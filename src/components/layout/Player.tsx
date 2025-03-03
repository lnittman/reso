import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  SpeakerHigh,
  Repeat,
  Shuffle
} from '@phosphor-icons/react';
import { Slider } from '@/components/ui/slider';
import { usePlayerStore } from '@/lib/store';

const Player = () => {
  const { 
    isPlaying, 
    currentTrack, 
    volume, 
    progress, 
    setIsPlaying, 
    setVolume, 
    setProgress,
    skipToNext,
    skipToPrevious
  } = usePlayerStore();

  // Format duration from seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Calculate current position based on progress percentage
  const currentPosition = currentTrack?.duration 
    ? Math.floor((progress / 100) * currentTrack.duration) 
    : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Current track info */}
        <div className="flex items-center gap-4 w-1/4">
          {currentTrack ? (
            <>
              <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                {currentTrack.coverImage && (
                  <img 
                    src={currentTrack.coverImage} 
                    alt={currentTrack.title} 
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium line-clamp-1">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{currentTrack.artist}</p>
              </div>
            </>
          ) : (
            <div>
              <p className="font-medium line-clamp-1">Not Playing</p>
              <p className="text-sm text-muted-foreground line-clamp-1">Select a track</p>
            </div>
          )}
        </div>
        
        {/* Playback controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-4 mb-2">
            <button className="text-muted-foreground hover:text-foreground">
              {React.createElement(Shuffle, { className: "h-4 w-4", weight: "duotone" })}
            </button>
            <button 
              className="text-muted-foreground hover:text-foreground"
              onClick={skipToPrevious}
              disabled={!currentTrack}
            >
              {React.createElement(SkipBack, { className: "h-5 w-5", weight: "duotone" })}
            </button>
            <button 
              className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/80"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!currentTrack}
            >
              {isPlaying ? 
                React.createElement(Pause, { className: "h-5 w-5", weight: "duotone" }) :
                React.createElement(Play, { className: "h-5 w-5", weight: "duotone" })
              }
            </button>
            <button 
              className="text-muted-foreground hover:text-foreground"
              onClick={skipToNext}
              disabled={!currentTrack}
            >
              {React.createElement(SkipForward, { className: "h-5 w-5", weight: "duotone" })}
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              {React.createElement(Repeat, { className: "h-4 w-4", weight: "duotone" })}
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground">
              {currentTrack ? formatTime(currentPosition) : '--:--'}
            </span>
            <Slider 
              value={[progress]} 
              max={100} 
              step={1} 
              onValueChange={(value) => setProgress(value[0])}
              className="flex-1"
              disabled={!currentTrack}
            />
            <span className="text-xs text-muted-foreground">
              {currentTrack && currentTrack.duration ? formatTime(currentTrack.duration) : '--:--'}
            </span>
          </div>
        </div>
        
        {/* Volume controls */}
        <div className="flex items-center gap-2 w-1/4 justify-end">
          {React.createElement(SpeakerHigh, { className: "h-5 w-5 text-muted-foreground", weight: "duotone" })}
          <Slider 
            value={[volume]} 
            max={100} 
            step={1} 
            onValueChange={(value) => setVolume(value[0])}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Player; 