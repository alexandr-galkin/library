const clampDifficulty = level => Math.max(1, Math.floor(Number(level) || 1));

export class DifficultyManager {
  static getDifficulty(level) {
    return Math.floor((clampDifficulty(level) - 1) / 15) + 1;
  }

  static getAvailableFields(difficulty) {
    const value = clampDifficulty(difficulty);
    const fields = ['color', 'size'];
    if (value >= 2) fields.push('genre');
    if (value >= 3) fields.push('symbol');
    if (value >= 4) fields.push('thickness');
    return fields;
  }

  static getMaxContainers(difficulty) {
    const value = clampDifficulty(difficulty);
    if (value <= 1) return 3;
    if (value === 2 || value === 3) return 4;
    if (value === 4) return 5;
    return Math.min(2 + Math.ceil(value / 2), 6);
  }

  static getObjectCount(difficulty, level, rng) {
    const value = clampDifficulty(difficulty);
    const currentLevel = Math.max(1, Math.floor(Number(level) || 1));
    if (currentLevel === 1) return 4;
    if (!rng || typeof rng.int !== 'function') throw new TypeError('DifficultyManager requires an RNG with int()');

    if (value === 1) return rng.int(4, 6);
    if (value === 2) return rng.int(5, 7);
    if (value === 3) return rng.int(6, 9);
    if (value === 4) return rng.int(7, 10);
    return Math.min(6 + value * 2 + rng.int(0, 3), 14);
  }

  static getModifierChance(difficulty) {
    const value = clampDifficulty(difficulty);
    return {
      timer: value >= 4 ? Math.min(0.25 + (value - 4) * 0.05, 0.5) : 0,
      forbidden: value >= 5 ? Math.min(0.15 + (value - 5) * 0.04, 0.35) : 0,
      decoy: value >= 5 ? Math.min(0.1 + (value - 5) * 0.03, 0.25) : 0,
      moving: value >= 6 ? Math.min(0.08 + (value - 6) * 0.02, 0.2) : 0,
      chaos: value >= 7 ? Math.min(0.06 + (value - 7) * 0.02, 0.15) : 0,
      hidden: value >= 8 ? Math.min(0.04 + (value - 8) * 0.02, 0.12) : 0,
    };
  }

  static getTimeLimit(difficulty, objectCount) {
    const value = clampDifficulty(difficulty);
    if (value < 4) return null;
    const objects = Math.max(0, Math.floor(Number(objectCount) || 0));
    return Math.max(15, 30 + objects * 5 - value * 3);
  }

  static getStarThresholds(difficulty) {
    const value = clampDifficulty(difficulty);
    return [0, Math.floor(value / 2) + 1];
  }
}
