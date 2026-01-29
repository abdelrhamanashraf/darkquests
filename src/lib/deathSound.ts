// Death sound effect using Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playDeathSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Dark Souls "YOU DIED" style sound
  // Deep impact hit first
  const impactOsc = ctx.createOscillator();
  const impactGain = ctx.createGain();
  const impactFilter = ctx.createBiquadFilter();
  
  impactOsc.type = 'sawtooth';
  impactOsc.frequency.setValueAtTime(80, now);
  impactOsc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
  
  impactFilter.type = 'lowpass';
  impactFilter.frequency.setValueAtTime(200, now);
  impactFilter.Q.value = 2;
  
  impactGain.gain.setValueAtTime(0.4, now);
  impactGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
  
  impactOsc.connect(impactFilter);
  impactFilter.connect(impactGain);
  impactGain.connect(ctx.destination);
  
  impactOsc.start(now);
  impactOsc.stop(now + 1);

  // Ominous choir-like pad (stacked fifths)
  const choirNotes = [
    { freq: 73.42, detune: -5 },   // D2
    { freq: 110, detune: 3 },      // A2
    { freq: 146.83, detune: -3 },  // D3
    { freq: 220, detune: 5 },      // A3
  ];
  
  choirNotes.forEach(({ freq, detune }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(detune, now);
    osc.frequency.linearRampToValueAtTime(freq * 0.97, now + 3);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(200, now + 3);
    
    gain.gain.setValueAtTime(0, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
    gain.gain.setValueAtTime(0.08, now + 2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now + 0.1);
    osc.stop(now + 4.5);
  });

  // Slow descending bell tone
  const bellFreqs = [880, 1760, 2640];
  bellFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 2);
    
    gain.gain.setValueAtTime(0, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.06 - i * 0.015, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now + 0.3);
    osc.stop(now + 3);
  });

  // Sub bass rumble
  const subBass = ctx.createOscillator();
  const subGain = ctx.createGain();
  
  subBass.type = 'sine';
  subBass.frequency.setValueAtTime(40, now);
  subBass.frequency.linearRampToValueAtTime(25, now + 3);
  
  subGain.gain.setValueAtTime(0, now);
  subGain.gain.linearRampToValueAtTime(0.2, now + 0.2);
  subGain.gain.setValueAtTime(0.15, now + 2);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 4);
  
  subBass.connect(subGain);
  subGain.connect(ctx.destination);
  
  subBass.start(now);
  subBass.stop(now + 4.5);
};
