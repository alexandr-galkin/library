import { describe, expect, it, vi } from 'vitest';
import { GameTimer } from './GameTimer.js';

describe('GameTimer', () => {
  it('ticks and completes', () => {
    vi.useFakeTimers();
    const ticks = [];
    const complete = vi.fn();
    const timer = new GameTimer({ onTick: value => ticks.push(value), onComplete: complete });

    timer.start(2);
    vi.advanceTimersByTime(2000);

    expect(ticks).toEqual([2, 1, 0]);
    expect(complete).toHaveBeenCalledOnce();
    timer.destroy();
    vi.useRealTimers();
  });

  it('can pause and resume', () => {
    vi.useFakeTimers();
    const timer = new GameTimer();
    timer.start(3);
    vi.advanceTimersByTime(1000);
    timer.pause();
    vi.advanceTimersByTime(2000);
    expect(timer.remaining).toBe(2);
    timer.resume();
    vi.advanceTimersByTime(1000);
    expect(timer.remaining).toBe(1);
    timer.destroy();
    vi.useRealTimers();
  });
});
