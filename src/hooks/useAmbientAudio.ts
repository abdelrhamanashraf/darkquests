import { useState, useRef, useCallback, useEffect } from 'react';
import bonfireSoundFile from '@/assets/sounds/bonfire.mp3';

export const useAmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.4);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(bonfireSoundFile);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }
    
    audioRef.current.play().catch(console.error);
    setIsPlaying(true);
  }, [volume]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  }, [isPlaying, startAudio, stopAudio]);

  const updateVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    isLoading: false,
    isPlaying,
    volume,
    error: null,
    play: startAudio,
    pause: stopAudio,
    toggle,
    setVolume: updateVolume,
  };
};
