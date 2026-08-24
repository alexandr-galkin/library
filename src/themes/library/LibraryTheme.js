import { createBookSVG, BOOK_COLORS, BOOK_SIZES, BOOK_GENRES, BOOK_SYMBOLS, BOOK_THICKNESS } from './BookAssets.js';

export class LibraryTheme {
  constructor() { this.name='library'; this.displayName='Библиотека'; this.description='Разложи книги по полкам'; }

  injectStyles() {
    if (document.getElementById('library-theme-styles')) return;
    const style=document.createElement('style'); style.id='library-theme-styles'; style.textContent=`
      *{margin:0;padding:0;box-sizing:border-box}html,body,#app{width:100%;height:100%;overflow:hidden}body{font-family:Georgia,'Times New Roman',serif;background:#100b08;color:#f4ead7;touch-action:manipulation;-webkit-font-smoothing:antialiased}
      .library-bg{position:absolute;inset:0;overflow:hidden;background:#19100b;isolation:isolate}
      .library-bg:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#100a07 0,#2c170d 22%,#54331c 65%,#24130b 100%);z-index:-5}
      .library-bg:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(255,218,150,.26),transparent 42%),linear-gradient(90deg,rgba(0,0,0,.72),transparent 24%,transparent 76%,rgba(0,0,0,.72)),linear-gradient(0deg,rgba(0,0,0,.55),transparent 35%);z-index:-1;pointer-events:none}
      .library-architecture{position:absolute;inset:0;z-index:0;pointer-events:none}
      .back-wall{position:absolute;inset:4% 7% 14%;background:#4b2d19;border:10px solid #25140b;box-shadow:inset 0 0 80px #160a05,0 12px 40px #000;}
      .back-wall:before{content:'';position:absolute;inset:2%;border:2px solid rgba(210,169,103,.18)}
      .bookcase{position:absolute;top:9%;bottom:14%;width:24%;background:linear-gradient(90deg,#28140a,#5a351b 12%,#6e4525 50%,#351b0d 90%);border:8px solid #241209;box-shadow:inset 0 0 20px #160904,0 18px 35px #000;}
      .bookcase.left{left:1.5%}.bookcase.right{right:1.5%}
      .case-top{position:absolute;left:-5%;right:-5%;top:-9px;height:16px;background:linear-gradient(#8b5b31,#4a2814);box-shadow:0 5px 10px #000}
      .case-shelf{position:absolute;left:3%;right:3%;height:2px;background:#9a6738;box-shadow:0 4px 10px #130803;}
      .case-books{position:absolute;left:7%;right:7%;display:flex;align-items:flex-end;gap:3px;height:15%;overflow:hidden;padding:0 4px}
      .case-books.one{top:9%}.case-books.two{top:28%}.case-books.three{top:47%}.case-books.four{top:66%}.case-books.five{top:85%}
      .case-books span{width:11%;height:76%;border-radius:2px 2px 0 0;box-shadow:1px 0 3px #160a05,inset 1px 0 rgba(255,255,255,.16)}
      .case-shelf.s1{top:23%}.case-shelf.s2{top:42%}.case-shelf.s3{top:61%}.case-shelf.s4{top:80%}
      .arch-window{position:absolute;left:50%;top:11%;transform:translateX(-50%);width:24%;height:35%;background:#111b2b;border:12px solid #4c2c17;box-shadow:0 0 0 4px #241309,0 20px 40px #000,inset 0 0 50px #080d16;}
      .arch-window:before,.arch-window:after{content:'';position:absolute;background:#5a381d}.arch-window:before{left:50%;top:0;bottom:0;width:8px;transform:translateX(-50%)}.arch-window:after{left:0;right:0;top:52%;height:7px}
      .moon{position:absolute;width:48px;height:48px;border-radius:50%;right:18%;top:17%;background:#ead9a8;box-shadow:0 0 35px rgba(234,217,168,.55)}
      .ceiling-lamp{position:absolute;top:0;left:50%;width:190px;height:110px;transform:translateX(-50%);z-index:2}.ceiling-lamp:before{content:'';position:absolute;left:50%;top:0;width:3px;height:42px;background:#17100b}.ceiling-lamp:after{content:'';position:absolute;left:50%;top:34px;transform:translateX(-50%);width:115px;height:52px;border-radius:8px 8px 55px 55px;background:linear-gradient(#d4a65a,#805329);box-shadow:0 15px 45px rgba(255,190,91,.28)}
      .desk{position:absolute;left:50%;bottom:8%;transform:translateX(-50%);width:58%;height:10%;border-radius:5px;background:linear-gradient(#7c4a27,#4a2815);box-shadow:0 15px 35px #000, inset 0 3px rgba(255,224,172,.14);z-index:3}.desk:after{content:'';position:absolute;left:4%;right:4%;top:10px;bottom:12px;border:1px solid rgba(235,193,121,.18);border-radius:3px}
      .library-floor{position:absolute;bottom:0;left:0;right:0;height:16%;background:repeating-linear-gradient(90deg,#4a2916 0 90px,#59341c 92px 180px);box-shadow:0 -18px 40px #000;z-index:1}
      .game-table{position:absolute;left:50%;bottom:17%;transform:translateX(-50%);width:min(720px,84%);height:23%;background:rgba(49,27,14,.88);border:1px solid rgba(218,176,107,.3);border-radius:7px;box-shadow:0 25px 60px #000,inset 0 2px rgba(255,227,174,.12);z-index:10}.game-table:before{content:'';position:absolute;left:0;right:0;top:0;height:7px;background:linear-gradient(#9b6836,#5d351b);border-radius:7px 7px 0 0}
      .hud-bar{position:absolute;top:0;left:0;right:0;z-index:50;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 16px;background:rgba(20,11,7,.86);border-bottom:1px solid rgba(218,176,107,.2);backdrop-filter:blur(6px)}.hud-item{font-size:.78rem;color:#bba27c;white-space:nowrap;text-transform:uppercase;letter-spacing:1px}.hud-item span{color:#f1dfba;font-weight:800}.menu-button{padding:7px 11px;background:#3d2414;border:1px solid rgba(205,161,94,.35);border-radius:4px;color:#e1c79b;cursor:pointer}.menu-button:hover{background:#513018}
      .rule-banner{position:absolute;top:53px;left:50%;transform:translateX(-50%);z-index:40;background:#eee1c6;color:#342419;border:1px solid #a8895d;border-radius:2px;padding:12px 22px;text-align:center;box-shadow:0 10px 25px #000;min-width:min(460px,86vw)}.rule-banner h2{font-size:1rem}.rule-banner .sub{font-size:.72rem;color:#765f45;margin-top:4px}
      .objects-zone{position:absolute;bottom:42%;left:50%;transform:translateX(-50%);width:min(680px,86%);height:14%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;z-index:30}.objects-zone:before{content:'КНИГИ ДЛЯ СОРТИРОВКИ';position:absolute;top:-20px;left:8px;font-size:.58rem;letter-spacing:2px;color:#d0b88d}
      .containers-zone{position:absolute;bottom:4%;left:50%;transform:translateX(-50%);width:min(760px,90%);height:22%;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;z-index:20}.shelf-container{position:relative;background:linear-gradient(#633b20,#3b2111);border:1px solid rgba(210,166,100,.4);border-radius:4px;box-shadow:0 12px 22px #000,inset 0 2px rgba(255,230,183,.1);overflow:hidden}.shelf-container:after{content:'';position:absolute;left:2%;right:2%;bottom:3px;height:7px;background:linear-gradient(#8b5a31,#3b2010);box-shadow:0 2px 5px #000}.shelf-header{position:relative;z-index:2;padding:6px 8px;background:rgba(20,9,4,.35);border-bottom:1px solid rgba(218,176,107,.15);display:flex;justify-content:space-between}.shelf-label{font-size:.65rem;color:#e0c79d;letter-spacing:1px}.shelf-count{font-size:.62rem;color:#bda47c}.shelf-items{position:relative;z-index:3;display:flex;align-items:flex-end;justify-content:center;gap:5px;height:calc(100% - 28px);padding:5px 8px 9px}
      .book-item{position:relative;width:54px;height:78px;flex:0 0 54px;cursor:grab;display:flex;align-items:flex-end;justify-content:center;transition:transform .16s ease,filter .16s ease}.book-item .book-art{width:54px!important;height:78px!important;display:block}.book-item:hover{transform:translateY(-5px) rotate(-1deg);filter:drop-shadow(4px 10px 7px rgba(0,0,0,.65))}.book-item.dragging{cursor:grabbing;transform:translateY(-24px) rotate(-3deg) scale(1.04);z-index:500;filter:drop-shadow(8px 22px 14px rgba(0,0,0,.75))}.book-item.dragging:after{content:'🖐️';position:absolute;left:50%;bottom:-29px;transform:translateX(-50%) rotate(-12deg);font-size:31px;line-height:1;filter:drop-shadow(2px 3px 2px #000);z-index:510}.book-item.correct{animation:bookCorrect .35s forwards}.book-item.shake{animation:bookShake .4s}
      @keyframes bookCorrect{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(0);opacity:0}}@keyframes bookShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
      .shelf-container.highlight{border-color:#aab67b;box-shadow:0 0 0 2px rgba(170,182,123,.2),0 12px 25px #000}.shelf-container.reject{border-color:#b26a5d;box-shadow:0 0 0 2px rgba(178,106,93,.16),0 12px 25px #000}
      .score-popup{position:fixed;color:#f0d79f;font-weight:700;z-index:120;pointer-events:none;text-shadow:0 3px 8px #000;animation:floatUp 1s forwards}@keyframes floatUp{to{transform:translateY(-45px);opacity:0}}
      .modal-overlay{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;background:rgba(9,5,3,.8);backdrop-filter:blur(8px);padding:20px}.modal-overlay.active{display:flex}.modal-card{background:#ead9b7;color:#38291d;border:1px solid #a8895d;border-radius:5px;padding:28px;max-width:390px;width:100%;box-shadow:0 25px 70px #000;text-align:center}.modal-title{color:#38291d}.menu-btn{display:block;width:100%;padding:13px;margin-bottom:9px;border-radius:4px;cursor:pointer}.menu-btn-primary{background:#5a3820;color:#f4ead7;border:1px solid #9d7848}.menu-btn-secondary{background:#d8c6a5;color:#493523;border:1px solid #aa8e62}.combo-display{display:none}
      @media(max-width:700px){.bookcase{width:29%}.arch-window{width:30%;height:26%}.desk{width:76%}.game-table{width:92%}.objects-zone{width:94%;gap:7px}.containers-zone{width:94%;grid-template-columns:repeat(2,1fr)}.book-item,.book-item .book-art{width:48px!important;height:69px!important}.book-item{flex-basis:48px}.hud-item{font-size:.6rem}.rule-banner{min-width:0;width:88vw}}
    `; document.head.append(style);
  }

  renderBackground(container) {
    const colors=['#7b302e','#355879','#3f6246','#a67b32','#67455f','#68442b','#35312b','#c4b79a'];
    const books=(count)=>Array.from({length:count},(_,i)=>`<span style="height:${62+(i%4)*7}%;background:${colors[i%colors.length]}"></span>`).join('');
    container.innerHTML=`
      <div class="library-architecture">
        <div class="back-wall"></div>
        <div class="bookcase left"><div class="case-top"></div><div class="case-books one">${books(14)}</div><div class="case-books two">${books(16)}</div><div class="case-books three">${books(13)}</div><div class="case-books four">${books(15)}</div><div class="case-books five">${books(12)}</div><div class="case-shelf s1"></div><div class="case-shelf s2"></div><div class="case-shelf s3"></div><div class="case-shelf s4"></div></div>
        <div class="bookcase right"><div class="case-top"></div><div class="case-books one">${books(13)}</div><div class="case-books two">${books(15)}</div><div class="case-books three">${books(14)}</div><div class="case-books four">${books(16)}</div><div class="case-books five">${books(13)}</div><div class="case-shelf s1"></div><div class="case-shelf s2"></div><div class="case-shelf s3"></div><div class="case-shelf s4"></div></div>
        <div class="arch-window"><div class="moon"></div></div>
        <div class="ceiling-lamp"></div><div class="desk"></div>
      </div><div class="library-floor"></div>`;
  }

  renderBook(book){const div=document.createElement('div');div.className='book-item';div.dataset.uid=book.uid;div.innerHTML=createBookSVG(book);div.setAttribute('aria-label',`Книга ${book.color} ${book.size}`);return div;}
  getBookLabels(){return{color:Object.fromEntries(Object.entries(BOOK_COLORS).map(([k,v])=>[k,v.name])),size:Object.fromEntries(Object.entries(BOOK_SIZES).map(([k,v])=>[k,v.name])),genre:Object.fromEntries(Object.entries(BOOK_GENRES).map(([k,v])=>[k,v.name])),symbol:Object.fromEntries(Object.entries(BOOK_SYMBOLS).map(([k,v])=>[k,v.name])),thickness:Object.fromEntries(Object.entries(BOOK_THICKNESS).map(([k,v])=>[k,v.name]))};}
  getAllBookProperties(){return{colors:Object.keys(BOOK_COLORS),sizes:Object.keys(BOOK_SIZES),genres:Object.keys(BOOK_GENRES),symbols:Object.keys(BOOK_SYMBOLS),thicknesses:Object.keys(BOOK_THICKNESS)}}
}
