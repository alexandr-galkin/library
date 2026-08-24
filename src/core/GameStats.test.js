import { describe, expect, it } from 'vitest';
import { GameStats } from './GameStats.js';

describe('GameStats', () => {
  it('tracks correct placements and combo', () => {
    const stats = new GameStats();
    stats.addCorrect(100);
    stats.addCorrect(200);

    expect(stats.placed).toBe(2);
    expect(stats.combo).toBe(2);
    expect(stats.levelScore).toBe(300);
    expect(stats.totalScore).toBe(300);
  });

  it('resets combo after a mistake', () => {
    const stats = new GameStats();
    stats.addCorrect(100);
    stats.addMistake();

    expect(stats.combo).toBe(0);
    expect(stats.mistakes).toBe(1);
    expect(stats.placed).toBe(1);
  });

  it('calculates accuracy and stars', () => {
    const stats = new GameStats();
    expect(stats.accuracy(10)).toBe(1);
    expect(stats.stars()).toBe(3);

    stats.addMistake();
    expect(stats.accuracy(10)).toBe(0.9);
    expect(stats.stars()).toBe(2);

    stats.addMistake();
    stats.addMistake();
    expect(stats.stars()).toBe(1);
  });
});
