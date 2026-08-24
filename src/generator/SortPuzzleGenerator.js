const CAPACITY = 4;
const MAX_SHUFFLE_ATTEMPTS = 12;

export class SortPuzzleGenerator {
  static generate({ rng, colors, shelves, theme, levelNumber, difficulty }) {
    if (!rng || typeof rng.pick !== 'function' || typeof rng.shuffle !== 'function') throw new TypeError('SortPuzzleGenerator requires a compatible RNG');
    if (!theme?.getAllBookProperties) throw new TypeError('SortPuzzleGenerator requires a theme');
    const palette = theme.getAllBookProperties().colors.slice(0, colors);
    if (palette.length < colors) throw new Error(`Theme has only ${palette.length} colors, need ${colors}`);
    const shelfCount = Math.max(colors + 1, shelves);

    for (let attempt = 0; attempt < MAX_SHUFFLE_ATTEMPTS; attempt += 1) {
      const stacks = palette.map(color => Array(CAPACITY).fill(color));
      while (stacks.length < shelfCount) stacks.push([]);
      const moves = Math.max(colors * (6 + difficulty * 2), 18);
      this.reverseShuffle(stacks, rng, moves);
      if (this.isInteresting(stacks, colors)) {
        return this.buildLevel(stacks, palette, theme, levelNumber, difficulty);
      }
    }

    const stacks = palette.map(color => Array(CAPACITY).fill(color));
    while (stacks.length < shelfCount) stacks.push([]);
    this.reverseShuffle(stacks, rng, colors * 8);
    return this.buildLevel(stacks, palette, theme, levelNumber, difficulty);
  }

  static reverseShuffle(stacks, rng, moves) {
    // We start solved and perform reversible "unpacking" moves. The source must
    // still expose the same color after the move, so the exact reverse is legal.
    for (let move = 0; move < moves; move += 1) {
      const candidates = [];
      for (let source = 0; source < stacks.length; source += 1) {
        const src = stacks[source];
        if (src.length < 2) continue;
        const color = src[src.length - 1];
        if (src[src.length - 2] !== color) continue;
        for (let target = 0; target < stacks.length; target += 1) {
          if (target === source || stacks[target].length >= CAPACITY) continue;
          if (stacks[target].length && stacks[target][stacks[target].length - 1] === color) continue;
          candidates.push([source, target]);
        }
      }
      if (!candidates.length) break;
      const [source, target] = rng.pick(candidates);
      stacks[target].push(stacks[source].pop());
    }
  }

  static isInteresting(stacks, colors) {
    const mixed = stacks.filter(stack => new Set(stack).size > 1).length;
    const nonEmpty = stacks.filter(Boolean).filter(stack => stack.length > 0).length;
    const solved = stacks.filter(stack => stack.length === CAPACITY && new Set(stack).size === 1).length;
    return mixed >= Math.min(2, colors) && nonEmpty >= colors && solved < colors;
  }

  static buildLevel(stacks, palette, theme, levelNumber, difficulty) {
    const props = theme.getAllBookProperties();
    const objects = [];
    const containers = stacks.map((stack, index) => ({
      id: `shelf_${index}`,
      type: stack.length === 0 ? 'empty' : 'normal',
      capacity: CAPACITY,
      index,
      label: stack.length === 0 ? 'СВОБОДНАЯ ПОЛКА' : `ПОЛКА ${index + 1}`,
      color: stack[stack.length - 1] ?? null,
      items: [],
    }));

    stacks.forEach((stack, shelfIndex) => {
      stack.forEach((color, depth) => {
        const object = {
          uid: `book_${levelNumber}_${shelfIndex}_${depth}`,
          type: 'book',
          color,
          size: props.sizes[depth % props.sizes.length],
          genre: props.genres[depth % props.genres.length],
          symbol: props.symbols[palette.indexOf(color) % props.symbols.length],
          thickness: props.thicknesses[depth % props.thicknesses.length],
          shelfId: `shelf_${shelfIndex}`,
          depth,
        };
        objects.push(object);
        containers[shelfIndex].items.push(object.uid);
      });
    });

    return {
      id: levelNumber,
      difficulty,
      theme: theme.name,
      mode: 'book-sort',
      capacity: CAPACITY,
      colorCount: palette.length,
      shelfCount: containers.length,
      colors: palette,
      containers,
      objects,
      rule: { type: 'sort', field: 'color', op: 'group' },
      ruleText: 'СОБЕРИ КАЖДЫЙ ЦВЕТ НА ОДНОЙ ПОЛКЕ',
      modifiers: [],
      timeLimit: null,
      seed: null,
      moves: 0,
    };
  }
}

export { CAPACITY as SORT_CAPACITY };
