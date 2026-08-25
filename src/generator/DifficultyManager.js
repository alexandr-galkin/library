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

  static getAvailableFields() { return ['color']; }
  static getMaxContainers(difficulty) { return LevelConfig.forDifficulty(difficulty).maxContainers; }
  static getObjectCount(difficulty) { const c = LevelConfig.forDifficulty(difficulty); return c.colors[0] * c.capacity; }
  static getModifierChance() { return {}; }

  /**
   * Calculate time from the actual generated puzzle shape rather than the
   * level number. This keeps early levels relaxed while giving larger puzzles
   * enough time without maintaining a hand-written timer table.
   */
  static getTimeLimit({ colors = 3, shelves = 4, objects = 12 } = {}) {
    const raw = 32 + objects * 1.6 + shelves * 5 + colors * 4;
    return Math.round(Math.min(210, Math.max(60, raw)));
  }

  static getStarThresholds(difficulty) {
    const d = clampDifficulty(difficulty);
    return [0.2, Math.min(0.45, 0.18 + d * 0.012)];
  }
}
