const STYLE_ID = 'library-visual-overhaul-v2';

export function installLibraryVisuals(documentRef = document) {
  if (documentRef.getElementById(STYLE_ID)) return;
  const style = documentRef.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    :root{--paper:#f1e6cf;--ink:#2b2118;--wood:#4b2b19;--wood2:#6b4025;--gold:#b7965c;--green:#687258;--wine:#7b4038}
    html,body,#app{width:100%;height:100%;margin:0;overflow:hidden}
    body{background:#15100c!important;color:var(--paper)!important;font-family:Georgia,'Times New Roman',serif!important}

    /* OLD BACKGROUND IS DISABLED. The game now sits inside a stylised library room. */
    .library-bg{position:fixed!important;inset:0!important;z-index:0!important;background:#21150e!important;overflow:hidden!important}
    .library-bg>*{display:none!important}
    .library-bg::before{content:'';position:absolute;inset:0;display:block!important;
      background:
        /* ceiling light */ radial-gradient(ellipse 34% 25% at 50% 12%,rgba(255,224,163,.28),transparent 72%),
        /* left bookcase */ linear-gradient(90deg,#1b1009 0 11%,#3d2415 11.5% 22%,#20130b 22.5% 24%,transparent 24% 76%,#20130b 76.5% 78%,#3d2415 78.5% 88.5%,#1b1009 89%),
        /* wall */ linear-gradient(180deg,#3a2517 0 63%,#25170f 63% 100%);
      box-shadow:inset 0 0 130px rgba(0,0,0,.72)}
    .library-bg::after{content:'';position:absolute;inset:0;display:block!important;
      background:
        /* shelves left */ repeating-linear-gradient(180deg,transparent 0 7%,rgba(17,9,5,.9) 7.2% 8%,transparent 8.2% 14%),
        /* shelves right */ repeating-linear-gradient(180deg,transparent 0 7%,rgba(17,9,5,.9) 7.2% 8%,transparent 8.2% 14%),
        /* floor boards */ repeating-linear-gradient(90deg,rgba(93,57,31,.3) 0 2px,transparent 2px 150px),
        linear-gradient(180deg,transparent 0 66%,#1c1009 66% 100%);
      opacity:.9;pointer-events:none}

    /* Decorative architecture around the play area. */
    .game-table{position:absolute!important;left:50%!important;bottom:15%!important;transform:translateX(-50%)!important;width:min(920px,94vw)!important;height:27%!important;background:linear-gradient(180deg,#55321e,#321b10)!important;border:0!important;border-radius:12px 12px 4px 4px!important;box-shadow:0 26px 55px rgba(0,0,0,.58),inset 0 2px rgba(255,226,174,.12)!important;z-index:10!important}
    .game-table::before{content:''!important;position:absolute!important;top:0!important;left:0!important;right:0!important;height:7px!important;background:linear-gradient(180deg,#93663b,#5a3520)!important;border-radius:12px 12px 0 0!important}
    .game-table::after{content:''!important;position:absolute!important;inset:12px!important;border:1px solid rgba(229,196,136,.13)!important;border-radius:5px!important;pointer-events:none}

    .hud-bar{background:rgba(25,15,9,.92)!important;border-bottom:1px solid rgba(183,150,92,.28)!important;box-shadow:0 5px 22px rgba(0,0,0,.4)!important}
    .hud-item{font-family:Georgia,serif!important;font-size:.75rem!important;letter-spacing:1.5px!important;color:#ad9878!important;text-transform:uppercase}.hud-item span{color:#f0ddbb!important}
    .menu-button{background:#342014!important;border:1px solid rgba(183,150,92,.35)!important;border-radius:5px!important;color:#e3cfaa!important;box-shadow:none!important}.menu-button:hover{background:#4a2b19!important;border-color:#c5a56b!important}

    /* Rule card = old librarian note pinned above the desk. */
    .rule-banner{top:58px!important;background:#eee2c9!important;color:var(--ink)!important;border:1px solid #bba277!important;border-radius:2px!important;box-shadow:0 12px 30px rgba(0,0,0,.45)!important;min-width:min(500px,88vw)!important;padding:16px 25px!important;transform:translateX(-50%) rotate(-.35deg)!important;z-index:60!important}
    .rule-banner::before{content:'LIBRARY • SORTING RULE'!important;display:block!important;font:600 .55rem Georgia,serif!important;letter-spacing:3px!important;color:#8a7048!important;margin-bottom:6px!important}.rule-banner h2{font:700 1.08rem Georgia,serif!important;color:#2b2118!important}.rule-banner .sub{color:#756049!important}

    /* Make the actual play zones look like trays on the wooden desk. */
    .objects-zone{background:rgba(22,12,7,.22)!important;border:1px solid rgba(208,178,125,.13)!important;border-radius:6px!important}
    .objects-zone::before{content:'BOOKS TO SORT'!important;color:#cdb98f!important;background:#27170e!important;border:1px solid rgba(183,150,92,.25)!important;border-radius:3px!important;letter-spacing:2px!important}
    .containers-zone{gap:14px!important}
    .shelf-container{background:linear-gradient(180deg,#603b23,#392014)!important;border:1px solid rgba(193,157,100,.45)!important;border-radius:4px!important;box-shadow:inset 0 2px rgba(255,225,176,.1),inset 0 -20px 25px rgba(0,0,0,.3),0 10px 25px rgba(0,0,0,.4)!important}
    .shelf-container::before{content:''!important;position:absolute!important;left:-2px!important;right:-2px!important;top:-2px!important;height:5px!important;background:#805333!important;box-shadow:0 2px 4px rgba(0,0,0,.5)!important}
    .shelf-container::after{height:7px!important;bottom:2px!important;background:linear-gradient(#805333,#321c11)!important;box-shadow:0 2px 5px #100805!important}
    .shelf-header{background:rgba(25,13,7,.2)!important;border-bottom:1px solid rgba(193,157,100,.18)!important}.shelf-label{font-family:Georgia,serif!important;color:#e6d2ad!important;letter-spacing:1.4px!important;font-size:.66rem!important}.shelf-count{color:#c3aa7c!important}
    .shelf-container.highlight{border-color:#9cae79!important;box-shadow:0 0 0 2px rgba(156,174,121,.16),0 0 28px rgba(156,174,121,.2),0 10px 25px rgba(0,0,0,.4)!important}.shelf-container.reject{border-color:#b86c5d!important;box-shadow:0 0 0 2px rgba(184,108,93,.16),0 0 25px rgba(184,108,93,.18)!important}
    .book-item{filter:drop-shadow(3px 7px 5px rgba(0,0,0,.55))!important}.book-item:hover{filter:drop-shadow(4px 10px 8px rgba(0,0,0,.62)) brightness(1.05)!important}.book-item.dragging{filter:drop-shadow(8px 20px 18px rgba(0,0,0,.7)) brightness(1.08)!important}
    .combo-display{display:none!important}.score-popup{color:#f0d49b!important;text-shadow:0 3px 10px #000!important;font-family:Georgia,serif!important}

    /* Menu is a reading room, not a generic game screen. */
    .menu-overlay{background:#1c1009!important;overflow:hidden!important}
    .menu-overlay::before{content:'';position:absolute;inset:0;background:
      linear-gradient(90deg,rgba(8,4,2,.94),transparent 20%,transparent 80%,rgba(8,4,2,.94)),
      repeating-linear-gradient(90deg,#25150d 0 105px,#4a2b19 106px 116px,#25150d 117px 210px),
      linear-gradient(180deg,#3a2416,#1a0e08);box-shadow:inset 0 0 180px #000}
    .menu-overlay::after{content:'';position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:min(760px,90vw);height:72%;background:linear-gradient(180deg,#59361f,#2c170d 8%,#211109 100%);border:1px solid rgba(190,156,99,.28);box-shadow:0 0 70px rgba(0,0,0,.6),inset 0 0 80px rgba(0,0,0,.4);opacity:.65}
    .menu-background,.menu-books-decoration,.menu-particles{display:none!important}
    .menu-content{position:relative;z-index:2;max-width:620px!important;padding:28px!important;gap:20px!important;background:rgba(28,16,9,.78);border:1px solid rgba(190,156,99,.24);box-shadow:0 25px 80px rgba(0,0,0,.65)}
    .menu-logo{flex-direction:column!important;gap:3px!important}.logo-icon{font-size:3.5rem!important;animation:none!important}.menu-title{font:400 clamp(2.2rem,6vw,4rem) Georgia,serif!important;letter-spacing:7px!important;color:#ead7b1!important;background:none!important;-webkit-text-fill-color:initial!important;text-shadow:0 4px 25px #000!important}.menu-subtitle{font-family:Georgia,serif!important;color:#a88c63!important;letter-spacing:5px!important}.menu-description{color:#b09a7a!important;font-family:Georgia,serif!important;font-style:italic}
    .stat-card{background:transparent!important;border:0!important;border-radius:0!important}.stat-card+.stat-card{border-left:1px solid rgba(190,156,99,.2)!important}.stat-value{color:#e2c993!important;font-family:Georgia,serif!important}.stat-label{color:#8d7657!important}.play-button{border-radius:3px!important;background:#694528!important;border:1px solid #b8945b!important;color:#f3e5c8!important;box-shadow:0 10px 25px rgba(0,0,0,.4)!important;font-family:Georgia,serif!important;letter-spacing:3px!important}.play-button:hover{background:#7a5231!important;transform:translateY(-2px)!important}.settings-button{border-radius:3px!important;background:transparent!important;border:1px solid rgba(190,156,99,.35)!important;color:#c1a77b!important}.menu-footer,.hint{color:#806a4e!important}

    .modal-overlay{background:rgba(7,4,2,.8)!important;backdrop-filter:blur(5px)!important}.modal-card{background:#eee0c3!important;color:#2b2118!important;border:1px solid #b89b67!important;border-radius:3px!important;box-shadow:0 30px 90px #000!important;font-family:Georgia,serif!important}.modal-title,.complete-title{font-family:Georgia,serif!important;color:#2b2118!important}.modal-card p,.complete-level{color:#6f5a40!important}.menu-btn,.level-complete-card button{border-radius:3px!important;font-family:Georgia,serif!important}.menu-btn-primary,.level-complete-card button{background:#694528!important;color:#f3e5c8!important}.menu-btn-secondary{background:transparent!important;color:#5d4934!important;border-color:#a88a5c!important}.score-breakdown{background:rgba(255,255,255,.16)!important;border-color:rgba(90,65,40,.2)!important}.score-row{color:#5e4a35!important;border-bottom-color:rgba(90,65,40,.13)!important}.score-row strong,.score-total strong{color:#2b2118!important}.score-total{border-top-color:#a48758!important}

    @media(max-width:700px){.hud-item{font-size:.6rem!important;letter-spacing:.5px!important}.rule-banner{width:90vw!important;min-width:0!important}.objects-zone,.containers-zone{width:96%!important}.containers-zone{gap:8px!important}.menu-content{width:92%!important;padding:20px!important}.menu-title{letter-spacing:3px!important}}
  `;
  documentRef.head.append(style);
}
