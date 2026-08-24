export const BOOK_COLORS = {
  red:{name:'Бордовые',spine:'#632d2b',cover:'#7b3a36',edge:'#e8dcc2'},
  blue:{name:'Тёмно-синие',spine:'#263b52',cover:'#344f6b',edge:'#e8dcc2'},
  green:{name:'Тёмно-зелёные',spine:'#334b38',cover:'#405e45',edge:'#e8dcc2'},
  yellow:{name:'Охристые',spine:'#86652d',cover:'#a47d38',edge:'#e8dcc2'},
  purple:{name:'Сливовые',spine:'#4a344e',cover:'#60415f',edge:'#e8dcc2'},
  brown:{name:'Коричневые',spine:'#4b3020',cover:'#64412b',edge:'#e8dcc2'},
  black:{name:'Тёмные',spine:'#22201d',cover:'#302d28',edge:'#d8ccb2'},
  white:{name:'Светлые',spine:'#b8aa8d',cover:'#d4c6a7',edge:'#f0e7d2'},
};

export const BOOK_SIZES={small:{name:'Маленькие',height:60,width:44},medium:{name:'Средние',height:72,width:52},large:{name:'Большие',height:84,width:60}};
export const BOOK_GENRES={history:{name:'История',icon:'⚔'},science:{name:'Наука',icon:'✧'},fiction:{name:'Фантастика',icon:'✦'},poetry:{name:'Поэзия',icon:'✒'},adventure:{name:'Приключения',icon:'⚓'},mystery:{name:'Детектив',icon:'◇'}};
export const BOOK_SYMBOLS={star:{name:'Звезда',icon:'★'},moon:{name:'Луна',icon:'☾'},crown:{name:'Корона',icon:'♔'},leaf:{name:'Лист',icon:'❦'},diamond:{name:'Алмаз',icon:'◆'},none:{name:'Без знака',icon:''}};
export const BOOK_THICKNESS={thin:{name:'Тонкие',widthMod:.8},normal:{name:'Обычные',widthMod:1},thick:{name:'Толстые',widthMod:1.3}};

export function createBookSVG(book){
  const color=BOOK_COLORS[book.color],size=BOOK_SIZES[book.size],thick=BOOK_THICKNESS[book.thickness],genre=BOOK_GENRES[book.genre],symbol=BOOK_SYMBOLS[book.symbol];
  const w=Math.round(size.width*thick.widthMod),h=size.height;
  const symbolSvg=symbol.icon?`<text x="${w/2}" y="${h/2+4}" text-anchor="middle" fill="rgba(244,228,190,.72)" font-size="${Math.min(w*.5,18)}" font-family="Georgia,serif">${symbol.icon}</text>`:'';
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;filter:drop-shadow(2px 5px 5px rgba(0,0,0,.5));">
    <defs><linearGradient id="spineGrad${book.uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${color.spine}"/><stop offset="50%" stop-color="${color.cover}"/><stop offset="100%" stop-color="${color.spine}"/></linearGradient><linearGradient id="edgeGrad${book.uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color.edge}"/><stop offset="100%" stop-color="#cbbd9f"/></linearGradient></defs>
    <rect x="${w-6}" y="2" width="4" height="${h-4}" rx="1" fill="url(#edgeGrad${book.uid})"/>
    <rect x="2" y="2" width="${w-4}" height="${h-4}" rx="2" fill="url(#spineGrad${book.uid})"/>
    <rect x="4" y="4" width="${Math.max(4,w*.15)}" height="${h-8}" rx="2" fill="rgba(255,238,198,.08)"/>
    <rect x="6" y="8" width="${w-12}" height="2" fill="rgba(20,10,5,.22)"/>
    <rect x="6" y="${h-11}" width="${w-12}" height="1" fill="rgba(244,220,171,.25)"/>
    <text x="${w/2}" y="${h-16}" text-anchor="middle" fill="rgba(244,228,190,.5)" font-size="${Math.min(w*.35,12)}" font-family="Georgia,serif">${genre.icon}</text>
    ${symbolSvg}
  </svg>`;
}
