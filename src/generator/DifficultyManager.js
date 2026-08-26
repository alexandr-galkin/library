import { LevelConfig } from './LevelConfig.js';

const clampDifficulty = level => Math.max(1, Math.floor(Number(level) || 1));

export class DifficultyManager {
  static getDifficulty(level) {
    return Math.min(LevelConfig.maxDifficulty(), Math.floor((clampDifficulty(level) - 1) / 2) + 1);
  }

  static getPuzzleConfig(difficulty, level, rng = null) {
    const config = LevelConfig.forDifficulty(difficulty);
    const pickRange = (range) => {
      if (!rng || range[0] === range[1]) return range[0];
      return rng.int(range[0], range[1]);
    };
    const colors = pickRange(config.colors);
    const shelves = Math.max(colors + 1, pickRange(config.shelves));
    return { colors, shelves, capacity: config.capacity, level };
  }

  /**
   * Calculate time from the actual generated puzzle shape rather than the
   * level number. The timer is intentionally tighter: most solved levels
   * should finish with a small buffer instead of leaving a minute or more.
   */
  static getTimeLimit({ colors = 3, shelves = 4, objects = 12 } = {}) {
    const raw = 28 + objects * 1.35 + shelves * 4.5 + colors * 3.5;
    return Math.round(Math.min(120, Math.max(55, raw)));
  }

  static getStarThresholds(difficulty) {
    const d = clampDifficulty(difficulty);
    return [0.2, Math.min(0.45, 0.18 + d * 0.012)];
  }
}
