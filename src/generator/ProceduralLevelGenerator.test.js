import { describe, expect, it } from 'vitest';
import { ProceduralLevelGenerator } from './ProceduralLevelGenerator.js';

const theme = {
  name: 'test',
  getAllBookProperties: () => ({
    colors: ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'black', 'white'],
    sizes: ['small', 'large'],
    genres: ['fiction', 'science'],
    symbols: ['none', 'star'],
    thicknesses: ['thin', 'thick'],
  }),
};

describe('ProceduralLevelGenerator', () => {
  it('generates deterministic book sort levels for the same input', () => {
    const first = ProceduralLevelGenerator.generate(1, theme);
    const second = ProceduralLevelGenerator.generate(1, theme);
    expect(second).toEqual(first);
  });

  it('produces a valid book sort board', () => {
    const level = ProceduralLevelGenerator.generate(20, theme);
    expect(level.id).toBe(20);
    expect(level.mode).toBe('book-sort');
    expect(level.capacity).toBe(4);
    expect(level.colorCount).toBeGreaterThanOrEqual(3);
    expect(level.colorCount).toBeLessThanOrEqual(8);
    expect(level.shelfCount).toBeLessThanOrEqual(8);
    expect(level.objects.length).toBe(level.colorCount * level.capacity);
    expect(level.seed).toBeTypeOf('number');
  });
});
