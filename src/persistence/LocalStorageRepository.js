const DEFAULT_KEY = 'library-game';

export class LocalStorageRepository {
  constructor(storage = globalThis.localStorage, key = DEFAULT_KEY, legacyKeys = []) {
    this.storage = storage;
    this.key = key;
    this.legacyKeys = [...new Set(legacyKeys.filter(value => value && value !== key))];
  }

  load() {
    if (!this.storage) return null;
    for (const key of [this.key, ...this.legacyKeys]) {
      const data = this.read(key);
      if (data === null) continue;
      if (key !== this.key) this.save(data);
      return data;
    }
    return null;
  }

  read(key) {
    try {
      const raw = this.storage.getItem(key);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
    } catch (error) {
      console.warn(`Failed to read saved game state from ${key}:`, error);
      return null;
    }
  }

  save(data) {
    if (!this.storage) return false;
    try {
      this.storage.setItem(this.key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn('Failed to save game state:', error);
      return false;
    }
  }

  clear() {
    if (!this.storage) return false;
    try {
      this.storage.removeItem(this.key);
      return true;
    } catch (error) {
      console.warn('Failed to clear game state:', error);
      return false;
    }
  }
}
