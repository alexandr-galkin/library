import { PuzzleTheme } from './PuzzleTheme.js';

/** Registry for runtime-switchable visual themes. */
export class ThemeManager {
  constructor({ documentRef = document } = {}) {
    this.current = new PuzzleTheme({ documentRef });
  }
}
