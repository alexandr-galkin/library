import { LevelConfig } from './LevelConfig.js';

const clampDifficulty = level => Math.max(1, Math.floor(Number(level) || 1));

export class DifficultyManager {
  static getDifficulty(level) {
    return Math.min(LevelConfig.maxDifficulty(), Math.floor((clampDifficulty(level) - 1) / 15) + 1);
  }

  static getAvailableFields(difficulty) {
    return [...LevelConfig.forDifficulty(difficulty).fields];
  }

  static getMaxContainers(difficulty) {
    return LevelConfig.forDifficulty(difficulty).maxContainers;
  }

  static getObjectCount(difficulty, level, rng) {
    const config = LevelConfig.forDifficulty(difficulty);
    const currentLevel = Math.max(1, Math.floor(Number(level) || 1));
    if (currentLevel === 1) return config.objects[0];
    if (!rng || typeof rng.int !== 'function') throw new TypeError('DifficultyManager requires an RNG with int()');
    return rng.int(config.objects[0], config.objects[1]);
  }

  static getModifierChance(difficulty) {
    return { ...LevelConfig.forDifficulty(difficulty).modifiers };
  }

  static getTimeLimit(difficulty, objectCount) {
    const config = LevelConfig.forDifficulty(difficulty);
    if (!config.timeLimit) return null;
    const objects = Math.max(0, Math.floor(Number(objectCount) || 0));
    return Math.max(config.timeLimit.min, config.timeLimit.base + objects * config.timeLimit.perObject - clampDifficulty(difficulty) * config.timeLimit.perDifficulty);
  }

  static getStarThresholds(difficulty) {
    const value = clampDifficulty(difficulty);
    return [0, Math.floor(value / 2) + 1];
  }
}
