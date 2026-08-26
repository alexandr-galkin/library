export function pointInRect(x, y, rect) {
  return Number.isFinite(x) && Number.isFinite(y)
    && x >= rect.left && x <= rect.right
    && y >= rect.top && y <= rect.bottom;
}
