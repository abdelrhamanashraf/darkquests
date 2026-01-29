import { motion } from 'framer-motion';
import { Volume2, VolumeX, Loader2, Flame } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useAmbientAudio } from '@/hooks/useAmbientAudio';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const AmbientAudioControl = () => {
  const { isLoading, isPlaying, volume, toggle, setVolume } = useAmbientAudio();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            // If not playing yet, start on first click
            if (!isPlaying && !isLoading) {
              e.preventDefault();
              toggle();
            }
          }}
          className="flex items-center gap-2 px-3 py-2 rounded bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label={isPlaying ? "Pause ambient audio" : "Play ambient audio"}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPlaying ? (
            <div className="relative">
              <Flame className="w-4 h-4 text-primary animate-pulse" />
            </div>
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="hidden sm:inline font-display text-xs">
            {isLoading ? 'Loading...' : isPlaying ? 'Bonfire' : 'Sound'}
          </span>
        </motion.button>
      </PopoverTrigger>
      
      {isPlaying && (
        <PopoverContent className="w-48 p-3" align="end">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display text-muted-foreground">Volume</span>
              <button
                onClick={toggle}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {isPlaying ? 'Mute' : 'Unmute'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <VolumeX className="w-3 h-3 text-muted-foreground" />
              <Slider
                value={[volume * 100]}
                onValueChange={([val]) => setVolume(val / 100)}
                max={100}
                step={1}
                className="flex-1"
              />
              <Volume2 className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
