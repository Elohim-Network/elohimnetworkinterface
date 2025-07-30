
import React, { useState } from 'react';
import { JukeboxTrack } from '@/types/modules';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, X, Heart, SkipBack, SkipForward, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import LoveGiftModal from './LoveGiftModal';

interface JukeboxPlayerProps {
  track: JukeboxTrack;
  onClose: () => void;
  showDonateButton?: boolean;
}

const JukeboxPlayer: React.FC<JukeboxPlayerProps> = ({
  track,
  onClose,
  showDonateButton = true
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showLoveGiftModal, setShowLoveGiftModal] = useState(false);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the actual audio playback
    toast.info(isPlaying ? 'Paused' : 'Playing');
  };
  
  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0]);
    // In a real implementation, this would seek the audio
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    // In a real implementation, this would change the audio volume
  };
  
  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl);
  };
  
  const handleDonate = () => {
    setShowLoveGiftModal(true);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Simulate current time changing (would be driven by actual audio element in real implementation)
  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          return next >= track.duration ? 0 : next;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, track.duration]);
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 px-4 py-2">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-muted shrink-0">
              <img 
                src={track.coverImageUrl} 
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="ml-3 mr-4 flex-shrink overflow-hidden">
              <div className="font-medium truncate">{track.title}</div>
              <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex"
                onClick={() => toast.info('Previous track')}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex"
                onClick={() => toast.info('Next track')}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 mx-4 hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatTime(currentTime)}
                </span>
                
                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    max={track.duration}
                    step={1}
                    onValueChange={handleTimeChange}
                  />
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {formatTime(track.duration)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleVolumeControl}
                >
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                
                {showVolumeControl && (
                  <div className="absolute bottom-full mb-2 p-2 bg-popover border rounded-md shadow-lg">
                    <div className="h-24 flex items-center justify-center px-2">
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        orientation="vertical"
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {showDonateButton && (
                <Button size="sm" onClick={handleDonate} className="hidden sm:flex">
                  <Heart className="h-4 w-4 mr-1" />
                  Send Love Gift
                </Button>
              )}
              
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {showLoveGiftModal && (
        <LoveGiftModal 
          track={track} 
          onClose={() => setShowLoveGiftModal(false)} 
        />
      )}
    </>
  );
};

export default JukeboxPlayer;
