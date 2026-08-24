export class GameTimer {
  constructor({ onTick = () => {}, onComplete = () => {}, scheduler = globalThis, intervalMs = 1000 } = {}) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.scheduler = scheduler;
    this.intervalMs = Math.max(1, Math.floor(Number(intervalMs) || 1000));
    this.remaining = 0;
    this.interval = null;
    this.paused = false;
    this.completed = false;
    this.destroyed = false;
  }

  start(seconds) {
    if (this.destroyed) return;
    this.stop();
    this.remaining = Math.max(0, Math.floor(Number(seconds) || 0));
    this.paused = false;
    this.completed = false;
    this.emitTick();
    if (this.remaining === 0) return this.complete();
    this.interval = this.scheduler.setInterval(() => this.tick(), this.intervalMs);
  }

  tick() {
    if (this.destroyed || this.paused || this.completed) return;
    this.remaining = Math.max(0, this.remaining - 1);
    this.emitTick();
    if (this.remaining === 0) this.complete();
  }

  pause() {
    if (!this.destroyed && this.interval !== null && !this.completed) this.paused = true;
  }

  resume() {
    if (!this.destroyed && this.interval !== null && !this.completed) this.paused = false;
  }

  complete() {
    if (this.destroyed || this.completed) return;
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

  emitTick() {
    this.onTick?.(this.remaining);
  }

  destroy() {
    if (this.destroyed) return;
    this.stop();
    this.destroyed = true;
    this.onTick = null;
    this.onComplete = null;
  }
}
