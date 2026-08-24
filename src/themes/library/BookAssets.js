export const BOOK_COLORS = {
  red:    { name: 'Красные',    spine: '#8b2323', cover: '#a52a2a', edge: '#f5e6d3' },
  blue:   { name: 'Синие',      spine: '#1e3a5f', cover: '#2e4a6f', edge: '#f5e6d3' },
  green:  { name: 'Зелёные',    spine: '#1a4a1a', cover: '#2d5a2d', edge: '#f5e6d3' },
  yellow: { name: 'Жёлтые',     spine: '#b8860b', cover: '#d4a017', edge: '#f5e6d3' },
  purple: { name: 'Фиолетовые', spine: '#4b0082', cover: '#5a189a', edge: '#f5e6d3' },
  brown:  { name: 'Коричневые', spine: '#5c4033', cover: '#6b4e31', edge: '#f5e6d3' },
  black:  { name: 'Тёмные',     spine: '#2a2a2a', cover: '#3a3a3a', edge: '#e0d5c5' },
  white:  { name: 'Светлые',    spine: '#d0d0d0', cover: '#e8e8e8', edge: '#f5f0e6' },
};

export const BOOK_SIZES = {
  small:  { name: 'Маленькие', height: 60, width: 44 },
  medium: { name: 'Средние',   height: 72, width: 52 },
  large:  { name: 'Большие',   height: 84, width: 60 },
};

export const BOOK_GENRES = {
  history:    { name: 'История',    icon: '⚔' },
  science:    { name: 'Наука',      icon: '🔬' },
  fiction:    { name: 'Фантастика', icon: '✦' },
  poetry:     { name: 'Поэзия',     icon: '✒' },
  adventure:  { name: 'Приключения',icon: '⚓' },
  mystery:    { name: 'Детектив',   icon: '🔍' },
};

export const BOOK_SYMBOLS = {
  star:    { name: 'Звезда',    icon: '★' },
  moon:    { name: 'Луна',      icon: '☾' },
  crown:   { name: 'Корона',    icon: '♔' },
  leaf:    { name: 'Лист',      icon: '❦' },
  diamond: { name: 'Алмаз',     icon: '◆' },
  none:    { name: 'Без знака', icon: '' },
};

export const BOOK_THICKNESS = {
  thin:    { name: 'Тонкие',    widthMod: 0.8 },
  normal:  { name: 'Обычные',   widthMod: 1.0 },
  thick:   { name: 'Толстые',   widthMod: 1.3 },
};

export function createBookSVG(book) {
  const color = BOOK_COLORS[book.color];
  const size = BOOK_SIZES[book.size];
  const thick = BOOK_THICKNESS[book.thickness];
  const genre = BOOK_GENRES[book.genre];
  const symbol = BOOK_SYMBOLS[book.symbol];
  const w = Math.round(size.width * thick.widthMod);
  const h = size.height;

  const symbolSvg = symbol.icon
    ? `<text x="${w/2}" y="${h/2 + 4}" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="${Math.min(w * 0.5, 18)}" font-family="serif">${symbol.icon}</text>`
    : '';

  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="filter:drop-shadow(2px 3px 4px rgba(0,0,0,0.4)); display:block;">
      <defs>
        <linearGradient id="spineGrad${book.uid}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${color.spine}"/>
          <stop offset="50%" stop-color="${color.cover}"/>
          <stop offset="100%" stop-color="${color.spine}"/>
        </linearGradient>
        <linearGradient id="edgeGrad${book.uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color.edge}"/>
          <stop offset="100%" stop-color="#e0d5c5"/>
        </linearGradient>
      </defs>
      <!-- Pages edge (right side) -->
      <rect x="${w - 6}" y="2" width="4" height="${h - 4}" rx="1" fill="url(#edgeGrad${book.uid})"/>
      <!-- Spine/Cover -->
      <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="3" fill="url(#spineGrad${book.uid})"/>
      <!-- Spine highlight -->
      <rect x="4" y="4" width="${Math.max(4, w * 0.15)}" height="${h - 8}" rx="2" fill="rgba(255,255,255,0.08)"/>
      <!-- Genre icon -->
      <text x="${w/2}" y="${h - 10}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="${Math.min(w * 0.35, 12)}">${genre.icon}</text>
      <!-- Symbol -->
      ${symbolSvg}
      <!-- Top edge highlight -->
      <rect x="3" y="3" width="${w - 6}" height="2" rx="1" fill="rgba(255,255,255,0.15)"/>
    </svg>
  `;
}
