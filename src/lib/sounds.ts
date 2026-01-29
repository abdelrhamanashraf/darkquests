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

  // DARK SOULS BOSS VICTORY - Solemn, gothic, weighty triumph
  // Not happy - this is dark, cathedral-like, almost mournful victory
  
  // Deep organ-like power chord - D minor (dark key)
  const organNotes = [
    { freq: 36.71, type: 'sawtooth' as OscillatorType },  // D1
    { freq: 73.42, type: 'sawtooth' as OscillatorType },  // D2
    { freq: 110, type: 'sawtooth' as OscillatorType },    // A2
    { freq: 146.83, type: 'triangle' as OscillatorType }, // D3
    { freq: 174.61, type: 'triangle' as OscillatorType }, // F3 (minor third)
  ];
  
  organNotes.forEach(({ freq, type }) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    const filter = audioContext!.createBiquadFilter();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(300, now + 4);
    filter.Q.value = 1;
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    gain.gain.setValueAtTime(0.1, now + 2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext!.destination);
    
    osc.start(now);
    osc.stop(now + 5.5);
  });

  // Slow, heavy ascending phrase - not cheerful, but inevitable victory
  const victoryPhrase = [
    { freq: 146.83, time: 0.5 },   // D3
    { freq: 174.61, time: 1.0 },   // F3
    { freq: 196.00, time: 1.5 },   // G3
    { freq: 220.00, time: 2.0 },   // A3
    { freq: 293.66, time: 2.8 },   // D4 - final, sustained
  ];
  
  victoryPhrase.forEach(({ freq, time }) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    const filter = audioContext!.createBiquadFilter();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + time);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now + time);
    filter.frequency.linearRampToValueAtTime(400, now + time + 1.5);
    
    gain.gain.setValueAtTime(0, now + time);
    gain.gain.linearRampToValueAtTime(0.15, now + time + 0.08);
    gain.gain.setValueAtTime(0.12, now + time + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + 1.8);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext!.destination);
    
    osc.start(now + time);
    osc.stop(now + time + 2);
  });

  // Dark choir drone - fifths and octaves, no major thirds
  const choirNotes = [
    { freq: 146.83, detune: -8 },   // D3
    { freq: 220.00, detune: 5 },    // A3
    { freq: 293.66, detune: -5 },   // D4
    { freq: 440.00, detune: 8 },    // A4
  ];
  
  choirNotes.forEach(({ freq, detune }) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + 2.5);
    osc.detune.setValueAtTime(detune, now + 2.5);
    
    gain.gain.setValueAtTime(0, now + 2.5);
    gain.gain.linearRampToValueAtTime(0.06, now + 3);
    gain.gain.setValueAtTime(0.06, now + 5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 7);
    
    osc.connect(gain);
    gain.connect(audioContext!.destination);
    
    osc.start(now + 2.5);
    osc.stop(now + 7.5);
  });

  // Deep bell toll - funeral/cathedral bell
  const bellFreq = 110; // A2
  const bell = audioContext.createOscillator();
  const bellGain = audioContext.createGain();
  
  bell.type = 'sine';
  bell.frequency.setValueAtTime(bellFreq, now + 3.5);
  
  bellGain.gain.setValueAtTime(0, now + 3.5);
  bellGain.gain.linearRampToValueAtTime(0.2, now + 3.55);
  bellGain.gain.exponentialRampToValueAtTime(0.001, now + 6);
  
  bell.connect(bellGain);
  bellGain.connect(audioContext.destination);
  
  bell.start(now + 3.5);
  bell.stop(now + 6.5);
  
  // Bell overtones
  [2, 3, 4.2, 5.4].forEach((mult, i) => {
    const overtone = audioContext!.createOscillator();
    const otGain = audioContext!.createGain();
    
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(bellFreq * mult, now + 3.5);
    
    otGain.gain.setValueAtTime(0, now + 3.5);
    otGain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 3.55);
    otGain.gain.exponentialRampToValueAtTime(0.001, now + 5 - i * 0.3);
    
    overtone.connect(otGain);
    otGain.connect(audioContext!.destination);
    
    overtone.start(now + 3.5);
    overtone.stop(now + 5.5);
  });

  // Sub bass foundation
  const sub = audioContext.createOscillator();
  const subGain = audioContext.createGain();
  
  sub.type = 'sine';
  sub.frequency.setValueAtTime(36.71, now); // D1
  
  subGain.gain.setValueAtTime(0.25, now);
  subGain.gain.setValueAtTime(0.2, now + 3);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 6);
  
  sub.connect(subGain);
  subGain.connect(audioContext.destination);
  
  sub.start(now);
  sub.stop(now + 6.5);
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
