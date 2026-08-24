const UINT32_SCALE = 2 ** 32;
const DEFAULT_SEED = 12345;

export class SeededRandom {
  constructor(seed = DEFAULT_SEED) {
    this.seed = SeededRandom.normalizeSeed(seed);
    this.state = this.seed;
  }

  static normalizeSeed(seed) {
    if (typeof seed === 'string') {
      let hash = 2166136261;
      for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
      return hash >>> 0 || DEFAULT_SEED;
    }
    const value = Math.floor(Number(seed));
    return Number.isFinite(value) ? (value >>> 0) || DEFAULT_SEED : DEFAULT_SEED;
  }

  next() {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / UINT32_SCALE;
  }

  range(min, max) {
    const low = Number(min);
    const high = Number(max);
    if (!Number.isFinite(low) || !Number.isFinite(high)) throw new TypeError('range() requires finite bounds');
    if (high < low) throw new RangeError('range() max must be >= min');
    return low + this.next() * (high - low);
  }

  int(min, max) {
    const low = Math.ceil(Number(min));
    const high = Math.floor(Number(max));
    if (!Number.isFinite(low) || !Number.isFinite(high) || high < low) throw new RangeError('int() requires valid bounds');
    return Math.floor(low + this.next() * (high - low + 1));
  }

  pick(items) {
    if (!Array.isArray(items) || items.length === 0) return undefined;
    return items[this.int(0, items.length - 1)];
  }

  shuffle(items) {
    if (!Array.isArray(items)) return [];
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const other = this.int(0, index);
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }

  chance(probability) {
    const value = Number(probability);
    if (!Number.isFinite(value) || value <= 0) return false;
    if (value >= 1) return true;
    return this.next() < value;
  }

  generate(count, generator) {
    if (!Number.isInteger(count) || count < 0) throw new RangeError('generate() count must be a non-negative integer');
    if (typeof generator !== 'function') throw new TypeError('generate() requires a generator function');
    return Array.from({ length: count }, () => generator(this));
  }
}

export function generateSeed(level) {
  return SeededRandom.normalizeSeed(`library:${Math.max(1, Math.floor(Number(level) || 1))}`);
}
