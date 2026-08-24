import { LibraryTheme } from './library/LibraryTheme.js';

export class ThemeManager {
  constructor() {
    this.themes = {
      library: new LibraryTheme(),
    };
    
    this.currentThemeName = 'library';
    this.current = this.themes.library;
  }

  getTheme(name) {
    return this.themes[name] || this.current;
  }

  setTheme(name) {
    if (this.themes[name]) {
      this.current = this.themes[name];
      this.currentThemeName = name;
      return true;
    }
    return false;
  }

  getAllThemes() {
    return Object.values(this.themes);
  }

  getThemeNames() {
    return Object.keys(this.themes);
  }

  getCurrentThemeName() {
    return this.currentThemeName;
  }

  registerTheme(name, theme) {
    if (theme && typeof theme.renderBook === 'function') {
      this.themes[name] = theme;
      return true;
    }
    return false;
  }
}