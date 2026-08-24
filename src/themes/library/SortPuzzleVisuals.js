const STYLE_ID = 'library-sort-puzzle-visuals';

export function installSortPuzzleVisuals(documentRef = document) {
  if (documentRef.getElementById(STYLE_ID)) return;
  const style = documentRef.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .containers-zone {
      position: absolute;
      z-index: 12;
      left: 50%;
      top: 52%;
      transform: translate(-50%, -50%);
      width: min(1180px, 92vw);
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 1fr));
      gap: 28px 24px;
      align-items:end;
      padding: 26px;
    }
    .shelf-container {
      position: relative;
      min-height: 210px;
      padding: 12px 12px 16px;
      display:flex;
      flex-direction:column;
      justify-content:flex-end;
      background:linear-gradient(180deg,#50331f 0%,#382116 52%,#24140d 100%)!important;
      border:1px solid rgba(192,150,78,.3)!important;
      border-radius:3px!important;
      box-shadow:inset 0 3px rgba(255,235,188,.07),inset 0 -16px 25px rgba(0,0,0,.35),0 12px 25px rgba(0,0,0,.38)!important;
      transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;
    }
    .shelf-container::before {
      content:''; position:absolute; left:-3px; right:-3px; bottom:7px; height:8px;
      background:linear-gradient(180deg,#79502d,#3a2114); border:1px solid rgba(0,0,0,.35); border-radius:2px;
    }
    .shelf-container::after {
      content:''; position:absolute; left:10px; right:10px; bottom:2px; height:3px;
      background:rgba(211,174,102,.12);
    }
    .shelf-container.highlight { transform:translateY(-5px); border-color:#a6aa6c!important; box-shadow:0 0 0 2px rgba(166,170,108,.14),0 18px 35px rgba(0,0,0,.45)!important; }
    .shelf-container.reject { border-color:#a55c50!important; box-shadow:0 0 0 2px rgba(165,92,80,.12),0 14px 30px rgba(0,0,0,.42)!important; }
    .shelf-container.empty-shelf { min-height:210px; background:linear-gradient(180deg,#382519,#25160f)!important; }
    .shelf-header { position:absolute; top:10px; left:13px; right:13px; display:flex; justify-content:space-between; align-items:center; z-index:3; }
    .shelf-label { font-family:Georgia,serif!important; color:#d5bd8d!important; font-size:.66rem!important; letter-spacing:1.7px; text-transform:uppercase; }
    .shelf-count { font-family:Georgia,serif; color:#8f7855; font-size:.65rem; letter-spacing:1px; }
    .shelf-items {
      position:relative; z-index:2; min-height:158px; height:158px; padding:6px 8px 7px;
      display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:2px;
    }
    .shelf-items .book-item { position:relative!important; left:auto!important; top:auto!important; z-index:auto!important; flex:0 0 auto; width:72px; height:35px; margin-top:-3px; transform-origin:bottom center; }
    .shelf-items .book-item svg { width:100%!important; height:100%!important; display:block; filter:drop-shadow(2px 3px 2px rgba(0,0,0,.55)); }
    .shelf-items .book-item:not(:last-child) { opacity:.96; }
    .shelf-items .book-item:last-child { cursor:grab; }
    .shelf-items .book-item:last-child:hover { transform:translateY(-7px) rotate(-1deg); }
    .shelf-items .book-item.dragging { width:110px!important; height:54px!important; cursor:grabbing; transform:rotate(-2deg) scale(1.05)!important; }
    .shelf-container.empty-shelf .shelf-items::after { content:'ПЕРЕНЕСИ КНИГУ СЮДА'; color:rgba(202,178,132,.26); font:italic .72rem Georgia,serif; letter-spacing:1px; text-align:center; }
    .rule-banner { z-index:20!important; top:15%!important; }
    .hud-bar { z-index:30!important; }
    .menu-button { z-index:31!important; }
    .objects-zone { display:none!important; }
    .combo-display { z-index:40!important; }
    .score-popup { z-index:50!important; }
    @media(max-width:1050px) {
      .containers-zone { grid-template-columns:repeat(3,minmax(170px,1fr)); gap:18px; top:54%; }
      .shelf-container,.shelf-container.empty-shelf { min-height:180px; }
      .shelf-items { min-height:130px; height:130px; }
    }
    @media(max-width:720px) {
      .containers-zone { width:96vw; grid-template-columns:repeat(2,minmax(130px,1fr)); gap:12px; padding:8px; top:55%; }
      .shelf-container,.shelf-container.empty-shelf { min-height:145px; padding:9px 6px 12px; }
      .shelf-items { min-height:105px; height:105px; }
      .shelf-items .book-item { width:58px; height:29px; }
      .shelf-label { font-size:.55rem!important; }
      .shelf-count { font-size:.55rem; }
      .rule-banner { top:13%!important; }
    }
  `;
  documentRef.head.append(style);
}
