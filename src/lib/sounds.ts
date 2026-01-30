// Sound effects - only using uploaded audio files
import victorySoundFile from '@/assets/sounds/victory.mp3';

let victoryAudio: HTMLAudioElement | null = null;

// Empty functions - no synthesized sounds
export const playQuestCompleteSound = () => {};
export const playLevelUpSound = () => {};
export const playDeleteSound = () => {};
export const playAddSound = () => {};
export const startAmbientFire = () => {};
export const stopAmbientFire = () => {};
export const setAmbientVolume = (_volume: number) => {};

// Victory sound using uploaded audio
export const playBossDefeatSound = () => {
  if (!victoryAudio) {
    victoryAudio = new Audio(victorySoundFile);
  }
  victoryAudio.currentTime = 0;
  victoryAudio.volume = 0.7;
  victoryAudio.play().catch(console.error);
};
