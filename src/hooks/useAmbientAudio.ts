import { useState, useRef, useCallback, useEffect } from 'react';

// Synthesized bonfire ambient audio using Web Audio API - no external API needed
export const useAmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const crackleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createBrownNoise = useCallback((ctx: AudioContext, duration: number) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }, []);

  const createCrackle = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    if (ctx.state !== 'running') return;
    
    const now = ctx.currentTime;
    
    // Random crackle pop
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600 + Math.random() * 600;
    filter.Q.value = 0.5;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15 + Math.random() * 0.1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + Math.random() * 0.05);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    source.start(now);
    source.stop(now + 0.1);
  }, []);

  const createDeepRumble = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    if (ctx.state !== 'running') return;
    
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(50 + Math.random() * 20, now);
    osc.frequency.linearRampToValueAtTime(40 + Math.random() * 30, now + 0.4);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.02, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(gain);
    gain.connect(masterGain);
    
    osc.start(now);
    osc.stop(now + 0.6);
  }, []);

  const startAudio = useCallback(() => {
    if (audioContextRef.current) return;
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Master gain for volume control
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;
    
    // Base fire roar - filtered brown noise
    const noiseBuffer = createBrownNoise(ctx, 10);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 400;
    noiseFilter.Q.value = 0.5;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.15;
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();
    noiseSourceRef.current = noiseSource;
    
    // Random crackles and pops
    crackleIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.3) {
        createCrackle(ctx, masterGain);
      }
      if (Math.random() > 0.85) {
        createDeepRumble(ctx, masterGain);
      }
    }, 80);
    
    setIsPlaying(true);
  }, [volume, createBrownNoise, createCrackle, createDeepRumble]);

  const stopAudio = useCallback(() => {
    if (crackleIntervalRef.current) {
      clearInterval(crackleIntervalRef.current);
      crackleIntervalRef.current = null;
    }
    
    if (noiseSourceRef.current) {
      noiseSourceRef.current.stop();
      noiseSourceRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    masterGainRef.current = null;
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
    setVolume(clampedVolume);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = clampedVolume;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

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
