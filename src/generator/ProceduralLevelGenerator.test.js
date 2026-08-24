import { describe, expect, it } from 'vitest';
import { ProceduralLevelGenerator } from './ProceduralLevelGenerator.js';

const theme = {
  name: 'test',
  getBookLabels: () => ({ color: { red: 'Красный', blue: 'Синий' } }),
  getAllBookProperties: () => ({
    colors: ['red', 'blue'],
    sizes: ['small', 'large'],
    genres: ['fiction', 'science'],
    symbols: ['none', 'star'],
    thicknesses: ['thin', 'thick'],
  }),
};

describe('ProceduralLevelGenerator', () => {
  it('generates deterministic levels for the same input', () => {
    const first = ProceduralLevelGenerator.generate(1, theme);
    const second = ProceduralLevelGenerator.generate(1, theme);

    expect(second).toEqual(first);
  });

  it('produces a valid level shape', () => {
    const level = ProceduralLevelGenerator.generate(20, theme);
    expect(level.id).toBe(20);
    expect(level.objects.length).toBeGreaterThan(0);
    expect(level.containers.length).toBeGreaterThan(0);
    expect(level.seed).toBeTypeOf('number');
  });
});
