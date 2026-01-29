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

  // DARK SOULS "YOU DIED" - Heavy, oppressive, dread-inducing
  
  // Massive low-end impact - like a giant door slamming
  const impact = ctx.createOscillator();
  const impactGain = ctx.createGain();
  const impactDistortion = ctx.createWaveShaper();
  
  // Create distortion curve for gritty impact
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = Math.tanh(x * 3);
  }
  impactDistortion.curve = curve;
  
  impact.type = 'sawtooth';
  impact.frequency.setValueAtTime(50, now);
  impact.frequency.exponentialRampToValueAtTime(20, now + 0.8);
  
  impactGain.gain.setValueAtTime(0.5, now);
  impactGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  
  impact.connect(impactDistortion);
  impactDistortion.connect(impactGain);
  impactGain.connect(ctx.destination);
  
  impact.start(now);
  impact.stop(now + 1.5);

  // Dissonant minor second drone - pure dread
  const droneNotes = [
    { freq: 55, detune: 0 },      // A1
    { freq: 58.27, detune: -10 }, // Bb1 - dissonant minor 2nd
    { freq: 82.41, detune: 5 },   // E2 - tritone (devil's interval)
  ];
  
  droneNotes.forEach(({ freq, detune }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(detune, now);
    osc.frequency.linearRampToValueAtTime(freq * 0.9, now + 4);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(100, now + 4);
    filter.Q.value = 2;
    
    gain.gain.setValueAtTime(0, now + 0.2);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
    gain.gain.setValueAtTime(0.1, now + 3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now + 0.2);
    osc.stop(now + 5.5);
  });

  // Descending doom tone - like your soul leaving
  const doom = ctx.createOscillator();
  const doomGain = ctx.createGain();
  const doomFilter = ctx.createBiquadFilter();
  
  doom.type = 'triangle';
  doom.frequency.setValueAtTime(220, now + 0.3);
  doom.frequency.exponentialRampToValueAtTime(55, now + 2.5);
  
  doomFilter.type = 'lowpass';
  doomFilter.frequency.setValueAtTime(600, now + 0.3);
  doomFilter.frequency.linearRampToValueAtTime(150, now + 2.5);
  
  doomGain.gain.setValueAtTime(0, now + 0.3);
  doomGain.gain.linearRampToValueAtTime(0.15, now + 0.5);
  doomGain.gain.exponentialRampToValueAtTime(0.001, now + 3);
  
  doom.connect(doomFilter);
  doomFilter.connect(doomGain);
  doomGain.connect(ctx.destination);
  
  doom.start(now + 0.3);
  doom.stop(now + 3.5);

  // Sub-bass rumble - feel it in your chest
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  
  sub.type = 'sine';
  sub.frequency.setValueAtTime(30, now);
  sub.frequency.linearRampToValueAtTime(18, now + 4);
  
  subGain.gain.setValueAtTime(0.35, now);
  subGain.gain.setValueAtTime(0.3, now + 2);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 5);
  
  sub.connect(subGain);
  subGain.connect(ctx.destination);
  
  sub.start(now);
  sub.stop(now + 5.5);

  // Noise burst for texture - like ash/dust
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseGain = ctx.createGain();
  const noiseFilter = ctx.createBiquadFilter();
  
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 200;
  noiseFilter.Q.value = 0.5;
  
  noiseGain.gain.setValueAtTime(0.2, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  
  noise.start(now);
};
