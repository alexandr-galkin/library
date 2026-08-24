const STYLE_ID = 'library-sort-puzzle-visuals-v4';

export function installSortPuzzleVisuals(documentRef = document) {
  if (documentRef.getElementById(STYLE_ID)) return;
  const style = documentRef.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* ONE coordinate system: shelves live inside the game field. */
    .game-table {
      position: relative !important;
      width: 830px !important;
      height: 640px !important;
      max-width: calc(100vw - 24px) !important;
      max-height: calc(100vh - 24px) !important;
      overflow: hidden !important;
    }

    .game-table > .containers-zone,
    .game-table .containers-zone {
      position: absolute !important;
      left: 20px !important;
      right: 20px !important;
      top: 18px !important;
      bottom: 18px !important;
      width: auto !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      transform: none !important;
      display: grid !important;
      grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
      grid-template-rows: 270px 270px !important;
      grid-auto-rows: 270px !important;
      gap: 18px !important;
      align-content: start !important;
      align-items: stretch !important;
      justify-content: stretch !important;
      overflow: visible !important;
      z-index: 20 !important;
    }

    .shelf-container,
    .shelf-container.empty-shelf {
      position: relative !important;
      box-sizing: border-box !important;
      width: 100% !important;
      height: 270px !important;
      min-width: 0 !important;
      min-height: 270px !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-end !important;
      overflow: visible !important;
      background: linear-gradient(180deg, #603b23, #392014) !important;
      border: 1px solid rgba(193,157,100,.5) !important;
      border-radius: 5px !important;
      box-shadow: inset 0 2px rgba(255,225,176,.1), inset 0 -25px 30px rgba(0,0,0,.3), 0 14px 30px rgba(0,0,0,.45) !important;
    }

    .shelf-container::before {
      content: '' !important;
      position: absolute !important;
      left: -3px !important;
      right: -3px !important;
      top: -3px !important;
      height: 12px !important;
      background: #805333 !important;
      border-radius: 2px 2px 0 0 !important;
      box-shadow: 0 3px 6px rgba(0,0,0,.5) !important;
    }
    .shelf-container::after {
      content: '' !important;
      position: absolute !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 2px !important;
      height: 15px !important;
      background: linear-gradient(#805333,#321c11) !important;
      box-shadow: 0 3px 6px #100805 !important;
    }

    .shelf-header {
      position: absolute !important;
      top: 9px !important;
      left: 14px !important;
      right: 14px !important;
      z-index: 3 !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 0 !important;
      background: transparent !important;
      border: 0 !important;
    }
    .shelf-label { font-family: Georgia,serif !important; color:#e6d2ad !important; font-size:.76rem !important; letter-spacing:1.4px !important; }
    .shelf-count { color:#c3aa7c !important; font-size:.76rem !important; }

    .shelf-items {
      position: relative !important;
      z-index: 2 !important;
      width: 100% !important;
      min-height: 215px !important;
      height: 215px !important;
      box-sizing: border-box !important;
      padding: 12px 11px 20px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-end !important;
      align-items: center !important;
      gap: 10px !important;
      overflow: visible !important;
    }

    /* Do NOT shrink the books. Their visual size is controlled by the game. */
    .shelf-items .book-item {
      position: relative !important;
      left: auto !important;
      top: auto !important;
      flex: 0 0 auto !important;
      width: auto !important;
      height: auto !important;
      min-width: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      transform-origin: center bottom !important;
      z-index: 3 !important;
      filter: drop-shadow(4px 9px 6px rgba(0,0,0,.58)) !important;
    }
    .shelf-items .book-item svg,
    .shelf-items .book-item .book-art,
    .shelf-items .book-item img {
      width: auto !important;
      height: auto !important;
      max-width: none !important;
      max-height: none !important;
    }
    .shelf-items .book-item:hover { z-index: 20 !important; }
    .shelf-items .book-item.dragging { z-index: 100 !important; }

    .rule-banner { z-index: 60 !important; }
    .hud-bar { z-index: 70 !important; }
    .menu-button { z-index: 71 !important; }
    .objects-zone { display: none !important; }
    .combo-display { display: none !important; }
    .score-popup { z-index: 80 !important; }

    @media (max-width: 850px) {
      .game-table {
        width: calc(100vw - 24px) !important;
        height: min(640px, calc(100vh - 24px)) !important;
      }
      .game-table > .containers-zone,
      .game-table .containers-zone {
        left: 16px !important;
        right: 16px !important;
      }
    }

    @media (max-width: 700px) {
      .game-table > .containers-zone,
      .game-table .containers-zone {
        left: 12px !important;
        right: 12px !important;
        top: 12px !important;
        bottom: 12px !important;
        grid-template-columns: repeat(2,minmax(0,1fr)) !important;
        grid-template-rows: none !important;
        grid-auto-rows: 190px !important;
        gap: 8px !important;
        overflow: auto !important;
      }
      .shelf-container,
      .shelf-container.empty-shelf {
        height: 190px !important;
        min-height: 190px !important;
      }
      .shelf-items { height:145px !important; min-height:145px !important; padding:7px !important; gap:4px !important; }
      .shelf-label,.shelf-count { font-size:.55rem !important; }
    }
  `;
  documentRef.head.append(style);
}
