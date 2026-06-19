import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getState,
  selectPreset,
  start,
  pause,
  reset,
  complete,
  resetStateForTesting,
  PRESET_DURATIONS_MS,
} from '../src/state.js';
import * as timer from '../src/timer.js';
import * as audio from '../src/audio.js';

vi.mock('../src/timer.js', () => ({
  start: vi.fn(),
  pause: vi.fn(() => 120_000),
  stop: vi.fn(),
  formatTime: vi.fn((ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }),
}));

vi.mock('../src/audio.js', () => ({
  unlock: vi.fn(),
  play: vi.fn(),
  resetForTesting: vi.fn(),
}));

describe('state.js FSM', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStateForTesting();
  });

  it('initializes with 5 min preset idle state', () => {
    const state = getState();
    expect(state.status).toBe('idle');
    expect(state.presetMinutes).toBe(5);
    expect(state.remainingMs).toBe(PRESET_DURATIONS_MS[5]);
    expect(state.hasInteractedWithPreset).toBe(false);
  });

  it('selectPreset updates duration and marks interaction', () => {
    selectPreset(10);
    const state = getState();
    expect(state.presetMinutes).toBe(10);
    expect(state.remainingMs).toBe(PRESET_DURATIONS_MS[10]);
    expect(state.hasInteractedWithPreset).toBe(true);
  });

  it('selectPreset is no-op when running', () => {
    start();
    selectPreset(1);
    expect(getState().presetMinutes).toBe(5);
  });

  it('selectPreset is no-op when paused', () => {
    start();
    pause();
    selectPreset(1);
    expect(getState().presetMinutes).toBe(5);
  });

  it('selectPreset works from complete state', () => {
    complete();
    selectPreset(25);
    const state = getState();
    expect(state.status).toBe('idle');
    expect(state.presetMinutes).toBe(25);
    expect(state.remainingMs).toBe(PRESET_DURATIONS_MS[25]);
  });

  it('start transitions to running and unlocks audio', () => {
    start();
    expect(getState().status).toBe('running');
    expect(audio.unlock).toHaveBeenCalled();
    expect(timer.start).toHaveBeenCalled();
  });

  it('start is ignored when already running', () => {
    start();
    vi.clearAllMocks();
    start();
    expect(timer.start).not.toHaveBeenCalled();
  });

  it('pause preserves remaining time', () => {
    start();
    pause();
    expect(getState().status).toBe('paused');
    expect(getState().remainingMs).toBe(120_000);
  });

  it('reset returns to idle with full preset duration', () => {
    start();
    reset();
    const state = getState();
    expect(state.status).toBe('idle');
    expect(state.remainingMs).toBe(PRESET_DURATIONS_MS[5]);
    expect(timer.stop).toHaveBeenCalled();
  });

  it('complete sets zero remaining and plays audio', () => {
    complete();
    const state = getState();
    expect(state.status).toBe('complete');
    expect(state.remainingMs).toBe(0);
    expect(audio.play).toHaveBeenCalled();
  });

  it('complete is idempotent and does not replay audio', () => {
    complete();
    vi.clearAllMocks();
    complete();
    expect(audio.play).not.toHaveBeenCalled();
    expect(timer.stop).not.toHaveBeenCalled();
  });
});
