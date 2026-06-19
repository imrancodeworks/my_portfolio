import { useEffect, useRef, useState } from 'react';
import styles from './Skills.module.css';

const STACK = [
  { cat: 'Programming',       level: 92, items: ['Python','JavaScript','SQL','HTML','CSS'] },
  { cat: 'Machine Learning',  level: 88, items: ['Scikit-Learn','Pandas','NumPy','Seaborn','Matplotlib','Predictive Modeling'] },
  { cat: 'Web Development',   level: 85, items: ['React','Node.js','Express.js','Flask','Bootstrap','jQuery'] },
  { cat: 'Databases & Tools', level: 80, items: ['MongoDB','NoSQL','SQL','Git','GitHub','VS Code'] },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Use threshold:0 so it fires as soon as 1px is visible (works with scroll-snap)
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
      if (e.detail === 'skills') setVisible(false);
    };
    window.addEventListener('nav-click', onNavClick);

    return () => {
      observer.disconnect();
      window.removeEventListener('nav-click', onNavClick);
    };
  }, []);

  return (
    <section id="stack" ref={sectionRef} className={styles.section}>

      {/* ── Smooth CSS blob background (no canvas) ── */}
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
        <div className={styles.blob4} />
        <div className={styles.blob5} />
      </div>

      {/* ── 9-Tails: only transform changes (top stays at 50%) ── */}
      <div className={`${styles.foxWrap} ${visible ? styles.foxVisible : ''}`}>
        <img src="/9tails.png" alt="Kurama Nine-Tails" className={styles.foxImg} />
        <div className={styles.auraRing} />
        <div className={styles.auraRing2} />
      </div>

      {/* ── Right content: slides in from right ── */}
      <div className={`${styles.content} ${visible ? styles.contentVisible : ''}`}>

        <div className={styles.titleWrap}>
          <h2 className={styles.title}>
            Technical<br />
            <span className={styles.titleAccent}>Skills</span>
          </h2>
          <p className={styles.subtitle}>
            Channeling chakra through every stack — from data science to full-stack deployment.
          </p>
        </div>

        <div className={styles.grid}>
          {STACK.map((s, i) => (
            <div
              className={`${styles.card} ${visible ? styles.cardIn : ''}`}
              key={s.cat}
              style={{ transitionDelay: visible ? `${0.4 + i * 0.1}s` : '0s' }}
            >
              <div className={styles.cardTop}>
                <span className={styles.cat}>{s.cat}</span>
                <span className={styles.level}>{s.level}%</span>
              </div>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{
                    '--level': `${s.level}%`,
                    transitionDelay: visible ? `${0.7 + i * 0.1}s` : '0s',
                  }}
                />
              </div>
              <div className={styles.tags}>
                {s.items.map((it) => (
                  <span key={it} className={styles.tag}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
