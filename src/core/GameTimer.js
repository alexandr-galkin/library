export class GameTimer {
  constructor({ onTick = () => {}, onComplete = () => {}, scheduler = globalThis } = {}) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.scheduler = scheduler;
    this.remaining = 0;
    this.interval = null;
    this.paused = false;
    this.completed = false;
  }

  start(seconds) {
    this.stop();
    this.remaining = Math.max(0, Math.floor(Number(seconds) || 0));
    this.paused = false;
    this.completed = false;
    this.emitTick();
    if (this.remaining === 0) return this.complete();
    this.interval = this.scheduler.setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (this.paused || this.completed) return;
    this.remaining = Math.max(0, this.remaining - 1);
    this.emitTick();
    if (this.remaining === 0) this.complete();
  }

  pause() { if (this.interval && !this.completed) this.paused = true; }
  resume() { if (this.interval && !this.completed) this.paused = false; }

  complete() {
    if (this.completed) return;
    this.completed = true;
    this.stop();
    this.onComplete?.();
  }

  stop() {
    if (this.interval !== null) {
      this.scheduler.clearInterval(this.interval);
      this.interval = null;
    }
    this.paused = false;
  }

  emitTick() { this.onTick?.(this.remaining); }

  destroy() {
    this.stop();
    this.onTick = null;
    this.onComplete = null;
  }
}
