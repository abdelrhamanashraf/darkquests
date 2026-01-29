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

  // Deep, ominous drone
  const drone = ctx.createOscillator();
  const droneGain = ctx.createGain();
  
  drone.type = 'sawtooth';
  drone.frequency.setValueAtTime(55, now); // Low A
  drone.frequency.linearRampToValueAtTime(40, now + 2);
  
  droneGain.gain.setValueAtTime(0, now);
  droneGain.gain.linearRampToValueAtTime(0.15, now + 0.3);
  droneGain.gain.linearRampToValueAtTime(0.1, now + 1.5);
  droneGain.gain.exponentialRampToValueAtTime(0.001, now + 3);
  
  drone.connect(droneGain);
  droneGain.connect(ctx.destination);
  
  drone.start(now);
  drone.stop(now + 3.5);

  // Dissonant chord hit
  const frequencies = [110, 116.54, 138.59]; // A2, Bb2, C#3 - dissonant
  
  frequencies.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 0.95, now + 2);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12 - index * 0.02, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 3);
  });

  // Descending death tone
  const deathTone = ctx.createOscillator();
  const deathGain = ctx.createGain();
  
  deathTone.type = 'sine';
  deathTone.frequency.setValueAtTime(440, now + 0.2);
  deathTone.frequency.exponentialRampToValueAtTime(110, now + 1.5);
  
  deathGain.gain.setValueAtTime(0, now + 0.2);
  deathGain.gain.linearRampToValueAtTime(0.2, now + 0.3);
  deathGain.gain.exponentialRampToValueAtTime(0.001, now + 2);
  
  deathTone.connect(deathGain);
  deathGain.connect(ctx.destination);
  
  deathTone.start(now + 0.2);
  deathTone.stop(now + 2.5);
};
