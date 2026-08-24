import { SeededRandom } from './SeededRandom.js';
import { DifficultyManager } from './DifficultyManager.js';
import { SortPuzzleGenerator } from './SortPuzzleGenerator.js';

export class LevelFactory {
  constructor({ theme, difficultyManager = DifficultyManager } = {}) {
    if (!theme || typeof theme.getAllBookProperties !== 'function') {
      throw new TypeError('LevelFactory requires a valid theme');
    }
    this.theme = theme;
    this.difficultyManager = difficultyManager;
  }

  create(levelNumber, seed) {
    const difficulty = this.difficultyManager.getDifficulty(levelNumber);
    const rng = new SeededRandom(seed);
    const config = this.difficultyManager.getPuzzleConfig(difficulty, levelNumber, rng);
    const level = SortPuzzleGenerator.generate({
      rng,
      colors: config.colors,
      shelves: config.shelves,
      theme: this.theme,
      levelNumber,
      difficulty,
    });
    level.seed = seed;
    level.capacity = config.capacity;
    return level;
  }
}
