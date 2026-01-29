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

export const playBossDefeatSound = () => {
  if (!audioContext) return;
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const now = audioContext.currentTime;

  // Dark Souls boss victory - triumphant but dark orchestral hit
  
  // Initial powerful brass-like impact
  const brassNotes = [
    { freq: 130.81, time: 0, type: 'sawtooth' as OscillatorType },     // C3
    { freq: 164.81, time: 0, type: 'sawtooth' as OscillatorType },     // E3
    { freq: 196.00, time: 0, type: 'sawtooth' as OscillatorType },     // G3
    { freq: 261.63, time: 0, type: 'triangle' as OscillatorType },     // C4
  ];
  
  brassNotes.forEach(({ freq, time, type }) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    const filter = audioContext!.createBiquadFilter();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + time);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now + time);
    filter.frequency.linearRampToValueAtTime(500, now + time + 2);
    filter.Q.value = 1;
    
    gain.gain.setValueAtTime(0, now + time);
    gain.gain.linearRampToValueAtTime(0.15, now + time + 0.05);
    gain.gain.setValueAtTime(0.12, now + time + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, now + time + 2.5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext!.destination);
    
    osc.start(now + time);
    osc.stop(now + time + 3);
  });

  // Ascending victory phrase
  const victoryPhrase = [
    { freq: 523.25, time: 0.3, duration: 0.4 },   // C5
    { freq: 659.25, time: 0.5, duration: 0.4 },   // E5  
    { freq: 783.99, time: 0.7, duration: 0.5 },   // G5
    { freq: 1046.50, time: 1.0, duration: 1.0 },  // C6 - sustain
  ];
  
  victoryPhrase.forEach(({ freq, time, duration }) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + time);
    
    gain.gain.setValueAtTime(0, now + time);
    gain.gain.linearRampToValueAtTime(0.2, now + time + 0.03);
    gain.gain.setValueAtTime(0.15, now + time + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.01, now + time + duration);
    
    osc.connect(gain);
    gain.connect(audioContext!.destination);
    
    osc.start(now + time);
    osc.stop(now + time + duration + 0.2);
  });

  // Choir-like sustained pad
  const choirNotes = [
    { freq: 261.63, detune: -8 },  // C4
    { freq: 329.63, detune: 5 },   // E4
    { freq: 392.00, detune: -5 },  // G4
    { freq: 523.25, detune: 8 },   // C5
  ];
  
  choirNotes.forEach(({ freq, detune }) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + 1.2);
    osc.detune.setValueAtTime(detune, now + 1.2);
    
    gain.gain.setValueAtTime(0, now + 1.2);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.5);
    gain.gain.setValueAtTime(0.08, now + 3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
    
    osc.connect(gain);
    gain.connect(audioContext!.destination);
    
    osc.start(now + 1.2);
    osc.stop(now + 5);
  });

  // Shimmering high bells
  for (let i = 0; i < 8; i++) {
    const shimmer = audioContext.createOscillator();
    const shimmerGain = audioContext.createGain();
    
    shimmer.type = 'sine';
    const baseFreq = 2000 + Math.random() * 1000;
    shimmer.frequency.setValueAtTime(baseFreq, now + 1.5 + i * 0.15);
    shimmer.frequency.linearRampToValueAtTime(baseFreq * 1.2, now + 2 + i * 0.15);
    
    shimmerGain.gain.setValueAtTime(0, now + 1.5 + i * 0.15);
    shimmerGain.gain.linearRampToValueAtTime(0.04, now + 1.55 + i * 0.15);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5 + i * 0.15);
    
    shimmer.connect(shimmerGain);
    shimmerGain.connect(audioContext.destination);
    
    shimmer.start(now + 1.5 + i * 0.15);
    shimmer.stop(now + 3 + i * 0.15);
  }

  // Deep triumphant bass note
  const bass = audioContext.createOscillator();
  const bassGain = audioContext.createGain();
  
  bass.type = 'sine';
  bass.frequency.setValueAtTime(65.41, now); // C2
  
  bassGain.gain.setValueAtTime(0.3, now);
  bassGain.gain.setValueAtTime(0.25, now + 1);
  bassGain.gain.exponentialRampToValueAtTime(0.01, now + 3);
  
  bass.connect(bassGain);
  bassGain.connect(audioContext.destination);
  
  bass.start(now);
  bass.stop(now + 3.5);
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
