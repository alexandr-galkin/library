import { BOOK_SIZES } from '../themes/library/BookAssets.js';

const STYLE_ID = 'library-layout-manager';

/** The single owner of puzzle geometry. */
export class LayoutManager {
  constructor({ documentRef = document } = {}) { this.document = documentRef; this.style = null; }

  /** Inject layout CSS and return an idempotent cleanup function. */
  install() {
    const existing = this.document.getElementById(STYLE_ID);
    if (existing) { this.style = existing; return () => {}; }
    const style = this.document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = this.buildCSS();
    this.document.head.append(style);
    this.style = style;
    return () => this.destroy();
  }

  /** Keep every shelf in one horizontal row. */
  updateShelfCount(count) {
    const safeCount = Math.max(1, Number(count) || 1);
    this.document.documentElement.style.setProperty('--shelf-columns', String(safeCount));
    this.document.documentElement.style.setProperty('--shelf-rows', '1');
  }

  /** Build the complete puzzle layout stylesheet from shared asset dimensions. */
  buildCSS() {
    const book = BOOK_SIZES.medium;
    return `
      :root {
        --game-width: 830px;
        --game-height: 640px;
        --game-padding: 20px;
        --shelf-height: 460px;
        --shelf-gap: 14px;
        --shelf-columns: 5;
        --shelf-rows: 1;
        --book-width: ${book.width}px;
        --book-height: ${book.height}px;
        --shelf-content-height: 435px;
        --book-stack-gap: -62px;
        --book-lift: 10px;
      }

      #app { position: relative; width: 100vw; height: 100vh; min-width: 0; min-height: 0; overflow: hidden; }
      #app .game-table { position: absolute; left: 50%; top: 50%; width: var(--game-width); height: var(--game-height); max-width: calc(100vw - 24px); max-height: calc(100vh - 24px); transform: translate(-50%, -50%); overflow: hidden; }
      #app .game-table .containers-zone { position: absolute; left: var(--game-padding); right: var(--game-padding); top: 50%; width: auto; height: var(--shelf-height); margin: 0; padding: 0; transform: translateY(-50%); display: grid; grid-template-columns: repeat(var(--shelf-columns), minmax(0, 1fr)); grid-template-rows: var(--shelf-height); grid-auto-rows: var(--shelf-height); gap: var(--shelf-gap); align-items: stretch; overflow: visible; z-index: 20; }
      #app .game-table .shelf-container { position: relative; box-sizing: border-box; width: 100%; height: var(--shelf-height); min-width: 0; min-height: var(--shelf-height); margin: 0; padding: 0; display: flex; flex-direction: column; justify-content: flex-end; overflow: visible; }
      #app .game-table .shelf-items { position: relative; width: 100%; height: var(--shelf-content-height); min-height: var(--shelf-content-height); box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: var(--book-stack-gap); padding: 0 11px 15px; overflow: visible; }
      #app .game-table .shelf-items > .book-item { position: relative; left: auto; top: auto; width: var(--book-width); height: var(--book-height); min-width: var(--book-width); min-height: var(--book-height); max-width: var(--book-width); max-height: var(--book-height); flex: 0 0 var(--book-height); margin: 0; transform: translateY(calc(-1 * var(--book-lift))); transform-origin: center bottom; }
      #app .game-table .shelf-items > .book-item:nth-last-child(1) { z-index: 4; }
      #app .game-table .shelf-items > .book-item:nth-last-child(2) { z-index: 3; }
      #app .game-table .shelf-items > .book-item:nth-last-child(3) { z-index: 2; }
      #app .game-table .shelf-items > .book-item:nth-last-child(4) { z-index: 1; }
      #app .game-table .shelf-items > .book-item .book-art { display: block; width: var(--book-width); height: var(--book-height); max-width: var(--book-width); max-height: var(--book-height); }
      #app .game-table .book-item.top-book { cursor: grab; }
      #app .game-table .book-item:not(.top-book) { cursor: default; }
      #app .game-table .book-item.is-dragging { cursor: grabbing; }
      #app .game-table .hud-bar { z-index: 70; }
      #app .game-table .rule-banner { z-index: 60; }
      #app .game-table .score-popup { z-index: 80; }

      @media (max-width: 850px) {
        #app .game-table { width: calc(100vw - 24px); height: min(var(--game-height), calc(100vh - 24px)); }
        #app .game-table .containers-zone { left: 14px; right: 14px; gap: 8px; }
      }

      @media (max-width: 700px) {
        :root { --shelf-height: 380px; --shelf-content-height: 355px; --shelf-gap: 4px; --book-width: ${book.width}px; --book-height: ${book.height}px; --book-stack-gap: -49px; }
        #app .game-table .containers-zone { left: 10px; right: 10px; gap: var(--shelf-gap); }
        #app .game-table .shelf-container { height: var(--shelf-height); min-height: var(--shelf-height); }
        #app .game-table .shelf-items { padding: 0 7px 14px; }
      }
    `;
  }

  /** Remove injected layout styles and reset runtime grid variables. */
  destroy() { this.style?.remove(); this.style = null; this.document.documentElement.style.removeProperty('--shelf-columns'); this.document.documentElement.style.removeProperty('--shelf-rows'); }
}
