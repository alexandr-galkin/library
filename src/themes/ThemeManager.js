import { PuzzleTheme } from './PuzzleTheme.js';

/** Registry for runtime-switchable visual themes. */
export class ThemeManager {
  constructor({ documentRef = document } = {}) {
    this.themes = { library: new PuzzleTheme({ documentRef }) };
    this.currentThemeName = 'library';
    this.current = this.themes.library;
  }

  /** @param {string} name @returns {object} */
  getTheme(name) { return this.themes[name] || this.current; }

  /** Switch the active theme without reloading the page. @param {string} name @returns {boolean} */
  setTheme(name) {
    if (!this.themes[name]) return false;
    this.current = this.themes[name];
    this.currentThemeName = name;
    return true;
  }

  /** @returns {object[]} */
  getAllThemes() { return Object.values(this.themes); }
  /** @returns {string[]} */
  getThemeNames() { return Object.keys(this.themes); }
  /** @returns {string} */
  getCurrentThemeName() { return this.currentThemeName; }

  /** @param {string} name @param {object} theme @returns {boolean} */
  registerTheme(name, theme) {
    if (!theme || typeof theme.renderBook !== 'function') return false;
    this.themes[name] = theme;
    return true;
  }
}
