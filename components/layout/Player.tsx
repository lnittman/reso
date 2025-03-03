import React from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SkipBackIcon, 
  SkipForwardIcon, 
  VolumeIcon,
  RepeatIcon,
  ShuffleIcon
} from 'lucide-react';
import { Slider } from '@/src/components/ui/slider';

const Player = () => {
  // This would be managed by a proper state management system in a real implementation
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(70);
  const [progress, setProgress] = React.useState(30);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Current track info */}
        <div className="flex items-center gap-4 w-1/4">
          <div className="h-12 w-12 bg-muted rounded"></div>
          <div>
            <p className="font-medium line-clamp-1">Track Title</p>
            <p className="text-sm text-muted-foreground line-clamp-1">Artist Name</p>
          </div>
        </div>
        
        {/* Playback controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-4 mb-2">
            <button className="text-muted-foreground hover:text-foreground">
              <ShuffleIcon className="h-4 w-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <SkipBackIcon className="h-5 w-5" />
            </button>
            <button 
              className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/80"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <SkipForwardIcon className="h-5 w-5" />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <RepeatIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground">1:30</span>
            <Slider 
              value={[progress]} 
              max={100} 
              step={1} 
              onValueChange={(value: number[]) => setProgress(value[0])}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground">3:45</span>
          </div>
        </div>
        
        {/* Volume controls */}
        <div className="flex items-center gap-2 w-1/4 justify-end">
          <VolumeIcon className="h-5 w-5 text-muted-foreground" />
          <Slider 
            value={[volume]} 
            max={100} 
            step={1} 
            onValueChange={(value: number[]) => setVolume(value[0])}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Player; 