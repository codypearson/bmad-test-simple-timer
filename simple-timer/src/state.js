/**
 * Application state FSM with subscribe/notify pattern.
 * Central hub for timer state transitions.
 */

import * as timer from './timer.js';
import * as audio from './audio.js';

/** Preset durations in milliseconds keyed by minutes. */
export const PRESET_DURATIONS_MS = {
  1: 60_000,
  5: 300_000,
  10: 600_000,
  25: 1_500_000,
};

/** @typedef {'idle' | 'running' | 'paused' | 'complete'} TimerStatus */

/** @type {{ status: TimerStatus, presetMinutes: number, remainingMs: number, hasInteractedWithPreset: boolean }} */
let state = {
  status: 'idle',
  presetMinutes: 5,
  remainingMs: PRESET_DURATIONS_MS[5],
  hasInteractedWithPreset: false,
};

const listeners = new Set();

/**
 * Returns a shallow copy of the current application state.
 * @returns {typeof state}
 */
export function getState() {
  return { ...state };
}

/**
 * Subscribes to state change notifications.
 * @param {(snapshot: ReturnType<typeof getState>) => void} listener
 * @returns {() => void} Unsubscribe function
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Notifies all subscribers of the current state snapshot.
 */
function notify() {
  listeners.forEach((listener) => listener(getState()));
}

/**
 * Handles countdown tick updates from the timer engine.
 * @param {number} remainingMs
 */
function onTick(remainingMs) {
  state = { ...state, remainingMs };
  notify();
}

/**
 * Handles timer completion — transitions to complete state and plays audio.
 */
function onTimerComplete() {
  complete();
}

/**
 * Selects a preset duration. Allowed in idle and complete states only.
 * @param {number} minutes - Preset duration in minutes (1, 5, 10, or 25)
 */
export function selectPreset(minutes) {
  if (state.status === 'running' || state.status === 'paused') {
    console.warn(`selectPreset ignored in ${state.status} state`);
    return;
  }

  if (!PRESET_DURATIONS_MS[minutes]) {
    console.warn(`Invalid preset: ${minutes}`);
    return;
  }

  state = {
    ...state,
    status: 'idle',
    presetMinutes: minutes,
    remainingMs: PRESET_DURATIONS_MS[minutes],
    hasInteractedWithPreset: true,
  };
  notify();
}

/**
 * Starts or resumes the countdown from the current remaining time.
 */
export function start() {
  if (state.status !== 'idle' && state.status !== 'paused') {
    console.warn(`start ignored in ${state.status} state`);
    return;
  }

  audio.unlock();
  state = { ...state, status: 'running' };
  timer.start(state.remainingMs, onTick, onTimerComplete);
  notify();
}

/**
 * Pauses the running countdown and preserves remaining time.
 */
export function pause() {
  if (state.status !== 'running') {
    console.warn(`pause ignored in ${state.status} state`);
    return;
  }

  const remainingMs = timer.pause();
  state = { ...state, status: 'paused', remainingMs };
  notify();
}

/**
 * Stops the countdown and restores the selected preset's full duration.
 */
export function reset() {
  timer.stop();
  state = {
    ...state,
    status: 'idle',
    remainingMs: PRESET_DURATIONS_MS[state.presetMinutes],
  };
  notify();
}

/**
 * Transitions to complete state when countdown reaches zero.
 */
export function complete() {
  if (state.status === 'complete') {
    return;
  }

  timer.stop();
  state = { ...state, status: 'complete', remainingMs: 0 };
  audio.play();
  notify();
}

/**
 * Initializes state and notifies subscribers for initial render.
 */
export function initState() {
  notify();
}

/**
 * Resets state to cold-open defaults (for testing only).
 */
export function resetStateForTesting() {
  timer.stop();
  state = {
    status: 'idle',
    presetMinutes: 5,
    remainingMs: PRESET_DURATIONS_MS[5],
    hasInteractedWithPreset: false,
  };
}
