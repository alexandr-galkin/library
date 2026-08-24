const STYLE_ID = 'library-visual-overhaul';

export function installLibraryVisuals(documentRef = document) {
  if (documentRef.getElementById(STYLE_ID)) return;
  const style = documentRef.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    :root{--ink:#33261d;--cream:#f4ead5;--paper:#e8d7b6;--paper-dark:#c9b28b;--wood:#4a2d1b;--wood-dark:#25150d;--wood-light:#765033;--brass:#b99a61;--green:#647052;--red:#9a5a4d}
    *{box-sizing:border-box}
    body{margin:0!important;background:#17100b!important;color:var(--cream)!important;font-family:Georgia,'Times New Roman',serif!important}
    button{font-family:inherit!important}

    /* A quiet old library instead of the previous abstract neon background. */
    .library-bg{position:fixed!important;inset:0!important;overflow:hidden!important;background:#17100b!important}
    .library-bg::before{content:'';position:absolute;inset:0;background:
      linear-gradient(90deg,rgba(14,8,4,.82),transparent 15%,transparent 85%,rgba(14,8,4,.84)),
      repeating-linear-gradient(90deg,transparent 0 92px,rgba(91,57,31,.18) 94px 98px,transparent 100px 190px),
      linear-gradient(180deg,#24150d 0%,#4a2d1b 48%,#24140b 100%);}
    .library-bg::after{content:'';position:absolute;inset:0;background:
      radial-gradient(ellipse at 50% 35%,rgba(247,219,164,.22),transparent 42%),
      linear-gradient(180deg,transparent 55%,rgba(8,4,2,.58) 100%);
      box-shadow:inset 0 0 160px rgba(0,0,0,.72);}

    .game-table{background:linear-gradient(180deg,rgba(39,24,14,.96),rgba(27,16,9,.98))!important;border:1px solid rgba(185,154,97,.42)!important;border-radius:8px!important;box-shadow:0 28px 80px rgba(0,0,0,.65),inset 0 1px rgba(255,235,194,.12)!important}
    .game-table::after{border:1px solid rgba(231,205,157,.12)!important;border-radius:5px!important}

    .hud-bar{background:rgba(30,18,10,.94)!important;border-bottom:1px solid rgba(185,154,97,.28)!important;box-shadow:0 8px 25px rgba(0,0,0,.35)!important;backdrop-filter:blur(5px)}
    .hud-item{color:#a99370!important;font-family:Georgia,serif!important;letter-spacing:1px!important;text-transform:uppercase}.hud-item span{color:#f0dfbd!important;text-shadow:none!important}
    .menu-button{background:#392316!important;color:#e8d6b2!important;border:1px solid rgba(185,154,97,.42)!important;border-radius:4px!important;box-shadow:none!important}.menu-button:hover{background:#4b2d1b!important;border-color:#c9a96d!important}

    .rule-banner{background:#eee0c3!important;color:var(--ink)!important;border:1px solid #bca47a!important;border-radius:3px!important;box-shadow:0 15px 35px rgba(0,0,0,.42)!important;min-width:min(470px,88vw)!important;padding:17px 24px!important;transform:rotate(-.25deg)}
    .rule-banner::before{content:'КАРТОЧКА БИБЛИОТЕКАРЯ'!important;display:block!important;color:#8a7049!important;font-size:.55rem!important;letter-spacing:2.5px!important;margin-bottom:6px!important}.rule-banner h2{color:#33261d!important;font-family:Georgia,serif!important;font-size:1.08rem!important}.rule-banner .sub{color:#766047!important}

    .objects-zone{background:rgba(12,7,4,.28)!important;border:1px solid rgba(185,154,97,.12)!important;border-radius:6px!important}.objects-zone::before{content:'КНИГИ ДЛЯ СОРТИРОВКИ'!important;color:#c8b18a!important;background:rgba(30,18,10,.82)!important;border:1px solid rgba(185,154,97,.22)!important;border-radius:3px!important;letter-spacing:2px!important}

    .containers-zone{gap:12px!important}
    .shelf-container{background:linear-gradient(180deg,#5a3923,#382116)!important;border:1px solid rgba(185,154,97,.4)!important;border-radius:5px!important;box-shadow:inset 0 2px rgba(255,225,177,.1),inset 0 -18px 28px rgba(0,0,0,.3),0 10px 24px rgba(0,0,0,.38)!important}
    .shelf-container::before{content:'';position:absolute;left:0;right:0;top:0;height:5px;background:linear-gradient(180deg,#87603b,#5b3922);box-shadow:0 2px 5px rgba(0,0,0,.5)}
    .shelf-container::after{background:linear-gradient(180deg,#806044,#332014)!important;height:8px!important;bottom:3px!important;box-shadow:0 2px 4px rgba(0,0,0,.45)!important}
    .shelf-header{background:rgba(22,12,7,.24)!important;border-bottom:1px solid rgba(185,154,97,.16)!important}
    .shelf-label{color:#e4d0a7!important;background:transparent!important;font-family:Georgia,serif!important;text-transform:uppercase;letter-spacing:1.6px;font-size:.67rem!important}.shelf-count{color:#bfa77b!important}
    .shelf-container.highlight{border-color:#9aa777!important;box-shadow:0 0 0 2px rgba(154,167,119,.18),0 0 28px rgba(154,167,119,.22),0 10px 24px rgba(0,0,0,.38)!important;transform:translateY(-3px)!important}.shelf-container.reject{border-color:#ad665a!important;box-shadow:0 0 0 2px rgba(173,102,90,.16),0 0 24px rgba(173,102,90,.18)!important}.shelf-container.forbidden .shelf-label::before{content:'× '!important;color:#b56d60!important}

    .book-item{filter:drop-shadow(3px 7px 5px rgba(0,0,0,.52));transition:transform .16s ease,filter .16s ease!important}.book-item:hover{filter:drop-shadow(4px 10px 8px rgba(0,0,0,.6)) brightness(1.05)!important}.book-item.dragging{filter:drop-shadow(7px 20px 18px rgba(0,0,0,.68)) brightness(1.08)!important}
    .combo-display{display:none!important}.score-popup{color:#ead19c!important;font-family:Georgia,serif!important;text-shadow:0 3px 10px #000!important}

    .modal-overlay{background:rgba(10,6,3,.78)!important;backdrop-filter:blur(4px)!important}.modal-card{background:#ead9b7!important;color:var(--ink)!important;border:1px solid #b69a68!important;border-radius:5px!important;box-shadow:0 30px 90px rgba(0,0,0,.72)!important;font-family:Georgia,serif!important}.modal-card::before{content:'';position:absolute;inset:9px;border:1px solid rgba(91,67,40,.18);pointer-events:none}.modal-title,.complete-title{color:#302219!important;font-family:Georgia,serif!important;letter-spacing:1px!important}.modal-card p,.complete-level{color:#66523b!important}.menu-btn,.level-complete-card button{border-radius:4px!important;font-family:Georgia,serif!important;letter-spacing:1px!important;border:1px solid #947544!important}.menu-btn-primary,.level-complete-card button{background:#5a412b!important;color:#f4ead5!important}.menu-btn-secondary{background:rgba(255,255,255,.18)!important;color:#4d3b2a!important}.score-breakdown{border-color:rgba(91,67,40,.24)!important;background:rgba(255,255,255,.16)!important}.score-row{color:#5c4933!important;border-bottom-color:rgba(91,67,40,.13)!important}.score-row strong,.score-total strong{color:#2b211a!important}.score-total{border-top-color:#947544!important;color:#2b211a!important}

    .menu-overlay{background:
      radial-gradient(ellipse at 50% 30%,rgba(242,210,157,.18),transparent 34%),
      linear-gradient(90deg,rgba(13,7,4,.96),rgba(48,29,17,.88) 50%,rgba(13,7,4,.96))!important}
    .menu-books-decoration{opacity:.1!important;filter:sepia(1)}
    .menu-content{max-width:600px!important;gap:18px!important}.menu-logo{flex-direction:column!important;gap:4px!important}.logo-icon{font-size:3rem!important;filter:sepia(.5)}
    .menu-title{color:#ead5aa!important;background:none!important;-webkit-text-fill-color:initial!important;font-family:Georgia,serif!important;font-weight:normal!important;letter-spacing:6px!important;font-size:clamp(2rem,5vw,3.4rem)!important;text-shadow:0 3px 20px #000!important}.menu-subtitle{color:#ae9165!important;letter-spacing:4px!important;font-family:Georgia,serif!important}.menu-description{color:#a99270!important;font-style:italic}
    .menu-stats-grid{grid-template-columns:repeat(3,1fr)!important;gap:0!important;border-top:1px solid rgba(185,154,97,.2);border-bottom:1px solid rgba(185,154,97,.2)}.stat-card{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:13px!important}.stat-card+.stat-card{border-left:1px solid rgba(185,154,97,.16)}.stat-icon{filter:grayscale(.5);opacity:.7}.stat-value{color:#dec58e!important;font-family:Georgia,serif!important}.stat-label{color:#887456!important}.play-button{border-radius:4px!important;background:#5a412b!important;color:#f4ead5!important;border:1px solid #b1935f!important;box-shadow:0 10px 24px rgba(0,0,0,.32)!important;font-family:Georgia,serif!important;text-transform:uppercase;letter-spacing:3px!important}.play-button:hover{background:#6b4d32!important;transform:translateY(-2px)!important}.settings-button{border-radius:4px!important;background:transparent!important;border:1px solid rgba(185,154,97,.32)!important;color:#bba47b!important}.settings-button:hover{background:rgba(185,154,97,.08)!important}.menu-footer,.hint{color:#806d52!important}

    .settings-content{max-width:520px!important}.settings-title{color:#e5d0a0!important;font-family:Georgia,serif!important;font-weight:normal!important;letter-spacing:3px!important}.settings-subtitle{color:#917a5a!important;font-style:italic}.setting-item{background:rgba(52,34,21,.72)!important;border:1px solid rgba(185,154,97,.22)!important;border-radius:4px!important}.setting-name{color:#ddc99a!important;font-family:Georgia,serif!important}.setting-desc{color:#998366!important}.toggle-switch{border-radius:4px!important;background:#24170f!important;border-color:#6d5231!important}.toggle-switch.active{background:#6d6040!important;border-color:#a98a50!important}.toggle-slider{border-radius:2px!important}.back-button{border-radius:4px!important;background:transparent!important;border-color:rgba(185,154,97,.35)!important;color:#c2ab7e!important}

    @media(max-width:700px){.hud-item{letter-spacing:.6px!important;font-size:.62rem!important}.rule-banner{min-width:0!important;width:90vw!important;padding:13px 15px!important}.objects-zone{width:96%!important}.containers-zone{width:96%!important;gap:8px!important}.shelf-container{min-height:76px!important}.menu-title{letter-spacing:3px!important}.menu-content{padding:20px!important}}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;transition-duration:.001ms!important}}
  `;
  documentRef.head.append(style);
}
