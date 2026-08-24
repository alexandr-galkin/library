export class ParticleSystem {
  constructor({ documentRef = document, windowRef = globalThis, random = Math.random } = {}) {
    this.document = documentRef;
    this.window = windowRef;
    this.random = random;
    this.canvas = this.document.getElementById('particles');
    this.ctx = this.canvas?.getContext('2d') ?? null;
    this.particles = [];
    this.maxParticles = 200;
    this.isRunning = false;
    this.animationFrame = null;
    this.onResize = () => this.resize();

    if (this.canvas) {
      this.resize();
      this.window.addEventListener('resize', this.onResize);
      this.isRunning = true;
      this.animate();
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.window.innerWidth;
    this.canvas.height = this.window.innerHeight;
  }

  emit(x, y, color, count = 12) {
    if (!this.ctx || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const amount = Math.max(0, Math.floor(Number(count) || 0));
    for (let i = 0; i < amount; i += 1) {
      if (this.particles.length >= this.maxParticles) this.particles.shift();
      this.particles.push({
        x, y,
        vx: (this.random() - 0.5) * 8,
        vy: (this.random() - 0.5) * 8 - 2,
        life: 1,
        decay: 0.02 + this.random() * 0.02,
        size: 3 + this.random() * 4,
        color,
      });
    }
  }

  animate = () => {
    if (!this.isRunning || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let index = this.particles.length - 1; index >= 0; index -= 1) {
      const particle = this.particles[index];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.15;
      particle.life -= particle.decay;
      if (particle.life <= 0) {
        this.particles.splice(index, 1);
        continue;
      }
      this.ctx.globalAlpha = particle.life;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
    this.animationFrame = this.window.requestAnimationFrame(this.animate);
  };

  destroy() {
    this.isRunning = false;
    this.particles = [];
    if (this.animationFrame !== null) this.window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
    if (this.canvas) this.window.removeEventListener('resize', this.onResize);
  }
}
