import { describe, expect, it } from 'vitest';
import { LocalStorageRepository } from './LocalStorageRepository.js';

function storage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
  };
}

describe('LocalStorageRepository', () => {
  it('saves and loads JSON state', () => {
    const repo = new LocalStorageRepository(storage());
    expect(repo.save({ currentLevel: 4 })).toBe(true);
    expect(repo.load()).toEqual({ currentLevel: 4 });
  });

  it('migrates a legacy key into the current key', () => {
    const store = storage({ legacy: JSON.stringify({ currentLevel: 9 }) });
    const repo = new LocalStorageRepository(store, 'current', ['legacy']);
    expect(repo.load()).toEqual({ currentLevel: 9 });
    expect(JSON.parse(store.getItem('current'))).toEqual({ currentLevel: 9 });
  });

  it('rejects malformed persisted JSON', () => {
    const repo = new LocalStorageRepository(storage({ current: '{bad' }), 'current');
    expect(repo.load()).toBeNull();
  });

  it('clears the current key', () => {
    const store = storage();
    const repo = new LocalStorageRepository(store, 'current');
    repo.save({ value: 1 });
    expect(repo.clear()).toBe(true);
    expect(repo.load()).toBeNull();
  });
});
