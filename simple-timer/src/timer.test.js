import { describe, it, expect } from 'vitest';
import { formatTime } from '../src/timer.js';

describe('formatTime', () => {
  it('formats full minutes as MM:SS', () => {
    expect(formatTime(300_000)).toBe('05:00');
    expect(formatTime(60_000)).toBe('01:00');
    expect(formatTime(600_000)).toBe('10:00');
    expect(formatTime(1_500_000)).toBe('25:00');
  });

  it('formats partial seconds correctly', () => {
    expect(formatTime(90_000)).toBe('01:30');
    expect(formatTime(61_000)).toBe('01:01');
  });

  it('formats zero as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('uses tabular-friendly zero padding', () => {
    expect(formatTime(5_000)).toBe('00:05');
  });

  it('floors sub-second remainders instead of rounding up', () => {
    expect(formatTime(999)).toBe('00:00');
    expect(formatTime(100)).toBe('00:00');
  });
});
