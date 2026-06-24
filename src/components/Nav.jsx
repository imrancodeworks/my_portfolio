import { useEffect, useRef, useState } from 'react';
import styles from './Nav.module.css';
import Mascot from './Mascot';

const LINKS = [
  { id: 'about',      label: 'ABOUT'      },
  { id: 'stack',      label: 'STACK'      },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'projects',   label: 'PROJECTS'   },
  { id: 'education',  label: 'EDUCATION'  },
  { id: 'contact',    label: 'CONTACT'    },
];

export default function Nav() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]   = useState('about');
  const [isDesktop, setIsDesktop] = useState(true);
  const canvasRef              = useRef(null);
  const rafRef                 = useRef(null);
  const sparksRef              = useRef([]);

  /* ── screen width detection for mascot unmounting ── */
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── active section detection ── */
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* ── chakra spark canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip entirely on touch/mobile devices
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Spark {
      constructor(x, y) {
        this.x    = x;
        this.y    = y;
        this.vx   = (Math.random() - 0.5) * 5;
        this.vy   = (Math.random() - 0.5) * 5 - 2;
        this.r    = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.04 + 0.02;
        this.color = Math.random() > 0.5
          ? `rgba(75,184,250,`
          : `rgba(255,106,28,`;
      }
      update() {
        this.x    += this.vx;
        this.y    += this.vy;
        this.vy   += 0.12;
        this.life -= this.decay;
        this.r    *= 0.97;
      }
      draw() {
        if (this.life <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.min(1, this.life * 1.4) + ')';
        ctx.fill();
      }
    }

    const spawnSparks = (x, y, count = 6) => {
      for (let i = 0; i < count; i++) sparksRef.current.push(new Spark(x, y));
      if (!rafRef.current) startRAF(); // wake up the loop
    };

    // RAF only runs while there are live sparks — idle = zero CPU
    const tick = () => {
      sparksRef.current = sparksRef.current.filter(s => s.life > 0);
      if (sparksRef.current.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafRef.current = null;
        return; // stop looping
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current.forEach(s => { s.update(); s.draw(); });
      rafRef.current = requestAnimationFrame(tick);
    };

    const startRAF = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const header = canvas.parentElement;
    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      spawnSparks(e.clientX - rect.left, e.clientY - rect.top, 4);
    };

    // Throttled scroll handler — at most once per 100ms
    let lastScroll = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - lastScroll < 100) return;
      lastScroll = now;
      spawnSparks(canvas.width * 0.75, canvas.height / 2, 3);
    };

    header.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener('resize', resize);
      header.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      {/* chakra spark canvas covers the whole nav bar */}
      <canvas ref={canvasRef} className={styles.sparkCanvas} aria-hidden="true" />

      <div className={styles.inner}>
        {/* LOGO & MASCOT WRAPPER */}
        <div className={styles.logoWrapper}>
          <a href="#about" className={styles.logo} aria-label="Mohamed Imran — Home">
            <img src="/Logo.png" alt="Mohamed Imran Logo" className={styles.logoImg} />
          </a>
          {isDesktop && (
            <div className={styles.navMascotWrapper}>
              <Mascot isNav={true} />
            </div>
          )}
        </div>

        {/* NAV LINKS */}
        <nav className={`${styles.links} ${open ? styles.open : ''}`}>
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? styles.active : ''}
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new CustomEvent('nav-click', { detail: l.id }));
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* mobile hamburger */}
        <button
          className={styles.toggle}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={open ? styles.barOpen1 : ''} />
          <span className={open ? styles.barOpen2 : ''} />
          <span className={open ? styles.barOpen3 : ''} />
        </button>
      </div>
    </header>
  );
}
