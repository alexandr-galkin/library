const DEFAULT_KEY = 'library-game';

export class LocalStorageRepository {
  constructor(storage = globalThis.localStorage, key = DEFAULT_KEY, legacyKeys = []) {
    this.storage = storage;
    this.key = key;
    this.legacyKeys = legacyKeys;
  }

  load() {
    if (!this.storage) return null;

    for (const key of [this.key, ...this.legacyKeys]) {
      try {
        const raw = this.storage.getItem(key);
        if (!raw) continue;

        const data = JSON.parse(raw);
        if (key !== this.key) this.save(data);
        return data;
      } catch (error) {
        console.warn(`Failed to load saved game state from ${key}:`, error);
      }
    }

    return null;
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
