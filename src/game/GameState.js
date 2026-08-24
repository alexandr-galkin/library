export class GameState {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem('chaosGame_v2'));
      return this.validateAndMerge(saved);
    } catch {
      return this.defaults();
    }
  }

  validateAndMerge(saved) {
    const defaults = this.defaults();
    if (!saved || typeof saved !== 'object') return defaults;
    
    return {
      currentLevel: this.validateNumber(saved.currentLevel, defaults.currentLevel, 1, 9999),
      bestScore: this.validateNumber(saved.bestScore, defaults.bestScore, 0, Infinity),
      totalScore: this.validateNumber(saved.totalScore, defaults.totalScore, 0, Infinity),
      settings: this.validateSettings(saved.settings, defaults.settings),
    };
  }

  validateNumber(value, defaultValue, min, max) {
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) return defaultValue;
    return Math.floor(num);
  }

  validateSettings(saved, defaults) {
    if (!saved || typeof saved !== 'object') return defaults;
    
    return {
      sound: typeof saved.sound === 'boolean' ? saved.sound : defaults.sound,
      anim: typeof saved.anim === 'boolean' ? saved.anim : defaults.anim,
      reduced: typeof saved.reduced === 'boolean' ? saved.reduced : defaults.reduced,
    };
  }

  defaults() {
    return {
      currentLevel: 1,
      bestScore: 0,
      totalScore: 0,
      settings: {
        sound: true,
        anim: true,
        reduced: false,
      },
    };
  }

  save() {
    try {
      localStorage.setItem('chaosGame_v2', JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save game state:', e);
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  updateSettings(settings) {
    this.data.settings = {
      ...this.data.settings,
      ...settings,
    };
    this.save();
  }

  reset() {
    this.data = this.defaults();
    this.save();
  }
}