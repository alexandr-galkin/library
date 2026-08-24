import { ProceduralLevelGenerator } from '../generator/ProceduralLevelGenerator.js';

/** Coordinates level generation without knowing anything about the DOM. */
export class LevelManager {
  constructor({ generator = ProceduralLevelGenerator, theme } = {}) {
    this.generator = generator;
    this.theme = theme;
  }

  /** Generate a level using the existing procedural generator. @param {number} levelNumber @returns {object} */
  generate(levelNumber) {
    const level = this.generator.generate(levelNumber, this.theme);
    if (!level || typeof level !== 'object') throw new Error(`Invalid level: ${levelNumber}`);
    return level;
  }
}
