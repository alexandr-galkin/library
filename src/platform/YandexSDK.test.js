import { afterEach, describe, expect, it, vi } from 'vitest';

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
  if (originalDocument === undefined) delete globalThis.document;
  else globalThis.document = originalDocument;
});

describe('YandexSDK', () => {
  it('requests player data without opening authorization scopes', async () => {
    const getData = vi.fn(async () => ({}));
    const getPlayer = vi.fn(async () => ({ getData }));
    globalThis.window = {
      YaGames: {
        init: vi.fn(async () => ({
          getPlayer,
          on: vi.fn(),
        })),
      },
      dispatchEvent: vi.fn(),
    };
    globalThis.document = {};

    const { loadCloudSave } = await import('./YandexSDK.js');
    await loadCloudSave();

    expect(getPlayer).toHaveBeenCalledWith({ scopes: false });
  });
});
