export class SeededRandom {
  constructor(seed) {
    this.seed = this.normalizeSeed(seed);
    this.state = this.seed;
  }

  normalizeSeed(seed) {
    if (typeof seed === 'string') {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash) || 12345;
    }
    
    return Math.abs(Math.floor(seed)) || 12345;
  }

  next() {
    // Using xorshift for better randomness
    let x = this.state;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 4294967296;
  }

  range(min, max) {
    return min + this.next() * (max - min);
  }

  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }

  pick(arr) {
    if (!arr || arr.length === 0) {
      return undefined;
    }
    return arr[this.int(0, arr.length - 1)];
  }

  shuffle(arr) {
    const a = [...arr];
    
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    
    return a;
  }

  chance(p) {
    return this.next() < p;
  }

  // Generate multiple values
  generate(count, generator) {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(generator(this));
    }
    return results;
  }
}

export function generateSeed(level) {
  // Use a more complex seed generation
  const base = ((level * 9301 + 49297) % 233280) + 12345;
  return base + (level << 8);
}