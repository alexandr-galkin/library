export const BOOK_COLORS = {
  red:{name:'Бордовые',spine:'#6d2929',cover:'#8f3d38',edge:'#eadfc8'},
  blue:{name:'Тёмно-синие',spine:'#243a57',cover:'#365778',edge:'#e8dfca'},
  green:{name:'Тёмно-зелёные',spine:'#304b37',cover:'#42664a',edge:'#e5ddc6'},
  yellow:{name:'Охристые',spine:'#806025',cover:'#ad8130',edge:'#eee2c7'},
  purple:{name:'Сливовые',spine:'#493047',cover:'#67445f',edge:'#e7dcc4'},
  brown:{name:'Коричневые',spine:'#4a2c1b',cover:'#6b4328',edge:'#e4d7bc'},
  black:{name:'Тёмные',spine:'#211f1c',cover:'#37322c',edge:'#d8ccb2'},
  white:{name:'Светлые',spine:'#a99b7f',cover:'#d0c2a5',edge:'#f2ead7'},
};

// Visual dimensions are deliberately identical: size is a game property, not a different sprite size.
export const BOOK_SIZES={small:{name:'Маленькие',height:78,width:54},medium:{name:'Средние',height:78,width:54},large:{name:'Большие',height:78,width:54}};
export const BOOK_GENRES={history:{name:'История',icon:'⚔'},science:{name:'Наука',icon:'✧'},fiction:{name:'Фантастика',icon:'✦'},poetry:{name:'Поэзия',icon:'✒'},adventure:{name:'Приключения',icon:'⚓'},mystery:{name:'Детектив',icon:'◇'}};
export const BOOK_SYMBOLS={star:{name:'Звезда',icon:'★'},moon:{name:'Луна',icon:'☾'},crown:{name:'Корона',icon:'♔'},leaf:{name:'Лист',icon:'❦'},diamond:{name:'Алмаз',icon:'◆'},none:{name:'Без знака',icon:''}};
export const BOOK_THICKNESS={thin:{name:'Тонкие',widthMod:1},normal:{name:'Обычные',widthMod:1},thick:{name:'Толстые',widthMod:1}};

export function createBookSVG(book){
  const color=BOOK_COLORS[book.color],size=BOOK_SIZES[book.size],genre=BOOK_GENRES[book.genre],symbol=BOOK_SYMBOLS[book.symbol];
  const w=size.width,h=size.height;
  const symbolSvg=symbol.icon?`<text x="${w/2}" y="${h/2+5}" text-anchor="middle" fill="rgba(247,226,180,.8)" font-size="14" font-family="Georgia,serif">${symbol.icon}</text>`:'';
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="book-art" aria-hidden="true">
    <defs>
      <linearGradient id="bookCover${book.uid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${color.spine}"/><stop offset=".48" stop-color="${color.cover}"/><stop offset="1" stop-color="${color.spine}"/>
      </linearGradient>
      <linearGradient id="bookPages${book.uid}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fff5d9"/><stop offset="1" stop-color="#cdbf9f"/></linearGradient>
      <filter id="bookShadow${book.uid}" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="3" dy="5" stdDeviation="3" flood-opacity=".48"/></filter>
    </defs>
    <g filter="url(#bookShadow${book.uid})">
      <rect x="3" y="3" width="${w-8}" height="${h-6}" rx="4" fill="url(#bookCover${book.uid})"/>
      <rect x="${w-7}" y="5" width="4" height="${h-10}" rx="1" fill="url(#bookPages${book.uid})"/>
      <path d="M7 9H${w-12} M7 ${h-10}H${w-12}" stroke="rgba(255,235,190,.34)" stroke-width="1"/>
      <path d="M9 5V${h-5}" stroke="rgba(255,244,211,.16)" stroke-width="2"/>
      <rect x="8" y="${Math.round(h*.18)}" width="${w-18}" height="${Math.round(h*.48)}" rx="2" fill="rgba(30,12,5,.10)" stroke="rgba(247,226,180,.22)"/>
      <text x="${w/2}" y="${Math.round(h*.30)}" text-anchor="middle" fill="rgba(247,226,180,.65)" font-size="7" font-family="Georgia,serif" letter-spacing="1">LIBRARY</text>
      <text x="${w/2}" y="${Math.round(h*.73)}" text-anchor="middle" fill="rgba(247,226,180,.62)" font-size="12" font-family="Georgia,serif">${genre.icon}</text>
      ${symbolSvg}
      <circle cx="${w/2}" cy="${h-10}" r="2" fill="rgba(247,226,180,.55)"/>
    </g>
  </svg>`;
}
