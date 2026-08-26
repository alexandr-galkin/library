export class SoundManager {
  constructor({ windowRef = globalThis } = {}) {
    this.window = windowRef;
    this.enabled = true;
    this.ctx = null;
    this.paused = false;
    this.timeouts = new Set();
  }

  init() {
    if (!this.ctx) {
      try {
        const AudioContext = this.window.AudioContext || this.window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();
      } catch (error) {
        console.warn('Web Audio API is not supported:', error);
        return;
      }
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  pauseAudio() {
    this.paused = true;
    if (this.ctx?.state === 'running') void this.ctx.suspend();
  }

  resumeAudio() {
    this.paused = false;
    if (this.ctx?.state === 'suspended') void this.ctx.resume();
  }

  play(freq, duration, type = 'sine', volume = 0.08) {
    if (!this.enabled || !this.ctx || this.paused) return;
    if (!Number.isFinite(freq) || !Number.isFinite(duration) || duration <= 0) return;

    try {
      const now = this.ctx.currentTime;
      const oscillator = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(Math.max(0.001, volume), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.connect(gain);
      gain.connect(this.ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  schedule(callback, delay) {
    const timeout = this.window.setTimeout(() => {
      this.timeouts.delete(timeout);
      callback();
    }, delay);
    this.timeouts.add(timeout);
    return timeout;
  }

  playPick() { this.play(350, 0.08, 'sine', 0.06); }

  playCorrect() {
    this.play(440, 0.12, 'sine', 0.08);
    this.schedule(() => this.play(550, 0.12, 'sine', 0.08), 60);
  }

  playWrong() { this.play(180, 0.25, 'sawtooth', 0.04); }

  playLevelComplete() {
    [440, 550, 660, 880].forEach((frequency, index) => {
      this.schedule(() => this.play(frequency, 0.25, 'sine', 0.1), index * 100);
    });
  }

  destroy() {
    for (const timeout of this.timeouts) this.window.clearTimeout(timeout);
    this.timeouts.clear();
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
    this.paused = false;
  }
}
