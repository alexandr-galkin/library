import { ProceduralLevelGenerator } from '../generator/ProceduralLevelGenerator.js';
import { BOOK_COLORS, BOOK_SIZES, BOOK_GENRES, BOOK_SYMBOLS, BOOK_THICKNESS } from '../themes/library/BookAssets.js';

/**
 * Coordinates level generation without knowing anything about the DOM.
 *
 * The generator historically expects themes to expose getAllBookProperties().
 * Keep that contract here so visual/theme refactoring cannot break level generation.
 */
export class LevelManager {
  constructor({ generator = ProceduralLevelGenerator, theme } = {}) {
    if (!theme) {
      throw new TypeError('LevelManager requires a theme');
    }

    this.generator = generator;
    this.theme = theme;
    this.generatorTheme = this.createGeneratorTheme(theme);
  }

  /** Generate a level using the existing procedural generator. @param {number} levelNumber @returns {object} */
  generate(levelNumber) {
    const level = this.generator.generate(levelNumber, this.generatorTheme);
    if (!level || typeof level !== 'object') {
      throw new Error(`Invalid level: ${levelNumber}`);
    }
    return level;
  }

  /**
   * Adapt a visual theme to the data contract required by the level generator.
   * Existing theme methods/properties remain available through the proxy.
   * @param {object} theme
   * @returns {object}
   */
  createGeneratorTheme(theme) {
    if (typeof theme.getAllBookProperties === 'function') {
      return theme;
    }

    const properties = {
      colors: Object.keys(BOOK_COLORS),
      sizes: Object.keys(BOOK_SIZES),
      genres: Object.keys(BOOK_GENRES),
      symbols: Object.keys(BOOK_SYMBOLS),
      thicknesses: Object.keys(BOOK_THICKNESS),
    };

    return new Proxy(theme, {
      get(target, property, receiver) {
        if (property === 'getAllBookProperties') {
          return () => properties;
        }
        return Reflect.get(target, property, receiver);
      },
    });
  }
}
