import { useEffect, useRef, useState } from 'react';
import styles from './Education.module.css';

const EDUCATION = [
  {
    title: 'B.E. in Computer Science and Engineering',
    school: 'Nellai College of Engineering, Tirunelveli (Anna University)',
    year: '2022 – 2026',
  },
  {
    title: 'HSC',
    school: 'Carol Matric Hr. Sec. School, Kanyakumari (TamilNadu State Board)',
    year: '2022',
  },
];

const ACHIEVEMENTS = [
  'Won 2nd prize in a paper presentation on Neural Coding & AI',
  'Presented ML and full-stack projects at college-level technical events',
  'Building full-stack web applications using the MERN stack',
];

/* Floating paw prints scattered across background */
const PAWS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 5 + Math.random() * 90,
  y: 5 + Math.random() * 90,
  size: 18 + Math.random() * 28,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 5,
  rotate: Math.random() * 360,
}));

/* Electric sparks — Matatabi's blue lightning */
const SPARKS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 0.4 + Math.random() * 0.6,
  height: 30 + Math.random() * 80,
}));

/* Cat tail silhouettes */
const TAILS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: 5 + (i * 15),
  delay: i * 0.8,
  duration: 3 + Math.random() * 2,
}));

export default function Education() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  // text appears after beast lands (beast takes ~2.8s + 0.2s delay = ~3.2s)
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Text fades in 2s after beast starts dropping
          setTimeout(() => setTextVisible(true), 2000);
        } else if (entry.boundingClientRect.top > 0) {
          setVisible(false);
          setTextVisible(false);
        }
      },
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="education" ref={sectionRef} className={styles.section}>

      {/* ── BACKGROUND LAYER ── */}
      <div className={styles.bg}>
        {/* Animated gradient orbs */}
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />

        {/* Electric sparks / lightning */}
        {SPARKS.map((s) => (
          <div
            key={s.id}
            className={styles.spark}
            style={{
              left: `${s.x}%`,
              height: s.height,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}

        {/* Cat tails swaying */}
        {TAILS.map((t) => (
          <div
            key={t.id}
            className={styles.catTail}
            style={{
              left: `${t.x}%`,
              animationDelay: `${t.delay}s`,
              animationDuration: `${t.duration}s`,
            }}
          />
        ))}

        {/* Paw prints floating */}
        {PAWS.map((p) => (
          <div
            key={p.id}
            className={styles.paw}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              transform: `rotate(${p.rotate}deg)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {/* SVG paw print */}
            <svg viewBox="0 0 64 64" fill="rgba(255,255,255,0.15)" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="32" cy="42" rx="14" ry="12" />
              <ellipse cx="14" cy="28" rx="7" ry="9" />
              <ellipse cx="50" cy="28" rx="7" ry="9" />
              <ellipse cx="22" cy="16" rx="6" ry="8" />
              <ellipse cx="42" cy="16" rx="6" ry="8" />
            </svg>
          </div>
        ))}

        {/* Horizontal light wave lines */}
        <div className={styles.wave1} />
        <div className={styles.wave2} />
        <div className={styles.wave3} />
      </div>

      {/* ── 2-TAILS BEAST — top-left ➜ right centre ── */}
      <div className={`${styles.beastWrap} ${visible ? styles.beastVisible : ''}`}>
        <img src="/2tails.webp" alt="Matatabi Two-Tails" className={styles.beastImg} />
        <div className={styles.auraRing} />
        <div className={styles.auraRing2} />
        <div className={styles.auraRing3} />
      </div>

      {/* ── LEFT CONTENT — appears after beast lands ── */}
      <div className={`${styles.content} ${textVisible ? styles.contentVisible : ''}`}>
        <h2 className={styles.title}>Education &amp; Achievements</h2>

        <div className={styles.cols}>
          <div className={styles.timeline}>
            {EDUCATION.map((e) => (
              <div className={styles.item} key={e.title}>
                <h4>{e.title}</h4>
                <span className={styles.school}>{e.school}</span>
                <span className={styles.year}>{e.year}</span>
              </div>
            ))}
          </div>

          <div className={styles.panel}>
            <h4>Achievements</h4>
            <ul>
              {ACHIEVEMENTS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
