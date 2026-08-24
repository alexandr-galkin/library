import { Game } from './game/Game.js';

const game = new Game();

// Background validation
setTimeout(async () => {
  try {
    console.log('Validating levels 1–1000...');
    const { ThemeManager } = await import('./themes/ThemeManager.js');
    const { ProceduralLevelGenerator } = await import('./generator/ProceduralLevelGenerator.js');
    const { LevelValidator } = await import('./generator/LevelValidator.js');
    
    const tm = new ThemeManager();
    let passed = 0, failed = 0;
    
    for (let i = 1; i <= 1000; i++) {
      try {
        const level = ProceduralLevelGenerator.generate(i, tm.current);
        if (LevelValidator.validate(level)) {
          passed++;
        } else {
          failed++;
          console.error('Level', i, 'failed validation');
        }
      } catch (e) {
        failed++;
        console.error('Level', i, 'generation error:', e);
      }
    }
    
    console.log(`Validation complete: ${passed} passed, ${failed} failed`);
  } catch (e) {
    console.error('Validation failed:', e);
  }
}, 3000);