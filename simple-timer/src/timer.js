/**
 * Countdown engine and time formatting utilities.
 * setInterval is confined to this module per architecture.
 */

const TICK_INTERVAL_MS = 1000;

/** @type {number | null} */
let intervalId = null;

/** @type {number | null} */
let endTime = null;

/**
 * Formats remaining milliseconds as MM:SS display string.
 * @param {number} remainingMs - Remaining time in milliseconds
 * @returns {string} Formatted time string (e.g. "05:00")
 */
export function formatTime(remainingMs) {
  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Starts the countdown from the given remaining time.
 * @param {number} remainingMs - Starting remaining time in milliseconds
 * @param {(remainingMs: number) => void} onTick - Callback on each tick
 * @param {() => void} onComplete - Callback when countdown reaches zero
 */
export function start(remainingMs, onTick, onComplete) {
  stop();
  endTime = Date.now() + remainingMs;
  intervalId = setInterval(() => {
    const remaining = Math.max(0, endTime - Date.now());
    if (remaining <= 0) {
      stop();
      onComplete();
      return;
    }
    onTick(remaining);
  }, TICK_INTERVAL_MS);
  onTick(remainingMs);
}

/**
 * Pauses the countdown and returns the remaining milliseconds.
 * @returns {number} Remaining time in milliseconds
 */
export function pause() {
  if (!intervalId) {
    return endTime ? Math.max(0, endTime - Date.now()) : 0;
  }

  const remaining = Math.max(0, endTime - Date.now());
  stop();
  return remaining;
}

/**
 * Stops the countdown and clears internal timer references.
 */
export function stop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  endTime = null;
}
