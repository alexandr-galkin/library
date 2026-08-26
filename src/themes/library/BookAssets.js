import { t } from '../../i18n/index.js';

export const BOOK_COLORS = {
  red:{spine:'#6d2929',cover:'#8f3d38',edge:'#eadfc8'},
  blue:{spine:'#243a57',cover:'#365778',edge:'#e8dfca'},
  green:{spine:'#304b37',cover:'#42664a',edge:'#e5ddc6'},
  yellow:{spine:'#806025',cover:'#ad8130',edge:'#eee2c7'},
  purple:{spine:'#493047',cover:'#67445f',edge:'#e7dcc4'},
  brown:{spine:'#4a2c1b',cover:'#6b4328',edge:'#e4d7bc'},
  black:{spine:'#211f1c',cover:'#37322c',edge:'#d8ccb2'},
  white:{spine:'#a99b7f',cover:'#d0c2a5',edge:'#f2ead7'},
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
  const symbolSvg=symbol.icon?`<text x="${w/2}" y="${h/2+8}" text-anchor="middle" fill="rgba(247,226,180,.86)" font-size="17" font-family="Georgia,serif">${symbol.icon}</text>`:'';
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="book-art" aria-hidden="true">
    <defs>
      <linearGradient id="bookCover${book.uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${color.spine}"/><stop offset=".48" stop-color="${color.cover}"/><stop offset="1" stop-color="${color.spine}"/></linearGradient>
      <linearGradient id="bookPages${book.uid}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fff5d9"/><stop offset="1" stop-color="#cdbf9f"/></linearGradient>
      <filter id="bookShadow${book.uid}" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="3" dy="6" stdDeviation="3.5" flood-opacity=".48"/></filter>
    </defs>
    <g filter="url(#bookShadow${book.uid})">
      <rect x="3" y="3" width="${w-8}" height="${h-6}" rx="5" fill="url(#bookCover${book.uid})"/>
      <rect x="${w-7}" y="5" width="5" height="${h-10}" rx="1" fill="url(#bookPages${book.uid})"/>
      <path d="M8 11H${w-13} M8 ${h-12}H${w-13}" stroke="rgba(255,235,190,.38)" stroke-width="1.3"/>
      <path d="M10 6V${h-6}" stroke="rgba(255,244,211,.18)" stroke-width="2.5"/>
      <rect x="10" y="${Math.round(h*.18)}" width="${w-22}" height="${Math.round(h*.48)}" rx="3" fill="rgba(30,12,5,.10)" stroke="rgba(247,226,180,.25)"/>
      <text x="${w/2}" y="${Math.round(h*.30)}" text-anchor="middle" fill="rgba(247,226,180,.72)" font-size="8" font-family="Georgia,serif" letter-spacing="1.2">${brand}</text>
      <text x="${w/2}" y="${Math.round(h*.73)}" text-anchor="middle" fill="rgba(247,226,180,.68)" font-size="14" font-family="Georgia,serif">${genre.icon}</text>
      ${symbolSvg}
      <circle cx="${w/2}" cy="${h-11}" r="2.5" fill="rgba(247,226,180,.62)"/>
    </g>
  </svg>`;
}
