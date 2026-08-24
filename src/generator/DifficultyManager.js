export class DifficultyManager {
  static getDifficulty(level) {
    return Math.floor((level - 1) / 15) + 1;
  }

  static getAvailableFields(difficulty) {
    const fields = ['color'];
    
    if (difficulty >= 1) fields.push('size');
    if (difficulty >= 2) fields.push('genre');
    if (difficulty >= 3) fields.push('symbol');
    if (difficulty >= 4) fields.push('thickness');
    
    return fields;
  }

  static getMaxContainers(difficulty) {
    if (difficulty <= 1) return 3;
    if (difficulty === 2) return 4;
    if (difficulty === 3) return 4;
    if (difficulty === 4) return 5;
    return Math.min(2 + Math.ceil(difficulty / 2), 6);
  }

  static getObjectCount(difficulty, level, rng) {
    let base;
    
    switch (difficulty) {
      case 1:
        base = rng.int(4, 6);
        break;
      case 2:
        base = rng.int(5, 7);
        break;
      case 3:
        base = rng.int(6, 9);
        break;
      case 4:
        base = rng.int(7, 10);
        break;
      default:
        base = Math.min(6 + difficulty * 2 + rng.int(0, 3), 14);
        break;
    }
    
    // First level should be easy
    if (level === 1) {
      base = 4;
    }
    
    return base;
  }

  static getModifierChance(difficulty) {
    return {
      timer: difficulty >= 4 ? Math.min(0.25 + (difficulty - 4) * 0.05, 0.5) : 0,
      forbidden: difficulty >= 5 ? Math.min(0.15 + (difficulty - 5) * 0.04, 0.35) : 0,
      decoy: difficulty >= 5 ? Math.min(0.1 + (difficulty - 5) * 0.03, 0.25) : 0,
      moving: difficulty >= 6 ? Math.min(0.08 + (difficulty - 6) * 0.02, 0.2) : 0,
      chaos: difficulty >= 7 ? Math.min(0.06 + (difficulty - 7) * 0.02, 0.15) : 0,
      hidden: difficulty >= 8 ? Math.min(0.04 + (difficulty - 8) * 0.02, 0.12) : 0,
    };
  }

  static getTimeLimit(difficulty, objectCount) {
    if (difficulty < 4) return null;
    
    const baseTime = 30;
    const timePerObject = 5;
    const difficultyPenalty = difficulty * 3;
    
    return Math.max(15, baseTime + objectCount * timePerObject - difficultyPenalty);
  }

  static getStarThresholds(difficulty) {
    // Returns [mistakesFor3Stars, mistakesFor2Stars]
    return [0, Math.floor(difficulty / 2) + 1];
  }
}