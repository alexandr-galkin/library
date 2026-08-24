const STYLE_ID = 'library-visual-enhancements';

export function installLibraryVisuals(documentRef = document) {
  if (documentRef.getElementById(STYLE_ID)) return;

  const style = documentRef.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    :root { --library-brass:#d4ad52; --library-paper:#f2e6c9; --library-paper-dim:#c8b795; --library-success:#62c99a; --library-danger:#d9655d; }
    .library-bg::before { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(circle at 50% 42%,rgba(245,196,93,.16),transparent 34%),linear-gradient(90deg,rgba(0,0,0,.34),transparent 18%,transparent 82%,rgba(0,0,0,.38)); z-index:8; }
    .library-bg::after { content:''; position:absolute; inset:0; pointer-events:none; box-shadow:inset 0 0 120px rgba(0,0,0,.58); z-index:9; }
    .game-table { background:linear-gradient(180deg,rgba(255,255,255,.06),transparent 18%),linear-gradient(180deg,#6d4b2e,#422919 78%,#2d1a10); border:1px solid rgba(212,173,82,.22); box-shadow:0 18px 50px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,235,188,.13),inset 0 -18px 28px rgba(0,0,0,.18); }
    .game-table::after { content:''; position:absolute; inset:12px; border:1px solid rgba(245,226,180,.08); border-radius:7px; pointer-events:none; }
    .hud-bar { background:linear-gradient(180deg,rgba(20,12,7,.94),rgba(20,12,7,.68)); border-bottom:1px solid rgba(212,173,82,.16); box-shadow:0 8px 24px rgba(0,0,0,.18); }
    .hud-item { padding:5px 10px; border-left:1px solid rgba(212,173,82,.14); }
    .hud-item span { text-shadow:0 0 12px rgba(232,212,139,.18); }
    .rule-banner { background:linear-gradient(180deg,rgba(64,42,24,.97),rgba(37,23,14,.97)); border:1px solid rgba(212,173,82,.38); box-shadow:0 12px 35px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,236,190,.08),0 0 0 4px rgba(212,173,82,.035); min-width:min(420px,88vw); }
    .rule-banner::before { content:'ПРАВИЛО СОРТИРОВКИ'; display:block; margin-bottom:3px; color:rgba(212,173,82,.72); font-size:.58rem; font-weight:800; letter-spacing:2px; }
    .objects-zone { background:linear-gradient(180deg,rgba(32,19,11,.08),rgba(32,19,11,.18)); border-radius:18px; padding:12px 18px; }
    .objects-zone::before { content:'КНИГИ НА СТОЛЕ'; position:absolute; top:-9px; left:14px; padding:2px 8px; border-radius:4px; background:rgba(38,24,14,.84); color:rgba(242,230,201,.55); font-size:.52rem; font-weight:800; letter-spacing:1.5px; }
    .shelf-container { min-height:92px; background:linear-gradient(180deg,rgba(255,255,255,.035),transparent 20%),linear-gradient(180deg,#4b3020,#2e1c11); border-color:rgba(212,173,82,.24); box-shadow:inset 0 1px 0 rgba(255,230,181,.06),inset 0 -12px 18px rgba(0,0,0,.16),0 7px 16px rgba(0,0,0,.3); }
    .shelf-container::after { content:''; position:absolute; left:7px; right:7px; bottom:5px; height:4px; border-radius:2px; background:linear-gradient(180deg,#745034,#26170d); box-shadow:0 1px 0 rgba(255,225,173,.08); }
    .shelf-label { background:rgba(18,10,6,.22); color:var(--library-paper-dim); min-height:28px; display:flex; align-items:center; justify-content:center; }
    .shelf-items { min-height:58px; position:relative; z-index:1; }
    .book-item { filter:drop-shadow(0 4px 5px rgba(0,0,0,.35)); transition:transform .16s cubic-bezier(.2,.8,.2,1),filter .16s ease; }
    .book-item:hover { filter:drop-shadow(0 9px 9px rgba(0,0,0,.42)) brightness(1.08) saturate(1.08); }
    .book-item.dragging { filter:drop-shadow(0 20px 26px rgba(0,0,0,.58)) brightness(1.12) saturate(1.08)!important; }
    .shelf-container.highlight { border-color:var(--library-success); box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 0 0 2px rgba(98,201,154,.08),0 0 28px rgba(98,201,154,.22); transform:translateY(-2px); }
    .shelf-container.reject { border-color:var(--library-danger); box-shadow:0 0 0 2px rgba(217,101,93,.08),0 0 24px rgba(217,101,93,.2); }
    .shelf-container.forbidden .shelf-label::before { content:'✕ '; color:var(--library-danger); }
    .score-popup { font-weight:900; letter-spacing:.5px; text-shadow:0 3px 10px rgba(0,0,0,.7); animation:libraryScorePop .85s cubic-bezier(.2,.8,.2,1) forwards; pointer-events:none; }
    @keyframes libraryScorePop { 0%{opacity:0;transform:translate(-50%,8px) scale(.75)} 18%{opacity:1;transform:translate(-50%,-4px) scale(1.12)} 100%{opacity:0;transform:translate(-50%,-48px) scale(.94)} }
    .combo-display.show { animation:libraryComboIn .35s cubic-bezier(.2,1.4,.4,1); }
    @keyframes libraryComboIn { 0%{opacity:0;transform:translateX(-50%) scale(.6) rotate(-3deg)} 100%{opacity:1;transform:translateX(-50%) scale(1) rotate(0)} }
    .modal-card { border-color:rgba(212,173,82,.34); background:linear-gradient(180deg,rgba(75,49,30,.98),rgba(38,23,14,.98)); box-shadow:0 30px 80px rgba(0,0,0,.68),inset 0 1px 0 rgba(255,235,190,.08); }
    @media (max-width:700px) { .hud-bar{padding:8px;gap:4px}.hud-item{font-size:.68rem;padding:4px 5px}.menu-button{padding:7px 8px}.menu-button .menu-text{display:none}.rule-banner{top:48px;padding:8px 12px;min-width:0}.objects-zone{width:96%;height:17%;bottom:40%;gap:7px}.containers-zone{width:99%;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;padding:5px}.shelf-container{min-height:78px}.shelf-label{font-size:.58rem}.shelf-items{min-height:46px;padding:4px}.game-table{width:96%;bottom:18%;height:20%} }
    @media (prefers-reduced-motion:reduce) { .book-item,.shelf-container,.score-popup,.combo-display{animation:none!important;transition:none!important} }
  `;
  documentRef.head.append(style);
}
