import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface UseAmbientAudioOptions {
  prompt?: string;
  duration?: number;
  autoStart?: boolean;
}

export const useAmbientAudio = (options: UseAmbientAudioOptions = {}) => {
  const {
    prompt = "Crackling bonfire, warm cozy campfire with wood burning, gentle fire ambient sound",
    duration = 10,
    autoStart = false,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const generateAndLoadAudio = useCallback(async () => {
    if (audioUrlRef.current) {
      // Already loaded
      return true;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-sfx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt, duration }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;

      audio.addEventListener('ended', () => {
        // Loop is enabled, but just in case
        if (audio.loop) {
          audio.currentTime = 0;
          audio.play().catch(console.error);
        }
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load ambient audio';
      setError(message);
      console.error('Ambient audio error:', err);
      toast.error('Failed to load ambient audio');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [prompt, duration, volume]);

  const play = useCallback(async () => {
    if (!audioRef.current) {
      const loaded = await generateAndLoadAudio();
      if (!loaded) return;
    }

    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Failed to play audio:', err);
        toast.error('Click to enable audio');
      }
    }
  }, [generateAndLoadAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const updateVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
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
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  // Auto-start if enabled (requires user interaction first)
  useEffect(() => {
    if (autoStart && !audioRef.current) {
      const handleFirstInteraction = () => {
        play();
        document.removeEventListener('click', handleFirstInteraction);
      };
      document.addEventListener('click', handleFirstInteraction);
      return () => document.removeEventListener('click', handleFirstInteraction);
    }
  }, [autoStart, play]);

  return {
    isLoading,
    isPlaying,
    volume,
    error,
    play,
    pause,
    toggle,
    setVolume: updateVolume,
  };
};
