const STYLE_ID = 'library-sort-puzzle-visuals-v3';

export function installSortPuzzleVisuals(documentRef = document) {
  if (documentRef.getElementById(STYLE_ID)) return;
  const style = documentRef.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* The game field is the single positioning context for the shelves. */
    .game-table {
      position:relative!important;
      width:830px!important;
      height:640px!important;
      max-width:calc(100vw - 24px)!important;
      max-height:calc(100vh - 24px)!important;
      overflow:hidden!important;
    }

    .containers-zone {
      position:absolute!important;
      z-index:20!important;
      left:50%!important;
      top:50%!important;
      bottom:auto!important;
      transform:translate(-50%,-50%)!important;
      width:790px!important;
      max-width:calc(100% - 40px)!important;
      margin:0!important;
      padding:0!important;
      display:grid!important;
      grid-template-columns:repeat(5,minmax(0,1fr))!important;
      grid-template-rows:repeat(2,270px)!important;
      grid-auto-rows:270px!important;
      gap:18px!important;
      align-items:stretch!important;
      align-content:start!important;
      overflow:visible!important;
    }

    .shelf-container,
    .shelf-container.empty-shelf {
      position:relative!important;
      width:100%!important;
      min-width:0!important;
      min-height:270px!important;
      height:270px!important;
      padding:0!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:flex-end!important;
      overflow:visible!important;
      background:linear-gradient(180deg,#603b23,#392014)!important;
      border:1px solid rgba(193,157,100,.5)!important;
      border-radius:5px!important;
      box-shadow:inset 0 2px rgba(255,225,176,.1),inset 0 -25px 30px rgba(0,0,0,.3),0 14px 30px rgba(0,0,0,.45)!important;
      transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease!important;
    }

    .shelf-container::before{content:''!important;position:absolute!important;left:-3px!important;right:-3px!important;top:-3px!important;height:12px!important;background:#805333!important;border-radius:2px 2px 0 0!important;box-shadow:0 3px 6px rgba(0,0,0,.5)!important}
    .shelf-container::after{content:''!important;position:absolute!important;left:0!important;right:0!important;bottom:2px!important;height:15px!important;background:linear-gradient(#805333,#321c11)!important;box-shadow:0 3px 6px #100805!important}
    .shelf-container.highlight{transform:translateY(-3px)!important;border-color:#8e9b68!important;box-shadow:0 0 0 2px rgba(142,155,104,.15),0 0 25px rgba(142,155,104,.18)!important}
    .shelf-container.reject{border-color:#a85c51!important;box-shadow:0 0 0 2px rgba(168,92,81,.14),0 0 22px rgba(168,92,81,.2)!important}

    .shelf-header{position:absolute!important;top:9px!important;left:14px!important;right:14px!important;display:flex!important;justify-content:space-between!important;align-items:center!important;z-index:3!important;padding:0!important;background:transparent!important;border:0!important}
    .shelf-label{font-family:Georgia,serif!important;color:#e6d2ad!important;font-size:.76rem!important;letter-spacing:1.4px!important;text-transform:uppercase!important;background:transparent!important}
    .shelf-count{font-family:Georgia,serif!important;color:#c3aa7c!important;font-size:.76rem!important;letter-spacing:1px!important}
    .shelf-items{position:relative!important;z-index:2!important;min-height:215px!important;height:215px!important;padding:12px 11px 20px!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;align-items:center!important;gap:10px!important;overflow:visible!important}
    .shelf-items .book-item{position:relative!important;left:auto!important;top:auto!important;z-index:3!important;flex:0 0 auto!important;width:72px!important;height:35px!important;margin-top:-3px!important;transform-origin:bottom center!important}
    .shelf-items .book-item svg{width:100%!important;height:100%!important;display:block!important;filter:drop-shadow(2px 3px 2px rgba(0,0,0,.55))!important}
    .shelf-items .book-item:not(:last-child){opacity:.96!important}.shelf-items .book-item:last-child{cursor:grab!important}.shelf-items .book-item:last-child:hover{transform:translateY(-7px) rotate(-1deg)!important}
    .shelf-items .book-item.dragging{width:110px!important;height:54px!important;cursor:grabbing!important;transform:rotate(-2deg) scale(1.05)!important}
    .shelf-container.empty-shelf .shelf-items::after{content:'ПЕРЕНЕСИ КНИГУ СЮДА'!important;color:rgba(202,178,132,.26)!important;font:italic .72rem Georgia,serif!important;letter-spacing:1px!important;text-align:center!important}
    .rule-banner{z-index:20!important}.hud-bar{z-index:30!important}.menu-button{z-index:31!important}.objects-zone{display:none!important}.combo-display{z-index:40!important}.score-popup{z-index:50!important}

    @media(max-width:850px){
      .game-table{width:calc(100vw - 24px)!important;height:min(640px,calc(100vh - 24px))!important}
      .containers-zone{width:calc(100% - 40px)!important}
    }
    @media(max-width:700px){
      .containers-zone{width:calc(100% - 24px)!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:none!important;grid-auto-rows:190px!important;gap:8px!important;top:50%!important;max-height:calc(100% - 24px)!important;overflow:auto!important}
      .shelf-container,.shelf-container.empty-shelf{min-height:190px!important;height:190px!important}
      .shelf-items{min-height:145px!important;height:145px!important;padding:7px!important;gap:4px!important}
      .shelf-items .book-item{width:58px!important;height:29px!important}
      .shelf-label,.shelf-count{font-size:.55rem!important}
    }
  `;
  documentRef.head.append(style);
}
