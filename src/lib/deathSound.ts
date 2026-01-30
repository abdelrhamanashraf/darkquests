// Death sound using uploaded Dark Souls audio
import deathSoundFile from '@/assets/sounds/death.mp3';

let deathAudio: HTMLAudioElement | null = null;

export const playDeathSound = () => {
  if (!deathAudio) {
    deathAudio = new Audio(deathSoundFile);
  }
  deathAudio.currentTime = 0;
  deathAudio.volume = 0.7;
  deathAudio.play().catch(console.error);
};
