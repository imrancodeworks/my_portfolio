import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   ChakraEffects
   Renders three separate canvas-based layers
   on top of the rasengan video:
     1. Floating chakra particle sparks
     2. Lightning arc bolts
   Plus static CSS layers for scanlines & vignette.
───────────────────────────────────────────── */
export default function ChakraEffects() {
  const particleRef = useRef(null);
  const lightningRef = useRef(null);

  /* ── 1. PARTICLE SPARKS ── */
  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = [
      'rgba(75,184,250,',   // rasengan blue
      'rgba(255,106,28,',   // naruto orange
      'rgba(255,255,255,',  // white spark
      'rgba(160,220,255,',  // icy blue
    ];

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2 - 0.4;
        this.radius = Math.random() * 2.5 + 0.5;
        this.alpha = Math.random() * 0.7 + 0.3;
        this.decay = Math.random() * 0.008 + 0.003;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.twinkleSpeed = Math.random() * 0.06 + 0.02;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.life = 0;
      }
      update() {
        this.life += 1;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        if (this.alpha <= 0) this.reset();
      }
      draw() {
        const twinkle = Math.sin(this.life * this.twinkleSpeed + this.twinkleOffset) * 0.3 + 0.7;
        const a = Math.max(0, this.alpha * twinkle);
        // glow halo
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
        grd.addColorStop(0, this.color + a + ')');
        grd.addColorStop(1, this.color + '0)');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        // core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.min(1, a * 1.5) + ')';
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 120 }, () => new Particle());

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // spawn a few fresh particles every frame from the center-bottom area
      for (let i = 0; i < 2; i++) {
        const p = particles[Math.floor(Math.random() * particles.length)];
        if (p.alpha <= 0) p.reset();
      }
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ── 2. LIGHTNING ARCS ── */
  useEffect(() => {
    const canvas = lightningRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Lightning {
      constructor() { this.reset(); }
      reset() {
        this.alpha = 0;
        this.life = 0;
        this.maxLife = Math.random() * 18 + 8;
        this.delay = Math.random() * 180 + 60;
        this.timer = 0;
        // random start/end near center of screen
        const cx = canvas.width * (0.3 + Math.random() * 0.4);
        const cy = canvas.height * (0.2 + Math.random() * 0.5);
        const angle = Math.random() * Math.PI * 2;
        const len = Math.random() * 200 + 80;
        this.x1 = cx;
        this.y1 = cy;
        this.x2 = cx + Math.cos(angle) * len;
        this.y2 = cy + Math.sin(angle) * len;
        this.color = Math.random() > 0.5 ? '75,184,250' : '255,106,28';
      }

      bolt(x1, y1, x2, y2, roughness, depth) {
        if (depth === 0) {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          return;
        }
        const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
        const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness;
        this.bolt(x1, y1, mx, my, roughness / 2, depth - 1);
        this.bolt(mx, my, x2, y2, roughness / 2, depth - 1);
      }

      update() {
        this.timer++;
        if (this.timer < this.delay) return;
        this.life++;
        this.alpha = Math.sin((this.life / this.maxLife) * Math.PI);
        if (this.life >= this.maxLife) this.reset();
      }

      draw() {
        if (this.alpha <= 0.01) return;
        // outer glow
        ctx.save();
        ctx.globalAlpha = this.alpha * 0.25;
        ctx.strokeStyle = `rgb(${this.color})`;
        ctx.lineWidth = 6;
        ctx.shadowColor = `rgb(${this.color})`;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        this.bolt(this.x1, this.y1, this.x2, this.y2, 60, 5);
        ctx.stroke();
        // inner core
        ctx.globalAlpha = this.alpha * 0.9;
        ctx.strokeStyle = `rgba(255,255,255,0.9)`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        this.bolt(this.x1, this.y1, this.x2, this.y2, 60, 5);
        ctx.stroke();
        ctx.restore();
      }
    }

    const bolts = Array.from({ length: 5 }, () => new Lightning());

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bolts.forEach(b => { b.update(); b.draw(); });
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Particle sparks */}
      <canvas
        ref={particleRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      {/* Lightning */}
      <canvas
        ref={lightningRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
      }} />
      {/* Chakra vignette ring */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 38%, rgba(5,5,17,0.5) 70%, rgba(75,184,250,0.2) 83%, rgba(5,5,17,0.8) 100%)',
        animation: 'vignettePulse 6s infinite alternate ease-in-out',
      }} />
      {/* Colour-shifting ambient shimmer */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        opacity: 0,
        animation: 'ambientShimmer 8s infinite',
      }} />
    </>
  );
}
