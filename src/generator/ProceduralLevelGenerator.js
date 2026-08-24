import { SeededRandom, generateSeed } from './SeededRandom.js';
import { DifficultyManager } from './DifficultyManager.js';
import { RuleGenerator } from './RuleGenerator.js';
import { ContainerGenerator } from './ContainerGenerator.js';
import { ObjectGenerator } from './ObjectGenerator.js';
import { LevelValidator } from './LevelValidator.js';

export class ProceduralLevelGenerator {
  static generate(levelNum, theme) {
    const seed = generateSeed(levelNum);
    const rng = new SeededRandom(seed);
    const difficulty = DifficultyManager.getDifficulty(levelNum);
    const labels = theme.getBookLabels();

    // Generate main rule
    const mainRule = RuleGenerator.generate(rng, difficulty, labels);
    
    // Generate containers
    const containers = ContainerGenerator.generate(rng, difficulty, mainRule, theme);
    
    // Generate objects
    const objectCount = DifficultyManager.getObjectCount(difficulty, levelNum, rng);
    const objects = ObjectGenerator.generate(rng, objectCount, theme, containers, difficulty);

    // Generate modifiers
    const modChances = DifficultyManager.getModifierChance(difficulty);
    const modifiers = [];
    
    if (rng.chance(modChances.timer)) modifiers.push('timer');
    if (rng.chance(modChances.forbidden)) modifiers.push('forbidden');
    if (rng.chance(modChances.decoy)) modifiers.push('decoy');
    if (rng.chance(modChances.moving)) modifiers.push('moving');
    if (rng.chance(modChances.chaos)) modifiers.push('chaos');
    if (rng.chance(modChances.hidden)) modifiers.push('hidden');

    let timeLimit = null;
    if (modifiers.includes('timer')) {
      timeLimit = Math.max(15, 30 + objects.length * 5 - difficulty * 3);
    }

    const level = {
      id: levelNum,
      difficulty,
      theme: theme.name,
      rule: mainRule,
      ruleText: this.formatTask(mainRule, labels),
      objects,
      containers,
      modifiers,
      timeLimit,
      seed,
    };

    // Try to validate, with fallback attempts
    if (!LevelValidator.validate(level)) {
      // Try with different seed
      for (let attempt = 1; attempt <= 10; attempt++) {
        const altSeed = seed + attempt * 1000;
        const altRng = new SeededRandom(altSeed);
        
        const altObjects = ObjectGenerator.generate(
          altRng,
          objectCount,
          theme,
          containers,
          difficulty
        );
        
        const altLevel = {
          ...level,
          objects: altObjects,
          seed: altSeed,
        };
        
        if (LevelValidator.validate(altLevel)) {
          return altLevel;
        }
      }
      
      // Last resort: generate a simple valid level
      return this.generateSimpleLevel(levelNum, theme, difficulty);
    }
    
    return level;
  }

  static generateSimpleLevel(levelNum, theme, difficulty) {
    const labels = theme.getBookLabels();
    const simpleRule = {
      field: 'color',
      op: 'eq',
      value: 'red',
      valueLabel: labels.color.red,
    };
    
    const containers = [
      {
        id: 'main',
        label: labels.color.red,
        rule: simpleRule,
        type: 'normal',
      },
      {
        id: 'c1',
        label: labels.color.blue,
        rule: {
          field: 'color',
          op: 'eq',
          value: 'blue',
          valueLabel: labels.color.blue,
        },
        type: 'normal',
      },
    ];
    
    const objects = [
      this.createBook('red', labels),
      this.createBook('red', labels),
      this.createBook('blue', labels),
      this.createBook('blue', labels),
    ];
    
    return {
      id: levelNum,
      difficulty,
      theme: theme.name,
      rule: simpleRule,
      ruleText: 'ЦВЕТ: КРАСНЫЕ',
      objects,
      containers,
      modifiers: [],
      timeLimit: null,
      seed: levelNum,
    };
  }

  static createBook(color, labels) {
    return {
      uid: `book_${Date.now()}_${Math.random()}`,
      type: 'book',
      color,
      size: 'medium',
      genre: 'fiction',
      symbol: 'none',
      thickness: 'normal',
    };
  }

  static formatTask(rule, labels) {
    if (!rule) return 'РАЗЛОЖИ ВСЁ';
    
    if (rule.type === 'and') {
      const parts = rule.rules.map(r => this.formatTask(r, labels));
      return 'РАЗЛОЖИ: ' + parts.join(' + ');
    }
    
    if (rule.type === 'or') {
      const parts = rule.rules.map(r => this.formatTask(r, labels));
      return 'РАЗЛОЖИ: ' + parts.join(' / ');
    }
    
    if (rule.type === 'not') {
      return 'РАЗЛОЖИ: НЕ ' + this.formatTask(rule.rule, labels);
    }
    
    const fieldNames = {
      color: 'ЦВЕТ',
      size: 'РАЗМЕР',
      genre: 'ЖАНР',
      symbol: 'ЗНАК',
      thickness: 'ТОЛЩИНА',
    };
    
    const field = fieldNames[rule.field] || rule.field;
    const val = rule.valueLabel || labels[rule.field]?.[rule.value] || rule.value;
    
    if (rule.op === 'eq') return `${field}: ${val.toUpperCase()}`;
    if (rule.op === 'ne') return `${field} ≠ ${val.toUpperCase()}`;
    return `${field}: ${val.toUpperCase()}`;
  }
}