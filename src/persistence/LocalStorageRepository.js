const DEFAULT_KEY = 'library-game';

export class LocalStorageRepository {
  constructor(storage = globalThis.localStorage, key = DEFAULT_KEY) {
    this.storage = storage;
    this.key = key;
  }

  load() {
    if (!this.storage) return null;

    try {
      const raw = this.storage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('Failed to load saved game state:', error);
      return null;
    }
  }

  save(data) {
    if (!this.storage) return;

    try {
      this.storage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save game state:', error);
    }
  }

  clear() {
    if (!this.storage) return;
    this.storage.removeItem(this.key);
  }
}
