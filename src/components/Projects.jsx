import { useEffect, useRef, useState, useCallback } from 'react';
import MiniSpark from './MiniSpark';
import styles from './Projects.module.css';

const PROJECTS = [
  {
    name: 'CardioGuard',
    sub: 'AI-Powered CVD Risk Prediction System',
    stack: ['Flutter', 'FastAPI', 'Scikit-Learn', 'Next.js', 'Supabase'],
    points: [
      'Built a cross-platform digital health app (Android + Web) with a Gradient Boosting Classifier trained on 70,000 patient records, delivering real-time cardiovascular risk predictions via FastAPI REST APIs with sub-100ms response latency.',
      'Engineered a full-stack system with Flutter (mobile), Next.js (web), and Supabase PostgreSQL, featuring OTP authentication, cross-device prediction history sync, and animated risk visualizations with personalized health recommendations.',
    ],
    metrics: ['70,000 patient records', 'sub-100ms latency', 'Gradient Boosting'],
    spark: [12, 18, 15, 28, 24, 38, 34, 50, 46, 62, 58, 74],
    color: '94, 234, 212',
    link: 'https://cardioguard-website.vercel.app/',
  },
  {
    name: 'Regression Models',
    sub: 'Machine Learning Regression Suite',
    stack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy'],
    points: [
      'Built Logistic and Linear Regression models predicting Titanic survival and vehicle fuel efficiency, using feature engineering and cross-validation.',
      'Processed missing data and categorical variables with Pandas; evaluated performance via confusion matrices and Seaborn visualizations.',
    ],
    metrics: ['79% accuracy', 'Cross-validated'],
    spark: [60, 55, 58, 50, 53, 44, 47, 38, 41, 32, 35, 28],
    color: '34, 211, 238',
  },
  {
    name: 'AIMusics',
    sub: 'AI-Powered Music Streaming Platform',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Cloudinary'],
    points: [
      'Developed a full-stack MERN music streaming application featuring a mobile-responsive UI, dynamic routing, and an integrated custom audio player with seamless global state management.',
      'Built a secure and scalable Express.js / MongoDB backend architecture, integrating JWT authentication and Cloudinary for optimized media storage and delivery.',
    ],
    metrics: ['+5% user retention', 'MERN stack', 'Audio Playback'],
    spark: [40, 38, 44, 42, 50, 48, 56, 53, 60, 58, 64, 63],
    color: '242, 166, 90',
    link: 'https://ai-musics-kujy.vercel.app/',
  },
  {
    name: 'Edu Notify',
    sub: 'Student Grade Processor & Notification System',
    stack: ['React', 'Node.js', 'C++', 'Brevo API', 'whatsapp-web.js'],
    points: [
      'Built a comprehensive educational platform featuring CSV-based student data upload, a high-performance C++ grade processor, and an interactive analytics dashboard.',
      'Engineered automated email and WhatsApp notifications for Parent-Teacher Meeting invites using the Brevo API and Puppeteer with QR-code authentication.',
    ],
    metrics: ['C++ grade processor', 'WhatsApp & Email API', 'Full-stack'],
    spark: [20, 25, 30, 45, 40, 55, 60, 50, 70, 85, 80, 95],
    color: '147, 112, 219',
    link: 'https://edu-notify-phi.vercel.app/',
  },
  {
    name: 'GenieBuilder v4',
    sub: 'AI Recruitment & Interview Platform',
    stack: ['React', 'FastAPI', 'MongoDB', 'spaCy', 'scikit-learn'],
    points: [
      'Built an AI-driven recruitment platform with an adaptive interview simulator, automated resume ranking, and comprehensive gap analysis for candidate evaluation.',
      'Engineered a highly reliable split-stack architecture leveraging FastAPI, JWT authentication, and advanced NLP parsing tools to achieve multi-criteria applicant scoring.',
    ],
    metrics: ['Automated resume ranking', 'Multi-criteria scoring', 'Adaptive interviews'],
    spark: [50, 60, 55, 70, 65, 80, 75, 90, 85, 100, 95, 110],
    color: '16, 185, 129',
    link: 'https://geniebuilder.vercel.app/',
  },
];

/* ── Ink Bubble particle config ── */
const BUBBLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 6 + Math.random() * 18,
  left: 2 + Math.random() * 45,   // only left half (octopus side)
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 8,
  opacity: 0.15 + Math.random() * 0.35,
}));

/* ── Tentacle SVG paths (organic curves) ── */
const TENTACLES = [
  "M 100 400 C 120 350, 80 300, 110 260 C 140 220, 90 180, 120 140",
  "M 80 420 C 60 360, 40 310, 70 270 C 100 230, 60 190, 85 150",
  "M 130 410 C 160 360, 130 310, 155 265 C 180 220, 150 175, 170 135",
  "M 60 430 C 30 370, 20 320, 45 280 C 70 240, 35 200, 55 160",
  "M 150 430 C 185 380, 170 330, 195 285 C 220 240, 195 195, 215 155",
];

function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMoveCoords = useCallback((clientX, clientY) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * -14, y: py * 14 });
    // Move specular shine
    const shine = card.querySelector('[data-shine]');
    if (shine) {
      const spx = (px + 0.5) * 100;
      const spy = (py + 0.5) * 100;
      shine.style.background = `radial-gradient(circle at ${spx}% ${spy}%, rgba(255,255,255,0.2) 0%, transparent 55%)`;
      shine.style.opacity = '1';
    }
  }, []);

  const handleMouseMove = (e) => {
    handleMoveCoords(e.clientX, e.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    handleMoveCoords(touch.clientX, touch.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 0) return;
    handleMoveCoords(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 });
    const shine = cardRef.current?.querySelector('[data-shine]');
    if (shine) shine.style.opacity = '0';
  };

  return (
    <div
      className={styles.card}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleLeave}
      style={{ transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(${tilt.x !== 0 || tilt.y !== 0 ? '1.03,1.03,1.03' : '1,1,1'})`, transition: 'transform 0.08s ease', willChange: 'transform' }}
    >
      {/* Specular shine + shimmer */}
      <div data-shine className={styles.shine} />
      <div className={styles.shimmerBar} />

      {/* Morphing Liquid Glass background blobs */}
      <div className={styles.blobContainer}>
        <div className={styles.blob1} style={{ '--blob-color': project.color }} />
        <div className={styles.blob2} />
      </div>
      <div className={styles.glassOverlay} />

      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <div>
            <h3>{project.name}</h3>
            <span className={styles.sub}>{project.sub}</span>
          </div>
          <div className={styles.sparkWrap}>
            <MiniSpark points={project.spark} color={project.color} />
          </div>
        </div>

        <div className={styles.stack}>
          {project.stack.map((s) => (
            <span key={s} className={styles.stackTag}>
              {s}
            </span>
          ))}
        </div>

        <div className={styles.points}>
          {project.points.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className={styles.metrics}>
          {project.metrics.map((m) => (
            <span key={m} className={styles.metric} style={{ '--mc': project.color }}>
              {m}
            </span>
          ))}
        </div>

        {project.link && (
          <div className={styles.cardFooter}>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.visitBtn}
              style={{ '--vc': project.color }}
            >
              <span>Visit</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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
      if (e.detail === 'projects') setVisible(false);
    };
    window.addEventListener('nav-click', onNavClick);

    return () => {
      observer.disconnect();
      window.removeEventListener('nav-click', onNavClick);
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} className={styles.section}>
      {/* Background Water Vibe */}
      <div className={styles.bg}>
        <div className={styles.bgWater1} />
        <div className={styles.bgWater2} />
        <div className={styles.bgWater3} />
        {/* Underwater light shafts */}
        <div className={styles.lightShaft1} />
        <div className={styles.lightShaft2} />
        <div className={styles.lightShaft3} />
      </div>

      {/* Ink Bubbles — rise from the octopus area */}
      <div className={styles.bubblesLayer}>
        {BUBBLES.map((b) => (
          <div
            key={b.id}
            className={styles.bubble}
            style={{
              width: b.size,
              height: b.size,
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              opacity: b.opacity,
            }}
          />
        ))}
      </div>

      {/* Tentacle SVG overlay on left side */}
      <svg className={styles.tentacleSvg} viewBox="0 0 280 500" xmlns="http://www.w3.org/2000/svg">
        {TENTACLES.map((d, i) => (
          <path
            key={i}
            d={d}
            className={styles.tentaclePath}
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </svg>

      {/* 8-Tails Octopus */}
      <div className={`${styles.octopusWrap} ${visible ? styles.octopusVisible : ''}`}>
        <img src="/8tails.webp" alt="Gyuki Eight-Tails" className={styles.octopusImg} />
        <div className={styles.auraRing} />
        <div className={styles.auraRing2} />
        <div className={styles.auraRing3} />
        {/* Ink splash on arrival */}
        <div className={`${styles.inkSplash} ${visible ? styles.inkSplashActive : ''}`} />
      </div>

      {/* Content layout on the right */}
      <div className={`${styles.content} ${visible ? styles.contentVisible : ''}`}>
        <div className={styles.contentInner}>
          <div className={styles.header}>
            <h2 className={styles.title}>Projects</h2>
          </div>

          <div className={styles.grid}>
            {PROJECTS.map((p) => (
              <ProjectCard project={p} key={p.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
