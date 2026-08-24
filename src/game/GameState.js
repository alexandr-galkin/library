import { LocalStorageRepository } from '../persistence/LocalStorageRepository.js';

const DEFAULT_STATE = Object.freeze({
  currentLevel: 1,
  bestScore: 0,
  totalScore: 0,
  settings: Object.freeze({ sound: true, anim: true, reduced: false }),
});

const SETTING_KEYS = Object.freeze(['sound', 'anim', 'reduced']);

export class GameState {
  constructor(repository = new LocalStorageRepository()) {
    this.repository = repository;
    this.data = this.load();
  }

  load() {
    return this.validate(this.repository.load());
  }

  validate(saved) {
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return this.defaults();
    const defaults = this.defaults();
    return {
      currentLevel: this.number(saved.currentLevel, defaults.currentLevel, 1, 9999),
      bestScore: this.number(saved.bestScore, defaults.bestScore, 0, Number.MAX_SAFE_INTEGER),
      totalScore: this.number(saved.totalScore, defaults.totalScore, 0, Number.MAX_SAFE_INTEGER),
      settings: this.validateSettings(saved.settings, defaults.settings),
    };
  }

  number(value, fallback, min, max) {
    const number = Number(value);
    return Number.isFinite(number) && number >= min && number <= max ? Math.floor(number) : fallback;
  }

  validateSettings(saved, defaults) {
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return { ...defaults };
    return Object.fromEntries(SETTING_KEYS.map(key => [
      key,
      typeof saved[key] === 'boolean' ? saved[key] : defaults[key],
    ]));
  }

  defaults() {
    return {
      currentLevel: DEFAULT_STATE.currentLevel,
      bestScore: DEFAULT_STATE.bestScore,
      totalScore: DEFAULT_STATE.totalScore,
      settings: { ...DEFAULT_STATE.settings },
    };
  }

  save() { return this.repository.save(this.data); }

  get(key) { return this.data[key]; }

  set(key, value) {
    if (!(key in this.data)) return false;
    this.data[key] = value;
    return this.save();
  }

  updateSettings(settings) {
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return false;
    const next = {};
    for (const key of SETTING_KEYS) {
      if (typeof settings[key] === 'boolean') next[key] = settings[key];
    }
    this.data.settings = { ...this.data.settings, ...next };
    return this.save();
  }

  reset() {
    this.data = this.defaults();
    return this.save();
  }
}
