export class SoundManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.sounds = {};
    this.paused = false;
  }

  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  pauseAudio() {
    this.paused = true;
    if (this.ctx) {
      this.ctx.suspend();
    }
  }

  resumeAudio() {
    this.paused = false;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(freq, duration, type = 'sine', vol = 0.08) {
    if (!this.enabled || !this.ctx || this.paused) return;
    
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Silently fail audio
    }
  }

  playPick() {
    this.play(350, 0.08, 'sine', 0.06);
  }

  playCorrect() {
    this.play(440, 0.12, 'sine', 0.08);
    setTimeout(() => this.play(550, 0.12, 'sine', 0.08), 60);
  }

  playWrong() {
    this.play(180, 0.25, 'sawtooth', 0.04);
  }

  playCombo() {
    this.play(660, 0.15, 'sine', 0.08);
    setTimeout(() => this.play(880, 0.15, 'sine', 0.08), 80);
  }

  playLevelComplete() {
    [440, 550, 660, 880].forEach((f, i) => {
      setTimeout(() => this.play(f, 0.25, 'sine', 0.1), i * 100);
    });
  }

  playTimerWarning() {
    this.play(660, 0.08, 'square', 0.04);
  }
}