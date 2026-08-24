import { describe, expect, it } from 'vitest';
import { BookSortDropValidator } from './BookSortDropValidator.js';

const validator = new BookSortDropValidator();

function board() {
  const a = { uid: 'a', color: 'red', shelfId: 'one' };
  const b = { uid: 'b', color: 'blue', shelfId: 'one' };
  const c = { uid: 'c', color: 'red', shelfId: 'two' };
  return {
    capacity: 4,
    objects: [a, b, c],
    containers: [
      { id: 'one', items: ['a', 'b'] },
      { id: 'two', items: ['c'] },
      { id: 'three', items: [] },
    ],
  };
}

describe('BookSortDropValidator', () => {
  it('allows the top book onto an empty shelf', () => {
    const level = board();
    expect(validator.canDrop(level.objects[0], level.containers[2], level)).toBe(true);
  });

  it('allows a book onto a shelf with the same color', () => {
    const level = board();
    expect(validator.canDrop(level.objects[0], level.containers[1], level)).toBe(true);
  });

  it('allows a book of a different color when the target shelf has space', () => {
    const level = board();
    expect(validator.canDrop(level.objects[0], level.containers[1], level)).toBe(true);
  });

  it('rejects buried books', () => {
    const level = board();
    expect(validator.canDrop(level.objects[1], level.containers[1], level)).toBe(false);
  });
});
