import { GameStatus } from '../core/GameStatus.js';

export class GameSession {
  constructor({ state, stats, timer, sound, generateLevel, onLevelLoaded, onComplete, onFail } = {}) {
    if (!state?.data || !stats || !timer || !sound || typeof generateLevel !== 'function') {
      throw new TypeError('GameSession requires state, stats, timer, sound and generateLevel');
    }
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
    if (this.active || this.transitioning) return false;
    this.transitioning = true;
    try {
      this.active = true;
      this.status = GameStatus.PLAYING;
      this.stats.totalScore = 0;
      this.load(this.state.data.currentLevel);
      return true;
    } catch (error) {
      this.active = false;
      this.status = GameStatus.MENU;
      this.level = null;
      this.timer.stop();
      throw error;
    } finally {
      this.transitioning = false;
    }
  }

  load(levelNumber) {
    this.timer.stop();
    const level = this.generateLevel(levelNumber);
    if (!level || typeof level !== 'object') throw new Error(`Level generator returned an invalid level: ${levelNumber}`);
    this.level = level;
    this.stats.resetLevel();
    this.status = GameStatus.PLAYING;
    this.onLevelLoaded?.(this.level);
    if (this.level.timeLimit) this.timer.start(this.level.timeLimit);
    return this.level;
  }

  retry() {
    if (!this.active || this.transitioning || this.status === GameStatus.COMPLETING) return false;
    this.transitioning = true;
    try { this.load(this.state.data.currentLevel); return true; }
    finally { this.transitioning = false; }
  }

  next() {
    if (!this.active || this.transitioning || !this.isCompleting) return false;
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
    this.transitioning = false;
    return true;
  }

  fail() {
    if (!this.isPlaying) return false;
    this.status = GameStatus.FAILED;
    this.timer.stop();
    this.sound.pauseAudio();
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
