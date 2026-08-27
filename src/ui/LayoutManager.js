/** The single owner of puzzle geometry. */
export class LayoutManager {
  constructor({ documentRef = document } = {}) {
    this.document = documentRef;
    this.window = documentRef.defaultView ?? globalThis.window;
    this.resizeObserver = null;
    this.resizeHandler = null;
    this.orientationHandler = null;
    this.lastLayout = null;
    this.shelfCount = 1;
  }

  install() {
    this.updateLayout();
    this.resizeHandler = () => this.updateLayout();
    this.orientationHandler = () => this.scheduleLayoutUpdate();
    this.window?.addEventListener?.('resize', this.resizeHandler, { passive: true });
    this.window?.addEventListener?.('orientationchange', this.orientationHandler, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateLayout());
      this.resizeObserver.observe(this.document.documentElement);
    }
    return () => this.destroy();
  }

   calculateLayout(windowWidth, windowHeight, shelfCount = this.shelfCount) {
    const width = Math.max(1, Number(windowWidth) || 1);
    const height = Math.max(1, Number(windowHeight) || 1);
    const count = Math.max(1, Number(shelfCount) || 1);
    const isMobile = width < 768;
    const isLandscape = width > height;
    const isSmallMobile = width < 480;
    let columns;
    if (!isMobile) columns = count;
    else if (isLandscape) columns = Math.min(5, count);
    else if (isSmallMobile) columns = Math.min(count > 6 ? 3 : 2, count);
    else columns = Math.min(3, count);
    const rows = Math.max(1, Math.ceil(count / columns));
    const horizontalMargin = isMobile ? 12 : 24;
    const verticalMargin = isLandscape && isMobile ? 12 : 24;
    const baseGameHeight = Math.min(640, Math.max(1, height - verticalMargin * 2));
    const gameHeight = baseGameHeight;
    const gameWidth = Math.min(830, Math.max(1, width - horizontalMargin * 2), isMobile ? 830 : baseGameHeight * 2);
    const scaleFactor = Math.min(gameWidth / 830, gameHeight / 640);
    const gap = isLandscape && isMobile ? 6 : isMobile ? 8 : 14;
    const usableHeight = Math.max(1, gameHeight - (isMobile ? 24 : 40));
    const availableShelfHeight = Math.max(1, (usableHeight - gap * Math.max(0, rows - 1)) / rows);
    const maxShelfHeight = isMobile ? (isLandscape ? 330 : 210) : 460;
    const shelfHeight = Math.min(maxShelfHeight, availableShelfHeight);
    const shelfContentHeight = Math.max(1, shelfHeight - (isMobile ? 18 : 25));
    const stackOverlapRatio = isMobile ? 0.4 : 0.28;
    const stackFactor = 4 - stackOverlapRatio * 3;
    const maxBookHeightForShelf = Math.max(1, Math.floor(shelfContentHeight / stackFactor));
    const baseBookHeight = Math.max(
      isMobile ? 50 : 75,
      Math.round(104 * scaleFactor),
    );
    const bookHeight = Math.min(baseBookHeight, maxBookHeightForShelf);
    const baseBookWidth = Math.max(
      isMobile ? 34 : 52,
      Math.round(72 * scaleFactor),
    );
    const bookWidth = Math.min(baseBookWidth, Math.max(1, Math.round(bookHeight * (72 / 104))));
    const roundedStackOffset = Math.round(bookHeight * stackOverlapRatio);
    const bookStackOffset = bookHeight * 4 - roundedStackOffset * 3 <= shelfContentHeight
      ? roundedStackOffset
      : Math.ceil(bookHeight * stackOverlapRatio);
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
      bookStackOffset,
      bookLift: Math.max(4, Math.round(10 * scaleFactor)),
      scaleFactor,
      isMobile,
      isLandscape,
    };
  }

  updateShelfCount(count) {
    this.shelfCount = Math.max(1, Number(count) || 1);
    this.updateLayout();
  }

  updateLayout() {
    if (!this.document?.documentElement) return;
    const width = this.window?.innerWidth ?? this.document.documentElement.clientWidth;
    const height = this.window?.innerHeight ?? this.document.documentElement.clientHeight;
    const layout = this.calculateLayout(width, height, this.shelfCount);
    const root = this.document.documentElement;
    const values = {
      '--game-width': `${layout.gameWidth}px`, '--game-height': `${layout.gameHeight}px`,
      '--game-side-offset': `${Math.round(layout.gameWidth / 2)}px`,
      '--shelf-height': `${layout.shelfHeight}px`, '--shelf-gap': `${layout.shelfGap}px`,
      '--shelf-columns': String(layout.columns), '--shelf-rows': String(layout.rows),
      '--book-width': `${layout.bookWidth}px`, '--book-height': `${layout.bookHeight}px`,
      '--shelf-content-height': `${layout.shelfContentHeight}px`,
      '--book-stack-offset': `${layout.bookStackOffset}px`, '--book-lift': `${layout.bookLift}px`,
    };
    for (const [property, value] of Object.entries(values)) root.style.setProperty(property, value);
    this.lastLayout = layout;
  }

  scheduleLayoutUpdate() {
    const raf = this.window?.requestAnimationFrame;
    if (typeof raf === 'function') raf(() => this.updateLayout());
    else setTimeout(() => this.updateLayout(), 100);
  }

  destroy() {
    this.resizeObserver?.disconnect(); this.resizeObserver = null;
    if (this.resizeHandler) this.window?.removeEventListener?.('resize', this.resizeHandler);
    if (this.orientationHandler) this.window?.removeEventListener?.('orientationchange', this.orientationHandler);
    this.resizeHandler = null; this.orientationHandler = null;
    for (const property of ['--shelf-columns','--shelf-rows','--game-width','--game-height','--game-side-offset','--shelf-height','--shelf-gap','--book-width','--book-height','--shelf-content-height','--book-stack-offset','--book-lift']) this.document.documentElement.style.removeProperty(property);
  }
}
