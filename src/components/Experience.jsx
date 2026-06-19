import { useEffect, useRef, useState } from 'react';
import useCountUp from '../hooks/useCountUp';
import styles from './Experience.module.css';

const LOG_LINES = [
  'Developed a real-time Sentiment Analysis web app using Python (Flask) for instant predictions',
  'Built and optimized a data preprocessing pipeline using Logistic Regression with hyperparameter tuning',
  'Deployed the ML model via REST APIs, enhancing backend integration and boosting performance',
  'Maintained code quality and documentation through Agile-based technical reviews',
];

function Metric({ value, suffix = '', label, visible }) {
  const count = useCountUp(value, { start: visible });
  return (
    <div className={styles.metric}>
      <div className={styles.metricValue}>{count}{suffix}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );
}

/* ── Sand particle canvas ── */
function SandCanvas({ canvasRef }) {
  return <canvas ref={canvasRef} className={styles.sandCanvas} aria-hidden="true" />;
}

export default function Experience() {
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const [visible, setVisible] = useState(false);

  /* IntersectionObserver — threshold 0 works with scroll-snap */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else if (entry.boundingClientRect.top > 0) {
          setVisible(false);
        }
      },
      { threshold: 0 }
    );
    observer.observe(node);

    const onNavClick = (e) => {
      if (e.detail === 'experience') setVisible(false);
    };
    window.addEventListener('nav-click', onNavClick);

    return () => {
      observer.disconnect();
      window.removeEventListener('nav-click', onNavClick);
    };
  }, []);

  /* ── Sand particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* Sand grain */
    class Grain {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x     = Math.random() * canvas.width;
        this.y     = init
          ? Math.random() * canvas.height
          : canvas.height + 10;
        this.size  = Math.random() * 3 + 0.8;
        this.speedY= -(Math.random() * 0.8 + 0.3);
        this.speedX= (Math.random() - 0.5) * 0.6;
        this.life  = 1;
        this.decay = Math.random() * 0.003 + 0.001;
        /* warm sand palette */
        const hue  = Math.random() * 30 + 25;   // 25–55 (amber-tan)
        const sat  = Math.random() * 30 + 50;
        const lit  = Math.random() * 20 + 55;
        this.color = `hsl(${hue},${sat}%,${lit}%)`;
      }
      update() {
        this.x    += this.speedX + Math.sin(this.y * 0.025) * 0.5;
        this.y    += this.speedY;
        this.life -= this.decay;
        if (this.life <= 0 || this.y < -10) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.life * 0.75;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    /* Swirl orbit particle (circles the 1-tail beast area) */
    class Swirl {
      constructor(cx, cy, radius, speed, size, color) {
        this.cx     = cx;
        this.cy     = cy;
        this.radius = radius;
        this.angle  = Math.random() * Math.PI * 2;
        this.speed  = speed;
        this.size   = size;
        this.color  = color;
        this.life   = Math.random() * 0.5 + 0.5;
      }
      update() {
        this.angle  += this.speed;
        this.x       = this.cx + Math.cos(this.angle) * this.radius;
        this.y       = this.cy + Math.sin(this.angle) * (this.radius * 0.45);
        this.life   -= 0.003;
        if (this.life <= 0) {
          this.life   = Math.random() * 0.5 + 0.5;
          this.angle  = Math.random() * Math.PI * 2;
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.life * 0.9;
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        g.addColorStop(0, this.color);
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
      }
    }

    const grains = Array.from({ length: 200 }, () => new Grain());

    /* Swirl ring centred on the right-side 1-tail image */
    const getSwirlCentre = () => ({
      cx: canvas.width * 0.76,
      cy: canvas.height * 0.5,
    });
    const SWIRL_COLORS = [
      'rgba(180,140,60,0.9)',
      'rgba(210,170,80,0.85)',
      'rgba(160,110,40,0.8)',
      'rgba(230,190,100,0.7)',
      'rgba(140,90,30,0.75)',
    ];
    let swirls = [];
    const buildSwirls = () => {
      const { cx, cy } = getSwirlCentre();
      swirls = [
        ...Array.from({ length: 16 }, (_, i) => new Swirl(cx, cy, 110 + i * 5,  0.018 + i * 0.001, 3 + Math.random()*3, SWIRL_COLORS[i % 5])),
        ...Array.from({ length: 10 }, (_, i) => new Swirl(cx, cy, 155 + i * 6, -0.022 - i * 0.001, 2 + Math.random()*2, SWIRL_COLORS[(i+2) % 5])),
        ...Array.from({ length: 8  }, (_, i) => new Swirl(cx, cy, 200 + i * 7,  0.012 + i * 0.0005,2 + Math.random()*2, SWIRL_COLORS[(i+1) % 5])),
      ];
    };
    buildSwirls();
    window.addEventListener('resize', buildSwirls);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      grains.forEach(g => { g.update(); g.draw(); });
      if (visible) swirls.forEach(s => { s.update(); s.draw(); });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', buildSwirls);
    };
  }, [visible]);

  return (
    <section id="experience" ref={sectionRef} className={styles.section}>

      {/* ── Sand background layers ── */}
      <div className={styles.bg}>
        <div className={styles.bgDune1} />
        <div className={styles.bgDune2} />
        <div className={styles.bgDune3} />
        <div className={styles.bgVignette} />
      </div>

      {/* ── Sand particle canvas ── */}
      <SandCanvas canvasRef={canvasRef} />

      {/* ── 1-Tail beast: flies from bottom-left → centre-right ── */}
      <div className={`${styles.beastWrap} ${visible ? styles.beastVisible : ''}`}>
        {/* Swirl glow rings behind beast */}
        <div className={styles.swirlRing1} />
        <div className={styles.swirlRing2} />
        <div className={styles.swirlRing3} />
        {/* sand dust halo */}
        <div className={styles.sandHalo} />
        <img src="/1tail.png" alt="Shukaku One-Tail" className={styles.beastImg} />
      </div>

      {/* ── Left content: fades in ── */}
      <div className={`${styles.content} ${visible ? styles.contentVisible : ''}`}>

        <div className={styles.titleWrap}>
          <h2 className={styles.title}>
            Internship<br />
            <span className={styles.titleAccent}>Experience</span>
          </h2>
        </div>

        <div className={styles.log}>
          <div className={styles.logHead}>
            <div>
              <h3 className={styles.role}>AI &amp; Machine Learning Intern</h3>
              <span className={styles.company}>Trichy e-Soft Technologies</span>
            </div>
            <span className={styles.date}>Aug 2025</span>
          </div>

          <div className={styles.metrics}>
            <Metric value={15} suffix="%" label="accuracy gain via hyperparameter tuning" visible={visible} />
            <Metric value={10} suffix="%" label="performance boost from REST API deployment" visible={visible} />
          </div>

          <ul className={styles.lines}>
            {LOG_LINES.map((line, i) => (
              <li
                key={i}
                className={`${styles.line} ${visible ? styles.lineIn : ''}`}
                style={{ transitionDelay: visible ? `${0.6 + i * 0.12}s` : '0s' }}
              >
                <span className={styles.gt}>&gt;</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
