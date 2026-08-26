import { describe, expect, it } from 'vitest';
import { LayoutManager } from './LayoutManager.js';

function boardHeight(layout) {
  return layout.rows * layout.shelfHeight + Math.max(0, layout.rows - 1) * layout.shelfGap;
}

function ratio(layout) {
  return Math.max(layout.gameWidth, layout.gameHeight) / Math.min(layout.gameWidth, layout.gameHeight);
}

function fourBookStackHeight(layout) {
  return layout.bookHeight * 4 - layout.bookStackOffset * 3;
}

describe('LayoutManager', () => {
  it('keeps all shelf rows inside narrow mobile portrait viewports', () => {
    const manager = new LayoutManager({ documentRef: { defaultView: {} } });

    for (const [width, height, shelves] of [[320, 568, 5], [360, 640, 5], [390, 844, 8]]) {
      const layout = manager.calculateLayout(width, height, shelves);

      expect(boardHeight(layout)).toBeLessThanOrEqual(layout.gameHeight);
    }
  });

  it('keeps desktop active field ratio within two to one', () => {
    const manager = new LayoutManager({ documentRef: { defaultView: {} } });
    const layout = manager.calculateLayout(1920, 400, 8);

    expect(ratio(layout)).toBeLessThanOrEqual(2);
  });

  it('keeps full book stacks inside shelf content', () => {
    const manager = new LayoutManager({ documentRef: { defaultView: {} } });

    for (const [width, height, shelves] of [[320, 568, 5], [320, 568, 8], [390, 844, 8], [568, 320, 8], [1920, 300, 8]]) {
      const layout = manager.calculateLayout(width, height, shelves);

      expect(fourBookStackHeight(layout)).toBeLessThanOrEqual(layout.shelfContentHeight);
    }
  });
});
