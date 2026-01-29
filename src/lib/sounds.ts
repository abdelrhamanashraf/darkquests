// Simple synthesized sound effects using Web Audio API
// No external API needed - instant playback

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
