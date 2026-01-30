// Simple synthesized sound effects using Web Audio API
// No external API needed - instant playback

let ambientInterval: ReturnType<typeof setInterval> | null = null;
let ambientGain: GainNode | null = null;

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playQuestCompleteSound = () => {
  if (!audioContext) return;
  
  // Resume context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const now = audioContext.currentTime;

  // Create a pleasant "ding" sound with harmonics
  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord arpeggio
  
  frequencies.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, now + index * 0.08);
    
    // Quick attack, medium decay
    gainNode.gain.setValueAtTime(0, now + index * 0.08);
    gainNode.gain.linearRampToValueAtTime(0.3, now + index * 0.08 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.4);
    
    oscillator.start(now + index * 0.08);
    oscillator.stop(now + index * 0.08 + 0.5);
  });
};

export const playLevelUpSound = () => {
  if (!audioContext) return;
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const now = audioContext.currentTime;

  // Triumphant fanfare - ascending notes
  const notes = [
    { freq: 523.25, time: 0 },      // C5
    { freq: 659.25, time: 0.1 },    // E5
    { freq: 783.99, time: 0.2 },    // G5
    { freq: 1046.50, time: 0.35 },  // C6
  ];
  
  notes.forEach(({ freq, time }) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, now + time);
    
    gainNode.gain.setValueAtTime(0, now + time);
    gainNode.gain.linearRampToValueAtTime(0.35, now + time + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + time + 0.6);
    
    oscillator.start(now + time);
    oscillator.stop(now + time + 0.7);
  });

  // Add a subtle shimmer effect
  const shimmer = audioContext.createOscillator();
  const shimmerGain = audioContext.createGain();
  
  shimmer.connect(shimmerGain);
  shimmerGain.connect(audioContext.destination);
  
  shimmer.type = 'sine';
  shimmer.frequency.setValueAtTime(1567.98, now + 0.35); // G6
  shimmer.frequency.linearRampToValueAtTime(2093, now + 0.8); // C7
  
  shimmerGain.gain.setValueAtTime(0, now + 0.35);
  shimmerGain.gain.linearRampToValueAtTime(0.15, now + 0.4);
  shimmerGain.gain.exponentialRampToValueAtTime(0.01, now + 1);
  
  shimmer.start(now + 0.35);
  shimmer.stop(now + 1.1);
};

// Import victory sound
import victorySoundFile from '@/assets/sounds/victory.mp3';

let victoryAudio: HTMLAudioElement | null = null;

export const playBossDefeatSound = () => {
  // Use the actual Dark Souls victory sound
  if (!victoryAudio) {
    victoryAudio = new Audio(victorySoundFile);
  }
  victoryAudio.currentTime = 0;
  victoryAudio.volume = 0.7;
  victoryAudio.play().catch(console.error);
};

export const playDeleteSound = () => {
  if (!audioContext) return;
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const now = audioContext.currentTime;

  // Quick "whoosh" down sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, now);
  oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.15);
  
  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  
  oscillator.start(now);
  oscillator.stop(now + 0.2);
};

export const playAddSound = () => {
  if (!audioContext) return;
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const now = audioContext.currentTime;

  // Quick "pop" up sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(300, now);
  oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.08);
  
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.25, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
  
  oscillator.start(now);
  oscillator.stop(now + 0.15);
};

// Crackling bonfire ambient sound
const createCrackle = () => {
  if (!audioContext || !ambientGain) return;
  
  const now = audioContext.currentTime;
  
  // Random crackle using noise burst
  const bufferSize = audioContext.sampleRate * 0.08;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Generate brown noise for fire-like sound
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5; // Amplify
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  
  // Bandpass filter for fire-like frequency
  const filter = audioContext.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800 + Math.random() * 400;
  filter.Q.value = 0.5;
  
  // Envelope for crackle
  const envelope = audioContext.createGain();
  envelope.gain.setValueAtTime(0, now);
  envelope.gain.linearRampToValueAtTime(0.15 + Math.random() * 0.1, now + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.05 + Math.random() * 0.05);
  
  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(ambientGain);
  
  source.start(now);
  source.stop(now + 0.1);
};

const createDeepRumble = () => {
  if (!audioContext || !ambientGain) return;
  
  const now = audioContext.currentTime;
  
  // Deep rumbling base of fire
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(60 + Math.random() * 20, now);
  oscillator.frequency.linearRampToValueAtTime(50 + Math.random() * 30, now + 0.3);
  
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.02, now + 0.05);
  gainNode.gain.linearRampToValueAtTime(0.02, now + 0.2);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  
  oscillator.connect(gainNode);
  gainNode.connect(ambientGain);
  
  oscillator.start(now);
  oscillator.stop(now + 0.5);
};

export const startAmbientFire = () => {
  if (!audioContext) return;
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  // Already playing
  if (ambientInterval) return;
  
  // Create master gain for ambient sounds
  ambientGain = audioContext.createGain();
  ambientGain.gain.value = 0.4;
  ambientGain.connect(audioContext.destination);
  
  // Play random crackles at varying intervals
  ambientInterval = setInterval(() => {
    // Random chance for crackle
    if (Math.random() > 0.3) {
      createCrackle();
    }
    // Occasional deep rumble
    if (Math.random() > 0.85) {
      createDeepRumble();
    }
  }, 80);
};

export const stopAmbientFire = () => {
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
  if (ambientGain) {
    ambientGain.disconnect();
    ambientGain = null;
  }
};

export const setAmbientVolume = (volume: number) => {
  if (ambientGain) {
    ambientGain.gain.value = Math.max(0, Math.min(1, volume));
  }
};
