const CAPACITY = 4;
const MAX_SHUFFLE_ATTEMPTS = 12;

export class SortPuzzleGenerator {
  static generate({ rng, colors, shelves, theme, levelNumber, difficulty }) {
    if (!rng || typeof rng.pick !== 'function') throw new TypeError('SortPuzzleGenerator requires a compatible RNG');
    if (!theme?.getAllBookProperties) throw new TypeError('SortPuzzleGenerator requires a theme');
    const palette = theme.getAllBookProperties().colors.slice(0, colors);
    if (palette.length < colors) throw new Error(`Theme has only ${palette.length} colors, need ${colors}`);
    const shelfCount = Math.max(colors + 1, Math.min(8, shelves));

    for (let attempt = 0; attempt < MAX_SHUFFLE_ATTEMPTS; attempt += 1) {
      const stacks = palette.map(color => Array(CAPACITY).fill(color));
      while (stacks.length < shelfCount) stacks.push([]);
      this.reverseShuffle(stacks, rng, colors * (12 + difficulty * 4));
      if (this.isInteresting(stacks, colors)) return this.buildLevel(stacks, palette, theme, levelNumber, difficulty);
    }

    const stacks = palette.map(color => Array(CAPACITY).fill(color));
    while (stacks.length < shelfCount) stacks.push([]);
    this.reverseShuffle(stacks, rng, colors * 18);
    return this.buildLevel(stacks, palette, theme, levelNumber, difficulty);
  }

  static reverseShuffle(stacks, rng, moves) {
    // Construct the puzzle by applying the exact inverse of a legal move.
    // Therefore reversing these generated moves is always a valid solution.
    for (let move = 0; move < moves; move += 1) {
      const destinations = stacks.map((stack, index) => ({ stack, index })).filter(({ stack }) => stack.length > 0);
      if (!destinations.length) break;
      const { stack: destination, index: d } = rng.pick(destinations);
      const color = destination[destination.length - 1];
      const run = this.topRun(destination);
      const aMax = destination.length === run ? run : run >= 2 ? run - 1 : 0;
      if (!aMax) continue;
      const amount = rng.int ? rng.int(1, aMax) : 1;

      const sources = stacks.map((stack, index) => ({ stack, index })).filter(({ stack, index }) => {
        if (index === d || stack.length + amount > CAPACITY) return false;
        return stack.length === 0 || stack[stack.length - 1] !== color;
      });
      if (!sources.length) continue;
      const { stack: source } = rng.pick(sources);
      for (let i = 0; i < amount; i += 1) source.push(destination.pop());
    }
  }

  static topRun(stack) {
    if (!stack.length) return 0;
    const color = stack[stack.length - 1];
    let count = 0;
    for (let i = stack.length - 1; i >= 0 && stack[i] === color; i -= 1) count += 1;
    return count;
  }

  static isInteresting(stacks, colors) {
    const mixed = stacks.filter(stack => new Set(stack).size > 1).length;
    const solved = stacks.filter(stack => stack.length === CAPACITY && new Set(stack).size === 1).length;
    const empty = stacks.filter(stack => stack.length === 0).length;
    return mixed >= Math.min(2, colors) && solved < colors && empty >= 1;
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
