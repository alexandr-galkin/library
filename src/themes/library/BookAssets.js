import { t } from '../../i18n/index.js';

export const BOOK_COLORS = {
  red:{spine:'#7a2f32',cover:'#aa4546',edge:'#eadfc8'},
  blue:{spine:'#284866',cover:'#3d7395',edge:'#e8dfca'},
  green:{spine:'#36543e',cover:'#568265',edge:'#e5ddc6'},
  yellow:{spine:'#8a6426',cover:'#cf9639',edge:'#eee2c7'},
  purple:{spine:'#563753',cover:'#795778',edge:'#e7dcc4'},
  brown:{spine:'#593620',cover:'#825634',edge:'#e4d7bc'},
  black:{spine:'#272622',cover:'#48443d',edge:'#d8ccb2'},
  white:{spine:'#b2a586',cover:'#ded1af',edge:'#f2ead7'},
};

// All books use the same visual dimensions so the game stays clean and readable.
export const BOOK_SIZES={small:{height:104,width:72},medium:{height:104,width:72},large:{height:104,width:72}};
export const BOOK_GENRES={history:{icon:'⚔'},science:{icon:'✧'},fiction:{icon:'✦'},poetry:{icon:'✒'},adventure:{icon:'⚓'},mystery:{icon:'◇'}};
export const BOOK_SYMBOLS={star:{icon:'★'},moon:{icon:'☾'},crown:{icon:'♔'},leaf:{icon:'❦'},diamond:{icon:'◆'},none:{icon:''}};
export const BOOK_THICKNESS={thin:{widthMod:1},normal:{widthMod:1},thick:{widthMod:1}};

export function createBookSVG(book){
  const color=BOOK_COLORS[book.color],size=BOOK_SIZES[book.size],genre=BOOK_GENRES[book.genre],symbol=BOOK_SYMBOLS[book.symbol];
  const w=size.width,h=size.height;
  const brand=t('theme.bookSpine');
  const symbolSvg=symbol.icon?`<text x="${w/2+1}" y="${h/2+9}" text-anchor="middle" fill="rgba(255,239,199,.9)" font-size="17" font-family="Georgia,serif">${symbol.icon}</text>`:'';
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="book-art" aria-hidden="true">
    <defs>
      <linearGradient id="bookCover${book.uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${color.spine}"/><stop offset=".1" stop-color="${color.spine}"/><stop offset=".46" stop-color="${color.cover}"/><stop offset="1" stop-color="${color.spine}"/></linearGradient>
      <linearGradient id="bookPages${book.uid}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fff5d9"/><stop offset="1" stop-color="#cdbf9f"/></linearGradient>
      <linearGradient id="bookSheen${book.uid}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="rgba(255,255,255,.18)"/><stop offset=".38" stop-color="rgba(255,255,255,.04)"/><stop offset="1" stop-color="rgba(0,0,0,.16)"/></linearGradient>
      <filter id="bookShadow${book.uid}" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="3" dy="6" stdDeviation="3" flood-opacity=".44"/></filter>
    </defs>
    <g filter="url(#bookShadow${book.uid})">
      <rect x="3" y="3" width="${w-8}" height="${h-6}" rx="6" fill="url(#bookCover${book.uid})"/>
      <rect x="3" y="3" width="${w-8}" height="${h-6}" rx="6" fill="url(#bookSheen${book.uid})"/>
      <rect x="${w-7}" y="5" width="5" height="${h-10}" rx="1" fill="url(#bookPages${book.uid})"/>
      <rect x="7" y="8" width="5" height="${h-16}" rx="2.5" fill="rgba(0,0,0,.1)" stroke="rgba(255,239,199,.14)"/>
      <path d="M18 11H${w-14} M18 ${h-12}H${w-14}" stroke="rgba(255,239,199,.42)" stroke-width="1.4"/>
      <path d="M14 8V${h-8}" stroke="rgba(255,244,211,.13)" stroke-width="1.5"/>
      <rect x="17" y="${Math.round(h*.18)}" width="${w-31}" height="${Math.round(h*.44)}" rx="4" fill="rgba(28,15,9,.12)" stroke="rgba(255,239,199,.32)"/>
      <rect x="20" y="${Math.round(h*.22)}" width="${w-37}" height="2" rx="1" fill="rgba(255,239,199,.38)"/>
      <text x="${w/2+1}" y="${Math.round(h*.32)}" text-anchor="middle" fill="rgba(255,239,199,.76)" font-size="8" font-family="Georgia,serif" letter-spacing="1">${brand}</text>
      <text x="${w/2+1}" y="${Math.round(h*.74)}" text-anchor="middle" fill="rgba(255,239,199,.72)" font-size="14" font-family="Georgia,serif">${genre.icon}</text>
      ${symbolSvg}
      <circle cx="${w/2+1}" cy="${h-11}" r="2.5" fill="rgba(255,239,199,.66)"/>
    </g>
  </svg>`;
}
