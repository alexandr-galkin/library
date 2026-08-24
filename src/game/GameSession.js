import { GameStatus } from '../core/GameStatus.js';

export class GameSession {
  constructor({ state, stats, timer, sound, generateLevel, onLevelLoaded, onComplete, onFail } = {}) {
    this.state = state;
    this.stats = stats;
    this.timer = timer;
    this.sound = sound;
    this.generateLevel = generateLevel;
    this.onLevelLoaded = onLevelLoaded;
    this.onComplete = onComplete;
    this.onFail = onFail;
    this.level = null;
    this.status = GameStatus.MENU;
    this.transitioning = false;
    this.active = false;
  }

  get isPaused() { return this.status === GameStatus.PAUSED; }
  get isPlaying() { return this.status === GameStatus.PLAYING; }
  get isCompleting() { return this.status === GameStatus.COMPLETING; }

  start() {
    if (this.transitioning) return false;
    this.transitioning = true;
    this.active = true;
    this.status = GameStatus.PLAYING;
    this.stats.totalScore = 0;
    this.load(this.state.data.currentLevel);
    this.transitioning = false;
    return true;
  }

  load(levelNumber) {
    this.timer.stop();
    this.level = this.generate(levelNumber);
    this.stats.resetLevel();
    this.status = GameStatus.PLAYING;
    this.onLevelLoaded?.(this.level);
    if (this.level.timeLimit) this.timer.start(this.level.timeLimit);
    return this.level;
  }

  retry() {
    if (!this.active || this.transitioning) return false;
    this.transitioning = true;
    try { this.load(this.state.data.currentLevel); return true; }
    finally { this.transitioning = false; }
  }

  next() {
    if (!this.active || this.transitioning) return false;
    this.transitioning = true;
    try {
      this.state.data.currentLevel += 1;
      this.state.save();
      this.load(this.state.data.currentLevel);
      return true;
    } finally { this.transitioning = false; }
  }

  pause() {
    if (!this.active || !this.isPlaying) return false;
    this.status = GameStatus.PAUSED;
    this.timer.pause();
    this.sound.pauseAudio();
    return true;
  }

  resume() {
    if (!this.isPaused) return false;
    this.status = GameStatus.PLAYING;
    this.timer.resume();
    this.sound.resumeAudio();
    return true;
  }

  markCompleting() {
    if (!this.isPlaying || this.transitioning) return false;
    this.status = GameStatus.COMPLETING;
    this.transitioning = true;
    return true;
  }

  complete() {
    if (!this.isCompleting) return false;
    this.timer.stop();
    this.onComplete?.(this.level);
    this.status = GameStatus.PLAYING;
    this.transitioning = false;
    return true;
  }

  fail() {
    if (!this.isPlaying) return false;
    this.status = GameStatus.FAILED;
    this.timer.stop();
    this.onFail?.(this.level);
    return true;
  }

  stop() {
    this.timer.stop();
    this.sound.pauseAudio();
    this.level = null;
    this.active = false;
    this.transitioning = false;
    this.status = GameStatus.MENU;
  }

  destroy() {
    this.stop();
    this.onLevelLoaded = null;
    this.onComplete = null;
    this.onFail = null;
    this.generateLevel = null;
  }
}
