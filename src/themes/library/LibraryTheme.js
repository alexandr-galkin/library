import { PuzzleTheme } from '../PuzzleTheme.js';

/** Backward-compatible alias for integrations that still import LibraryTheme. */
export class LibraryTheme extends PuzzleTheme {
  constructor(options = {}) { super(options); }
}
