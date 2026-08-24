import { LevelConfig } from './LevelConfig.js';

const clampDifficulty = level => Math.max(1, Math.floor(Number(level) || 1));

export class DifficultyManager {
  static getDifficulty(level) {
    return Math.min(LevelConfig.maxDifficulty(), Math.floor((clampDifficulty(level) - 1) / 10) + 1);
  }

  static getPuzzleConfig(difficulty, level, rng = null) {
    const config = LevelConfig.forDifficulty(difficulty);
    const pickRange = (range) => {
      if (!rng || range[0] === range[1]) return range[0];
      return rng.int(range[0], range[1]);
    };
    return {
      colors: pickRange(config.colors),
      shelves: Math.max(pickRange(config.shelves), pickRange(config.colors) + 1),
      capacity: config.capacity,
      level,
    };
  }

  static getAvailableFields() { return ['color']; }
  static getMaxContainers(difficulty) { return LevelConfig.forDifficulty(difficulty).maxContainers; }
  static getObjectCount(difficulty) { const c = LevelConfig.forDifficulty(difficulty); return c.colors[0] * c.capacity; }
  static getModifierChance() { return {}; }
  static getTimeLimit() { return null; }
  static getStarThresholds(difficulty) { return [0, Math.max(1, Math.floor(clampDifficulty(difficulty) / 2))]; }
}
