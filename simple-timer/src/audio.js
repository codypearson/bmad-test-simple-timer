/**
 * Audio playback for completion alerts.
 * Sound: Mixkit "Bell Notification" — Mixkit Free License
 * Attribution for README (Story 2.1)
 */

const audio = new Audio('/completion.mp3');
audio.preload = 'auto';

let unlocked = false;

/**
 * Unlocks audio playback on first user gesture (browser autoplay policy).
 */
export function unlock() {
  if (unlocked) {
    return;
  }

  audio
    .play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      unlocked = true;
    })
    .catch(() => {
      // Silent fail — browser autoplay policy
    });
}

/**
 * Plays the completion sound once.
 */
export function play() {
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Silent fail — visual completion is primary signal
  });
}

/**
 * Resets unlock state (for testing).
 */
export function resetForTesting() {
  unlocked = false;
}
