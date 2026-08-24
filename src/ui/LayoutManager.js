import { BOOK_SIZES } from '../themes/library/BookAssets.js';

const STYLE_ID = 'library-layout-manager';

/** The single owner of puzzle geometry. */
export class LayoutManager {
  constructor({ documentRef = document } = {}) {
    this.document = documentRef;
    this.window = documentRef.defaultView ?? globalThis.window;
    this.style = null;
    this.resizeObserver = null;
    this.resizeHandler = null;
    this.orientationHandler = null;
    this.lastLayout = null;
    this.shelfCount = 1;
  }

  /** Inject layout CSS, install responsive listeners and return an idempotent cleanup function. */
  install() {
    const existing = this.document.getElementById(STYLE_ID);
    if (existing) {
      this.style = existing;
    } else {
      const style = this.document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = this.buildCSS();
      this.document.head.append(style);
      this.style = style;
    }

    this.updateLayout();

    this.resizeHandler = () => this.updateLayout();
    this.orientationHandler = () => this.scheduleLayoutUpdate();

    this.window?.addEventListener?.('resize', this.resizeHandler, { passive: true });
    this.window?.addEventListener?.('orientationchange', this.orientationHandler, { passive: true });

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateLayout());
      const target = this.document.documentElement;
      this.resizeObserver.observe(target);
    }

    return () => this.destroy();
  }

  /**
   * Calculate geometry from the actual viewport.
   * Fixed pixels remain the desktop design reference; mobile gets a proportional layout.
   */
  calculateLayout(windowWidth, windowHeight, shelfCount = this.shelfCount) {
    const safeWidth = Math.max(1, Number(windowWidth) || 1);
    const safeHeight = Math.max(1, Number(windowHeight) || 1);
    const safeCount = Math.max(1, Number(shelfCount) || 1);
    const isMobile = safeWidth < 768;
    const isLandscape = safeWidth > safeHeight;
    const isSmallMobile = safeWidth < 480;

    let columns;
    if (isMobile && isLandscape) {
      columns = Math.min(5, safeCount);
    } else if (isSmallMobile) {
      columns = Math.min(2, safeCount);
    } else if (isMobile) {
      columns = Math.min(3, safeCount);
    } else {
      columns = Math.min(5, safeCount);
    }

    // Keep the original 830x640 desktop scene. On smaller screens the scene itself
    // gets smaller instead of relying on CSS transform: scale(), so client coordinates
    // used by DragController stay in the same coordinate space as getBoundingClientRect().
    const horizontalMargin = isMobile ? 12 : 24;
    const verticalMargin = isLandscape && isMobile ? 12 : 24;
    const gameWidth = Math.min(830, Math.max(1, safeWidth - horizontalMargin * 2));
    const gameHeight = Math.min(640, Math.max(1, safeHeight - verticalMargin * 2));

    const scaleFactor = Math.min(gameWidth / 830, gameHeight / 640);
    const bookWidth = Math.max(isMobile ? 34 : 52, Math.round(72 * scaleFactor));
    const bookHeight = Math.max(isMobile ? 50 : 75, Math.round(104 * scaleFactor));

    const rows = Math.max(1, Math.ceil(safeCount / columns));
    const gap = isLandscape && isMobile ? 6 : isMobile ? 8 : 14;
    const usableHeight = Math.max(1, gameHeight - (isMobile ? 24 : 40));
    const shelfHeight = Math.max(
      bookHeight + (isMobile ? 34 : 80),
      Math.min(isMobile ? (isLandscape ? 330 : 210) : 460, (usableHeight - gap * Math.max(0, rows - 1)) / rows),
    );
    const shelfContentHeight = Math.max(1, shelfHeight - (isMobile ? 18 : 25));
    const stackGap = Math.round(-62 * scaleFactor);

    return {
      columns,
      rows,
      gameWidth,
      gameHeight,
      bookWidth,
      bookHeight,
      shelfHeight: Math.round(shelfHeight),
      shelfContentHeight: Math.round(shelfContentHeight),
      shelfGap: gap,
      bookStackGap: Math.min(-18, stackGap),
      bookLift: Math.max(4, Math.round(10 * scaleFactor)),
      scaleFactor,
      isMobile,
      isLandscape,
    };
  }

  /** Keep the current level's shelves responsive instead of forcing one row. */
  updateShelfCount(count) {
    this.shelfCount = Math.max(1, Number(count) || 1);
    this.updateLayout();
  }

  /** Apply calculated geometry as CSS custom properties. */
  updateLayout() {
    if (!this.document?.documentElement) return;

    const view = this.window;
    const width = view?.innerWidth ?? this.document.documentElement.clientWidth;
    const height = view?.innerHeight ?? this.document.documentElement.clientHeight;
    const layout = this.calculateLayout(width, height, this.shelfCount);
    const root = this.document.documentElement;

    const values = {
      '--game-width': `${layout.gameWidth}px`,
      '--game-height': `${layout.gameHeight}px`,
      '--shelf-height': `${layout.shelfHeight}px`,
      '--shelf-gap': `${layout.shelfGap}px`,
      '--shelf-columns': String(layout.columns),
      '--shelf-rows': String(layout.rows),
      '--book-width': `${layout.bookWidth}px`,
      '--book-height': `${layout.bookHeight}px`,
      '--shelf-content-height': `${layout.shelfContentHeight}px`,
      '--book-stack-gap': `${layout.bookStackGap}px`,
      '--book-lift': `${layout.bookLift}px`,
    };

    for (const [property, value] of Object.entries(values)) root.style.setProperty(property, value);
    this.lastLayout = layout;
  }

  scheduleLayoutUpdate() {
    const raf = this.window?.requestAnimationFrame;
    if (typeof raf === 'function') {
      raf(() => this.updateLayout());
      return;
    }
    setTimeout(() => this.updateLayout(), 100);
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

      #app {
        position: relative;
        width: 100vw;
        height: 100dvh;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        box-sizing: border-box;
        padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
      }

      @supports not (height: 100dvh) {
        #app { height: 100vh; }
      }

      #app .game-table {
        position: absolute;
        left: 50%;
        top: 50%;
        width: var(--game-width);
        height: var(--game-height);
        max-width: calc(100vw - 24px - env(safe-area-inset-left) - env(safe-area-inset-right));
        max-height: calc(100dvh - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
        transform: translate(-50%, -50%);
        transform-origin: center center;
        overflow: hidden;
      }

      #app .game-table .containers-zone {
        position: absolute;
        left: var(--game-padding);
        right: var(--game-padding);
        top: 50%;
        width: auto;
        height: auto;
        min-height: var(--shelf-height);
        margin: 0;
        padding: 0;
        transform: translateY(-50%);
        display: grid;
        grid-template-columns: repeat(var(--shelf-columns), minmax(0, 1fr));
        grid-template-rows: repeat(var(--shelf-rows), var(--shelf-height));
        grid-auto-rows: var(--shelf-height);
        gap: var(--shelf-gap);
        align-items: stretch;
        overflow: visible;
        z-index: 20;
      }

      #app .game-table .shelf-container {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: var(--shelf-height);
        min-width: 0;
        min-height: var(--shelf-height);
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        overflow: visible;
      }

      #app .game-table .shelf-items {
        position: relative;
        width: 100%;
        height: var(--shelf-content-height);
        min-height: var(--shelf-content-height);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        gap: var(--book-stack-gap);
        padding: 0 11px 15px;
        overflow: visible;
      }

      #app .game-table .shelf-items > .book-item {
        position: relative;
        left: auto;
        top: auto;
        width: var(--book-width);
        height: var(--book-height);
        min-width: var(--book-width);
        min-height: var(--book-height);
        max-width: var(--book-width);
        max-height: var(--book-height);
        flex: 0 0 var(--book-height);
        margin: 0;
        transform: translateY(calc(-1 * var(--book-lift)));
        transform-origin: center bottom;
      }

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

      @media (max-width: 767px) {
        #app .game-table .containers-zone { left: 10px; right: 10px; }
        #app .game-table .shelf-items { padding-left: 6px; padding-right: 6px; padding-bottom: 10px; }
      }

      @media (orientation: landscape) and (max-width: 767px) {
        #app .game-table .containers-zone { gap: var(--shelf-gap); }
        #app .game-table .shelf-items { padding-left: 4px; padding-right: 4px; }
      }

      @media (orientation: portrait) and (max-width: 767px) {
        #app .game-table .containers-zone { grid-template-columns: repeat(var(--shelf-columns), minmax(0, 1fr)); }
      }

      @media (max-height: 500px) {
        #app .game-table { max-height: calc(100dvh - 16px - env(safe-area-inset-top) - env(safe-area-inset-bottom)); }
      }
    `;
  }

  /** Remove injected layout styles, listeners and runtime variables. */
  destroy() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.resizeHandler) this.window?.removeEventListener?.('resize', this.resizeHandler);
    if (this.orientationHandler) this.window?.removeEventListener?.('orientationchange', this.orientationHandler);
    this.resizeHandler = null;
    this.orientationHandler = null;
    this.style?.remove();
    this.style = null;

    const properties = [
      '--shelf-columns', '--shelf-rows', '--game-width', '--game-height',
      '--shelf-height', '--shelf-gap', '--book-width', '--book-height',
      '--shelf-content-height', '--book-stack-gap', '--book-lift',
    ];
    for (const property of properties) this.document.documentElement.style.removeProperty(property);
  }
}
