export class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.maxParticles = 200;
    this.isRunning = true;
    
    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  emit(x, y, color, count = 12) {
    if (!this.ctx) return;
    
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift(); // Remove oldest particle
      }
      
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        size: 3 + Math.random() * 4,
        color,
      });
    }
  }

  animate() {
    if (!this.isRunning) return;
    
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= p.decay;
        
        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.globalAlpha = 1;
    }
    
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.isRunning = false;
    this.particles = [];
    
    if (this.canvas) {
      window.removeEventListener('resize', () => this.resize());
    }
  }
}