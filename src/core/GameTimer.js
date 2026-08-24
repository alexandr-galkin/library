export class GameTimer {
  constructor({ onTick, onComplete } = {}) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.remaining = 0;
    this.interval = null;
    this.paused = false;
  }

  start(seconds) {
    this.stop();
    this.remaining = Math.max(0, Math.floor(seconds));
    this.paused = false;
    this.emitTick();

    if (this.remaining === 0) {
      this.onComplete?.();
      return;
    }

    this.interval = setInterval(() => {
      if (this.paused) return;

      this.remaining -= 1;
      this.emitTick();

      if (this.remaining <= 0) {
        this.stop();
        this.onComplete?.();
      }
    }, 1000);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  emitTick() {
    this.onTick?.(this.remaining);
  }

  destroy() {
    this.stop();
    this.onTick = null;
    this.onComplete = null;
  }
}
