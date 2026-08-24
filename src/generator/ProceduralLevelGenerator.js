import { LevelFactory } from './LevelFactory.js';
import { generateSeed } from './SeededRandom.js';
import { DifficultyManager } from './DifficultyManager.js';
import { LevelValidator } from './LevelValidator.js';

const MAX_ATTEMPTS = 10;
const RETRY_STEP = 1000;

export class ProceduralLevelGenerator {
  static generate(levelNum, theme) {
    const factory = new LevelFactory({ theme });
    const baseSeed = generateSeed(levelNum);

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const level = factory.create(levelNum, baseSeed + attempt * RETRY_STEP);
      if (LevelValidator.validate(level)) return level;
    }

    throw new Error(`Unable to generate a valid level after ${MAX_ATTEMPTS} attempts (level=${levelNum})`);
  }

  static getDifficulty(levelNum) {
    return DifficultyManager.getDifficulty(levelNum);
  }
}
