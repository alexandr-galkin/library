import { createBookSVG, BOOK_COLORS, BOOK_SIZES, BOOK_GENRES, BOOK_SYMBOLS, BOOK_THICKNESS } from './library/BookAssets.js';

const STYLE_ID = 'library-puzzle-theme';

/** Visual-only library theme. It deliberately contains no puzzle geometry. */
export class PuzzleTheme {
  constructor({ documentRef = document } = {}) {
    this.document = documentRef;
    this.name = 'library';
    this.displayName = 'Библиотека';
    this.description = 'Разложи книги по полкам';
    this.style = null;
  }

  /** Install theme colors/effects and return cleanup. */
  install() {
    const existing = this.document.getElementById(STYLE_ID);
    if (existing) {
      this.style = existing;
      return () => {};
    }
    const style = this.document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = this.buildCSS();
    this.document.head.append(style);
    this.style = style;
    return () => this.destroy();
  }

  /** Build visual styles without defining puzzle layout. */
  buildCSS() {
    return `
      :root {
        --paper: #f1e6cf;
        --ink: #2b2118;
        --wood: #4b2b19;
        --gold: #b7965c;
        --book-shadow: rgba(0,0,0,.58);
      }

      body { background: #15100c; color: var(--paper); font-family: Georgia, 'Times New Roman', serif; }
      .library-bg { position: fixed; inset: 0; z-index: 0; background: #21150e; overflow: hidden; }
      .library-bg::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 38% 28% at 50% 11%, rgba(255,224,163,.3), transparent 72%), linear-gradient(90deg,#1b1009 0 10%,#3d2415 10.5% 23%,#20130b 23.5% 76.5%,#3d2415 77% 90%,#1b1009 90.5%), linear-gradient(180deg,#3a2517 0 62%,#25170f 62% 100%); box-shadow: inset 0 0 130px rgba(0,0,0,.72); }
      .library-bg::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(180deg,transparent 0 6%,rgba(17,9,5,.9) 6.2% 7.1%,transparent 7.3% 13%), repeating-linear-gradient(90deg,rgba(93,57,31,.3) 0 2px,transparent 2px 150px), linear-gradient(180deg,transparent 0 65%,#1c1009 65% 100%); opacity: .9; pointer-events: none; }
      .library-architecture { position: absolute; inset: 0; pointer-events: none; }
      .back-wall { position: absolute; inset: 4% 7% 14%; background: #4b2d19; border: 10px solid #25140b; box-shadow: inset 0 0 80px #160a05, 0 12px 40px #000; }
      .back-wall::before { content: ''; position: absolute; inset: 2%; border: 2px solid rgba(210,169,103,.18); }
      .bookcase { position: absolute; top: 9%; bottom: 14%; width: 24%; background: linear-gradient(90deg,#28140a,#5a351b 12%,#6e4525 50%,#351b0d 90%); border: 8px solid #241209; box-shadow: inset 0 0 20px #160904, 0 18px 35px #000; }
      .bookcase.left { left: 1.5%; } .bookcase.right { right: 1.5%; }
      .case-top { position: absolute; left: -5%; right: -5%; top: -9px; height: 16px; background: linear-gradient(#8b5b31,#4a2814); box-shadow: 0 5px 10px #000; }
      .case-books { position: absolute; left: 7%; right: 7%; display: flex; align-items: flex-end; gap: 3px; height: 15%; overflow: hidden; padding: 0 4px; }
      .case-books.one { top: 9%; } .case-books.two { top: 28%; } .case-books.three { top: 47%; } .case-books.four { top: 66%; } .case-books.five { top: 85%; }
      .case-books span { width: 11%; height: 76%; border-radius: 2px 2px 0 0; box-shadow: 1px 0 3px #160a05, inset 1px 0 rgba(255,255,255,.16); }
      .case-shelf { position: absolute; left: 3%; right: 3%; height: 2px; background: #9a6738; box-shadow: 0 4px 10px #130803; }
      .case-shelf.s1 { top: 23%; } .case-shelf.s2 { top: 42%; } .case-shelf.s3 { top: 61%; } .case-shelf.s4 { top: 80%; }
      .arch-window { position: absolute; left: 50%; top: 11%; transform: translateX(-50%); width: 24%; height: 35%; background: #111b2b; border: 12px solid #4c2c17; box-shadow: 0 0 0 4px #241309, 0 20px 40px #000, inset 0 0 50px #080d16; }
      .arch-window::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 8px; transform: translateX(-50%); background: #5a381d; }
      .arch-window::after { content: ''; position: absolute; left: 0; right: 0; top: 52%; height: 7px; background: #5a381d; }
      .moon { position: absolute; width: 48px; height: 48px; border-radius: 50%; right: 18%; top: 17%; background: #ead9a8; box-shadow: 0 0 35px rgba(234,217,168,.55); }
      .ceiling-lamp { position: absolute; top: 0; left: 50%; width: 190px; height: 110px; transform: translateX(-50%); z-index: 2; }
      .ceiling-lamp::before { content: ''; position: absolute; left: 50%; top: 0; width: 3px; height: 42px; background: #17100b; }
      .ceiling-lamp::after { content: ''; position: absolute; left: 50%; top: 34px; transform: translateX(-50%); width: 115px; height: 52px; border-radius: 8px 8px 55px 55px; background: linear-gradient(#d4a65a,#805329); box-shadow: 0 15px 45px rgba(255,190,91,.28); }
      .desk { position: absolute; left: 50%; bottom: 8%; transform: translateX(-50%); width: 58%; height: 10%; border-radius: 5px; background: linear-gradient(#7c4a27,#4a2815); box-shadow: 0 15px 35px #000, inset 0 3px rgba(255,224,172,.14); z-index: 3; }
      .desk::after { content: ''; position: absolute; left: 4%; right: 4%; top: 10px; bottom: 12px; border: 1px solid rgba(235,193,121,.18); border-radius: 3px; }
      .library-floor { position: absolute; bottom: 0; left: 0; right: 0; height: 16%; background: repeating-linear-gradient(90deg,#4a2916 0 90px,#59341c 92px 180px); box-shadow: 0 -18px 40px #000; z-index: 1; }

      .hud-bar { background: rgba(25,15,9,.92); border-bottom: 1px solid rgba(183,150,92,.28); box-shadow: 0 5px 22px rgba(0,0,0,.4); }
      .hud-item { font-family: Georgia, serif; font-size: .75rem; letter-spacing: 1.5px; color: #ad9878; text-transform: uppercase; }
      .hud-item span { color: #f0ddbb; }
      .menu-button { background: #342014; border: 1px solid rgba(183,150,92,.35); border-radius: 5px; color: #e3cfaa; }
      .rule-banner { top: 42px; background: #eee2c9; color: var(--ink); border: 1px solid #bba277; border-radius: 2px; box-shadow: 0 12px 30px rgba(0,0,0,.45); padding: 10px 25px; }
      .rule-banner::before { content: 'LIBRARY • SORTING RULE'; display: block; font: 600 .55rem Georgia, serif; letter-spacing: 3px; color: #8a7048; margin-bottom: 3px; }
      .score-popup { color: #f0d49b; text-shadow: 0 3px 10px #000; font-family: Georgia, serif; pointer-events: none; }

      .shelf-container { background: linear-gradient(180deg,#603b23,#392014); border: 1px solid rgba(193,157,100,.5); border-radius: 5px; box-shadow: inset 0 2px rgba(255,225,176,.1), inset 0 -25px 30px rgba(0,0,0,.3), 0 14px 30px rgba(0,0,0,.45); }
      .shelf-container::before { content: ''; position: absolute; left: -3px; right: -3px; top: -3px; height: 12px; background: #805333; border-radius: 2px 2px 0 0; box-shadow: 0 3px 6px rgba(0,0,0,.5); }
      .shelf-container::after { content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 15px; background: linear-gradient(#805333,#321c11); box-shadow: 0 3px 6px #100805; }
      .shelf-header { position: absolute; top: 9px; left: 14px; right: 14px; z-index: 3; display: flex; justify-content: space-between; align-items: center; padding: 0; background: transparent; border: 0; }
      .shelf-label { font-family: Georgia, serif; color: #e6d2ad; font-size: .76rem; letter-spacing: 1.4px; }
      .shelf-count { color: #c3aa7c; font-size: .76rem; letter-spacing: 1px; }
      .book-item { user-select: none; touch-action: none; cursor: grab; transition: transform .16s ease, filter .16s ease; filter: drop-shadow(4px 9px 6px var(--book-shadow)); }
      .book-item:hover { transform: translateY(-5px) rotate(-1deg); filter: drop-shadow(4px 10px 7px rgba(0,0,0,.65)); }
      .book-item.is-dragging { transform: translateY(-24px) rotate(-3deg) scale(1.04); filter: drop-shadow(8px 22px 14px rgba(0,0,0,.75)); z-index: 100; }
      .book-item.correct { animation: bookCorrect .35s forwards; }
      .book-item.shake { animation: bookShake .4s; }
      @keyframes bookCorrect { 0% { transform: scale(1); } 50% { transform: scale(1.12); } 100% { transform: scale(0); opacity: 0; } }
      @keyframes bookShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-7px); } 40% { transform: translateX(7px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }
      .shelf-container.highlight { border-color: #aab67b; box-shadow: 0 0 0 2px rgba(170,182,123,.2), 0 12px 25px #000; }
      .shelf-container.reject { border-color: #b26a5d; box-shadow: 0 0 0 2px rgba(178,106,93,.16), 0 12px 25px #000; }
      .modal-overlay { background: rgba(7,4,2,.8); backdrop-filter: blur(5px); }
      .modal-card { background: #eee0c3; color: #2b2118; border: 1px solid #b89b67; border-radius: 3px; box-shadow: 0 30px 90px #000; font-family: Georgia, serif; }
      .menu-btn, .level-complete-card button { border-radius: 3px; font-family: Georgia, serif; }
      .menu-btn-primary, .level-complete-card button { background: #694528; color: #f3e5c8; }
    `;
  }

  /** Render the library background into a supplied container. */
  renderBackground(container) {
    const colors = ['#7b302e','#355879','#3f6246','#a67b32','#67455f','#68442b','#35312b','#c4b79a'];
    const books = count => Array.from({ length: count }, (_, index) => `<span style="height:${62 + (index % 4) * 7}%;background:${colors[index % colors.length]}"></span>`).join('');
    container.innerHTML = `<div class="library-architecture"><div class="back-wall"></div><div class="bookcase left"><div class="case-top"></div><div class="case-books one">${books(14)}</div><div class="case-books two">${books(16)}</div><div class="case-books three">${books(13)}</div><div class="case-books four">${books(15)}</div><div class="case-books five">${books(12)}</div><div class="case-shelf s1"></div><div class="case-shelf s2"></div><div class="case-shelf s3"></div><div class="case-shelf s4"></div></div><div class="bookcase right"><div class="case-top"></div><div class="case-books one">${books(13)}</div><div class="case-books two">${books(15)}</div><div class="case-books three">${books(14)}</div><div class="case-books four">${books(16)}</div><div class="case-books five">${books(13)}</div><div class="case-shelf s1"></div><div class="case-shelf s2"></div><div class="case-shelf s3"></div><div class="case-shelf s4"></div></div><div class="arch-window"><div class="moon"></div></div><div class="ceiling-lamp"></div><div class="desk"></div></div><div class="library-floor"></div>`;
  }

  /** Render a book using the existing SVG asset system. */
  renderBook(book) {
    const element = this.document.createElement('div');
    element.className = 'book-item';
    element.dataset.uid = book.uid;
    element.innerHTML = createBookSVG(book);
    element.setAttribute('aria-label', `Книга ${book.color} ${book.size}`);
    return element;
  }

  /** Return user-facing book labels. */
  getBookLabels() {
    return {
      color: Object.fromEntries(Object.entries(BOOK_COLORS).map(([key, value]) => [key, value.name])),
      size: Object.fromEntries(Object.entries(BOOK_SIZES).map(([key, value]) => [key, value.name])),
      genre: Object.fromEntries(Object.entries(BOOK_GENRES).map(([key, value]) => [key, value.name])),
      symbol: Object.fromEntries(Object.entries(BOOK_SYMBOLS).map(([key, value]) => [key, value.name])),
      thickness: Object.fromEntries(Object.entries(BOOK_THICKNESS).map(([key, value]) => [key, value.name])),
    };
  }

  /** Remove theme styles. */
  destroy() {
    this.style?.remove();
    this.style = null;
  }
}
