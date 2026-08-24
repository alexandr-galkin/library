import { GameState } from './GameState.js';
import { ThemeManager } from '../themes/ThemeManager.js';
import { ProceduralLevelGenerator } from '../generator/ProceduralLevelGenerator.js';
import { SoundManager } from '../audio/SoundManager.js';
import { ParticleSystem } from '../rendering/ParticleSystem.js';
import { DragController } from '../input/DragController.js';
import { GameUI } from '../ui/GameUI.js';
import { Menu } from '../ui/Menu.js';
import { Settings } from '../ui/Settings.js';
import { LevelComplete } from '../ui/LevelComplete.js';

export class Game {
  constructor() {
    this.state = new GameState();
    this.themeManager = new ThemeManager();
    this.theme = this.themeManager.current;
    this.sound = new SoundManager();
    this.particles = new ParticleSystem();
    this.drag = null;
    this.ui = null;
    this.menu = new Menu(this);
    this.settings = new Settings(this);
    this.levelComplete = new LevelComplete(this);
    
    this.currentLevel = null;
    this.combo = 0;
    this.score = 0;
    this.levelScore = 0;
    this.placed = 0;
    this.mistakes = 0;
    this.timer = null;
    this.timerInterval = null;
    this.pausedTimer = null;
    this.animations = true;
    this.isTransitioning = false;
    this.isPaused = false;
    this.isInGame = false;
    this.cleanupFunctions = [];

    this.app = document.getElementById('app');
    
    // ВАЖНО: Добавляем стили сразу при инициализации
    this.theme.injectStyles();
    
    this.app.appendChild(this.menu.container);
    this.app.appendChild(this.settings.container);
    
    // Show menu initially
    this.menu.show();
    this.settings.hide();

    // Apply saved settings
    const s = this.state.data.settings;
    this.sound.enabled = s.sound !== false;
    this.animations = s.anim !== false;
    if (s.reduced) {
      document.body.classList.add('reduced-motion');
    }

    // Handle page visibility
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.cleanupFunctions.push(() => {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    });
  }

  handleVisibilityChange() {
    if (document.hidden && this.isInGame && !this.isTransitioning && !this.isPaused) {
      this.pauseGame();
      if (this.ui) {
        this.ui.showPauseMenu();
      }
    }
  }

  pauseGame() {
    if (this.isPaused) return;
    
    this.isPaused = true;
    
    if (this.timerInterval) {
      this.stopTimer();
      this.pausedTimer = this.timer;
    }
    
    this.sound.pauseAudio();
    
    if (this.drag) {
      this.drag.pause();
    }
  }

  resumeGame() {
    if (!this.isPaused) return;
    
    this.isPaused = false;
    
    if (this.pausedTimer !== undefined && this.currentLevel?.timeLimit) {
      this.timer = this.pausedTimer;
      this.pausedTimer = undefined;
      this.startTimer();
    }
    
    this.sound.resumeAudio();
    
    if (this.drag) {
      this.drag.resume();
    }
  }

  startGame() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.sound.init();
    this.score = 0;
    this.combo = 0;
    this.isInGame = true;
    this.isPaused = false;
    
    this.menu.hide();
    this.settings.hide();
    
    this.loadLevel(this.state.data.currentLevel);
    
    this.isTransitioning = false;
  }

  loadLevel(num) {
    try {
      this.currentLevel = ProceduralLevelGenerator.generate(num, this.theme);
      this.placed = 0;
      this.levelScore = 0;
      this.mistakes = 0;
      this.combo = 0;
      this.pausedTimer = undefined;
      this.isPaused = false;

      this.cleanupLevel();
      
      this.ui = new GameUI(this);
      this.drag = new DragController(this);

      this.ui.updateHUD(this.currentLevel.id, this.currentLevel.difficulty, this.score);
      this.ui.setRule(this.currentLevel.ruleText, this.theme.displayName);
      this.ui.renderObjects(this.currentLevel.objects, this.theme);
      this.ui.renderContainers(this.currentLevel.containers);

      if (this.currentLevel.timeLimit) {
        this.ui.showTimer(this.currentLevel.timeLimit);
        this.startTimer();
      } else {
        this.ui.hideTimer();
      }
    } catch (e) {
      console.error('Failed to load level:', e);
      this.handleLevelLoadError();
    }
  }

  handleLevelLoadError() {
    try {
      this.currentLevel = ProceduralLevelGenerator.generate(1, this.theme);
      this.loadLevel(1);
    } catch (e2) {
      console.error('Critical error loading fallback level:', e2);
      this.showMenu();
    }
  }

  cleanupLevel() {
    if (this.drag) {
      this.drag.destroy();
      this.drag = null;
    }
    if (this.ui) {
      this.ui.destroy();
      this.ui = null;
    }
    this.stopTimer();
  }

  retryLevel() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.isPaused = false;
    this.loadLevel(this.state.data.currentLevel);
    this.isTransitioning = false;
  }

  nextLevel() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.state.data.currentLevel++;
    this.state.save();
    this.loadLevel(this.state.data.currentLevel);
    this.isTransitioning = false;
  }

  startTimer() {
    this.stopTimer();
    this.timer = this.currentLevel.timeLimit;
    
    if (this.ui) {
      this.ui.updateTimer(this.timer, false);
    }
    
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;
      
      this.timer--;
      
      if (this.timer <= 0) {
        this.stopTimer();
        this.handleFail();
      } else {
        if (this.ui) {
          this.ui.updateTimer(this.timer, this.timer <= 5);
        }
        if (this.timer <= 5) {
          this.sound.playTimerWarning();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  evaluateRule(obj, rule) {
    if (!rule) return true;
    if (rule.type === 'and') return rule.rules.every(r => this.evaluateRule(obj, r));
    if (rule.type === 'or') return rule.rules.some(r => this.evaluateRule(obj, r));
    if (rule.type === 'not') return !this.evaluateRule(obj, rule.rule);
    
    const val = obj[rule.field];
    switch (rule.op) {
      case 'eq': return val === rule.value;
      case 'ne': return val !== rule.value;
      case 'gt': return val > rule.value;
      case 'lt': return val < rule.value;
      case 'in': return rule.values.includes(val);
      case 'nin': return !rule.values.includes(val);
      default: return false;
    }
  }

  handleCorrect(obj, el, containerEl) {
    if (this.isTransitioning || this.isPaused || el.classList.contains('correct')) return;
    
    this.combo++;
    const basePoints = 100;
    const comboMult = Math.min(this.combo, 10);
    const points = basePoints * comboMult;
    
    this.levelScore += points;
    this.score += points;
    this.placed++;
    
    this.ui.updateHUD(this.currentLevel.id, this.currentLevel.difficulty, this.score);
    this.ui.moveToContainer(el, containerEl);
    
    el.classList.add('correct');
    
    const rect = containerEl.getBoundingClientRect();
    this.particles.emit(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      '#c9a227',
      14
    );
    
    this.ui.showPopup(rect.left + rect.width / 2, rect.top, '+' + points);
    
    if (this.combo >= 2) this.ui.showCombo(this.combo);
    if (this.combo >= 3) {
      this.sound.playCombo();
    } else {
      this.sound.playCorrect();
    }
    
    setTimeout(() => {
      if (el.parentNode) {
        el.remove();
      }
    }, 500);
    
    if (this.placed >= this.currentLevel.objects.length) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.handleComplete();
      }, 600);
    }
  }

  handleWrong(el) {
    if (this.isPaused || el.classList.contains('correct')) return;
    
    this.combo = 0;
    this.mistakes++;
    this.ui.hideCombo();
    
    el.classList.add('shake');
    setTimeout(() => {
      el.classList.remove('shake');
    }, 400);
    
    this.sound.playWrong();
  }

  handleComplete() {
    this.stopTimer();
    this.sound.playLevelComplete();

    let timeBonus = 0;
    if (this.currentLevel.timeLimit && this.timer > 0) {
      timeBonus = this.timer * 10;
    }
    
    const accuracy = this.currentLevel.objects.length > 0
      ? Math.max(0, (this.currentLevel.objects.length - this.mistakes) / this.currentLevel.objects.length)
      : 1;
    
    const accBonus = Math.floor(accuracy * 500);
    
    this.score += timeBonus + accBonus;
    this.levelScore += timeBonus + accBonus;

    let stars = 1;
    if (this.mistakes === 0) stars = 3;
    else if (this.mistakes <= 2) stars = 2;

    this.state.data.totalScore = this.score;
    if (this.score > this.state.data.bestScore) {
      this.state.data.bestScore = this.score;
    }
    this.state.save();
    
    this.menu.render();
    
    this.particles.emit(
      window.innerWidth / 2,
      window.innerHeight / 2,
      '#e8d48b',
      30
    );
    
    this.levelComplete.show(
      this.currentLevel.id,
      this.levelScore,
      this.combo,
      this.mistakes,
      timeBonus,
      accBonus,
      stars
    );
    
    this.isTransitioning = false;
  }

  handleFail() {
    if (this.ui) {
      this.ui.showFail();
    }
    this.sound.playWrong();
  }

  showMenu() {
    this.stopTimer();
    this.cleanupLevel();
    this.isInGame = false;
    this.isPaused = false;
    
    while (this.app.firstChild) {
      this.app.removeChild(this.app.firstChild);
    }
    
    this.app.appendChild(this.menu.container);
    this.app.appendChild(this.settings.container);
    
    this.menu.render();
    this.menu.show();
    this.settings.hide();
  }

  showSettings() {
    this.menu.hide();
    this.settings.fromGame = false;
    this.settings.render();
    this.settings.show();
  }

  showSettingsFromGame() {
    this.settings.fromGame = true;
    this.settings.render();
    this.settings.show();
  }

  destroy() {
    this.cleanupLevel();
    this.cleanupFunctions.forEach(fn => fn());
    this.cleanupFunctions = [];
    this.particles.destroy();
    this.menu.destroy();
    this.settings.destroy();
    this.levelComplete.destroy();
  }
}