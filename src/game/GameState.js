import { LocalStorageRepository } from '../persistence/LocalStorageRepository.js';

const DEFAULT_STATE = Object.freeze({
  currentLevel: 1,
  bestScore: 0,
  totalScore: 0,
  settings: Object.freeze({
    sound: true,
    anim: true,
    reduced: false,
  }),
});

export class GameState {
  constructor(repository = new LocalStorageRepository()) {
    this.repository = repository;
    this.data = this.load();
  }

  load() {
    return this.validateAndMerge(this.repository.load());
  }

  validateAndMerge(saved) {
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
      return this.defaults();
    }

    const defaults = this.defaults();

    return {
      currentLevel: this.validateNumber(saved.currentLevel, defaults.currentLevel, 1, 9999),
      bestScore: this.validateNumber(saved.bestScore, defaults.bestScore, 0, Number.MAX_SAFE_INTEGER),
      totalScore: this.validateNumber(saved.totalScore, defaults.totalScore, 0, Number.MAX_SAFE_INTEGER),
      settings: this.validateSettings(saved.settings, defaults.settings),
    };
  }

  validateNumber(value, defaultValue, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < min || number > max) {
      return defaultValue;
    }
    return Math.floor(number);
  }

  validateSettings(saved, defaults) {
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
      return { ...defaults };
    }

    return {
      sound: typeof saved.sound === 'boolean' ? saved.sound : defaults.sound,
      anim: typeof saved.anim === 'boolean' ? saved.anim : defaults.anim,
      reduced: typeof saved.reduced === 'boolean' ? saved.reduced : defaults.reduced,
    };
  }

  defaults() {
    return {
      currentLevel: DEFAULT_STATE.currentLevel,
      bestScore: DEFAULT_STATE.bestScore,
      totalScore: DEFAULT_STATE.totalScore,
      settings: { ...DEFAULT_STATE.settings },
    };
  }

  save() {
    this.repository.save(this.data);
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
