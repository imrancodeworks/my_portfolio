import { useEffect, useRef, useState, useCallback } from 'react';
import MiniSpark from './MiniSpark';
import styles from './Projects.module.css';
import { useAudio } from '../hooks/useAudio';

const PROJECTS = [
  {
    id: 'cardioguard',
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
    weaponModel: 'CARDIO-GUARD V1',
    weaponClass: 'Assault Rifle',
    weaponClassAbbr: 'AR',
    rarity: 'legendary',
    category: 'ai-ml',
    stats: [
      { name: 'Accuracy', val: '++', positive: true },
      { name: 'Rate of Fire', val: '+', positive: true },
      { name: 'Reload Speed', val: '-', positive: false },
    ],
  },
  {
    id: 'regression',
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
    weaponModel: 'REGRESSION COMPACT',
    weaponClass: 'Pistol',
    weaponClassAbbr: 'HG',
    rarity: 'rare',
    category: 'ai-ml',
    stats: [
      { name: 'Accuracy', val: '+', positive: true },
      { name: 'Reload Speed', val: '+', positive: true },
      { name: 'Range', val: '-', positive: false },
    ],
  },
  {
    id: 'aimusics',
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
    weaponModel: 'AI-BEATS PRO',
    weaponClass: 'SMG',
    weaponClassAbbr: 'SMG',
    rarity: 'epic',
    category: 'fullstack',
    stats: [
      { name: 'Rate of Fire', val: '++', positive: true },
      { name: 'Magazine', val: '+', positive: true },
      { name: 'Reload Speed', val: '-', positive: false },
    ],
  },
  {
    id: 'edunotify',
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
    weaponModel: 'EDU-BLASTER',
    weaponClass: 'Shotgun',
    weaponClassAbbr: 'SG',
    rarity: 'epic',
    category: 'fullstack',
    stats: [
      { name: 'Damage', val: '++', positive: true },
      { name: 'Range', val: '+', positive: true },
      { name: 'Movement Spd', val: '-', positive: false },
    ],
  },
  {
    id: 'geniebuilder',
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
    weaponModel: 'GENIE-STRIKE v4',
    weaponClass: 'Sniper Rifle',
    weaponClassAbbr: 'SR',
    rarity: 'legendary',
    category: 'ai-ml',
    stats: [
      { name: 'Range', val: '++', positive: true },
      { name: 'Armor Pen.', val: '+', positive: true },
      { name: 'Rate of Fire', val: '-', positive: false },
    ],
  },
];

/* ── Ink Bubble particle config ── */
const BUBBLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 6 + Math.random() * 18,
  left: 2 + Math.random() * 45, // only left half (octopus side)
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

function WeaponSilhouette({ type, ...props }) {
  if (type === 'Assault Rifle') {
    return (
      <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M5 25 h8 l3 -3 h12 l2 2 h15 l1 -2 h20 l2 2 h15 v3 h-4 v3 h-10 v-3 h-10 v4 h-4 v-4 h-15 l-1 3 h-12 l-2 -2 h-14 l-3 3 h-7 z" />
        <path d="M30 18 h12 v3 h-12 z" />
        <path d="M42 27 l-4 8 h-6 l2 -8" />
        <path d="M5 25 l-3 -5 v12 z" />
        <path d="M80 23 h12 v2 h-12 z" />
      </svg>
    );
  }
  if (type === 'Sniper Rifle') {
    return (
      <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M80 20 h16 v1 h-16 z" />
        <path d="M8 23 h10 l2 -2 h25 l1 2 h25 v3 h-6 v2 h-8 v-2 h-12 v3 h-4 v-3 h-10 l-2 2 h-10 l-3 -3 z" />
        <path d="M32 14 h18 v3 h-18 z M36 17 l-2 3 M46 17 l2 3" />
        <path d="M68 25 l-4 8 M72 25 l4 8" />
        <path d="M8 23 l-6 -4 v10 z" />
      </svg>
    );
  }
  if (type === 'SMG') {
    return (
      <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15 22 h15 l2 -2 h20 l1 1 h15 v3 h-5 v2 h-5 v-2 h-10 v5 h-4 v-5 h-15 l-1 2 h-10 z" />
        <path d="M48 24 l-2 6 h-4 l2 -6" />
        <path d="M36 24 l-3 10 h-5 l3 -10" />
        <path d="M15 22 h-10 v3 h10 M5 25 v5" />
      </svg>
    );
  }
  if (type === 'Shotgun') {
    return (
      <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M10 24 h15 l1 -1 h40 v4 h-12 v1 h-8 v-1 h-20 v3 h-4 v-3 h-10 z" />
        <path d="M42 26 h14 v3 h-14 z" />
        <path d="M10 24 l-8 -2 v8 l6 2 z" />
      </svg>
    );
  }
  if (type === 'Pistol') {
    return (
      <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M30 18 h25 v6 h-25 z M45 24 v10 h-6 v-10 z M39 28 h3 v3 h-3 z" />
      </svg>
    );
  }
  return null;
}


export default function Projects() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const inspectedIds = useRef(new Set());
  const { playSlotClick, playTabSwitch } = useAudio();

  // Apply dynamic accent color to CSS root based on selected project
  const applyTheme = useCallback((color) => {
    document.documentElement.style.setProperty('--mc', color);
    document.documentElement.style.setProperty('--accent-2', `rgb(${color})`);
  }, []);

  useEffect(() => {
    // Apply initial theme for default project
    applyTheme(PROJECTS[0].color);
    return () => {
      // Reset to default on unmount
      document.documentElement.style.setProperty('--mc', '75, 184, 250');
      document.documentElement.style.setProperty('--accent-2', '#4BB8FA');
    };
  }, [applyTheme]);

  // Track inspected projects for quest whenever selectedProject changes
  useEffect(() => {
    if (selectedProject) {
      inspectedIds.current.add(selectedProject.id);
      if (inspectedIds.current.size >= PROJECTS.length) {
        window.dispatchEvent(new Event('quest:inspect_all'));
      }
    }
  }, [selectedProject]);

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

  // Filter projects by category tab
  const filteredProjects = PROJECTS.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const firstOfFiltered = PROJECTS.find((p) => tab === 'all' || p.category === tab);
    if (firstOfFiltered) {
      setSelectedProject(firstOfFiltered);
      applyTheme(firstOfFiltered.color);
    }
    playTabSwitch();
  };

  const handleSlotSelect = useCallback((p) => {
    setSelectedProject(p);
    applyTheme(p.color);
    playSlotClick();
  }, [applyTheme, playSlotClick]);

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
            <h2 className={styles.title}>Projects Armory</h2>
            {/* Category tabs */}
            <div className={styles.tabsBar}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTab : ''}`} 
                onClick={() => handleTabChange('all')}
              >
                ALL SYSTEMS
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'ai-ml' ? styles.activeTab : ''}`} 
                onClick={() => handleTabChange('ai-ml')}
              >
                AI & ML WEAPONS
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'fullstack' ? styles.activeTab : ''}`} 
                onClick={() => handleTabChange('fullstack')}
              >
                FULLSTACK UNITS
              </button>
            </div>
          </div>

          <div className={styles.armoryContainer}>
            {/* Left Column: Grid of slots */}
            <div className={styles.slotsPane}>
              <div className={styles.slotsGrid}>
                {filteredProjects.map((p) => (
                  <button 
                    key={p.id} 
                    className={`${styles.slotCard} ${styles[p.rarity]} ${selectedProject.id === p.id ? styles.selectedSlot : ''}`}
                    onClick={() => handleSlotSelect(p)}
                  >
                    <div className={styles.slotRarityGradient} />
                    <div className={styles.slotWeaponWrap}>
                      <WeaponSilhouette type={p.weaponClass} className={styles.slotSilhouette} style={{ '--wc': p.color }} />
                    </div>
                    <div className={styles.slotInfo}>
                      <span className={styles.slotClassAbbr}>{p.weaponClassAbbr}</span>
                      <span className={styles.slotName}>{p.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Detailed specs of selected weapon */}
            <div className={styles.detailsPane}>
              {selectedProject && (
                <div className={styles.weaponDetailsCard}>
                  {/* Title & Type header */}
                  <div className={styles.detailHeader}>
                    <div className={styles.weaponTitleArea}>
                      <div className={styles.badgeRow}>
                        <span className={`${styles.rarityBadge} ${styles[selectedProject.rarity + 'Badge']}`}>
                          {selectedProject.rarity.toUpperCase()}
                        </span>
                        <span className={styles.weaponClassText}>{selectedProject.weaponClass}</span>
                      </div>
                      <h3>{selectedProject.weaponModel}</h3>
                      <span className={styles.weaponSub}>{selectedProject.sub}</span>
                    </div>
                  </div>

                  {/* Weapon Graphic Showcase */}
                  <div className={styles.weaponVisualShowcase}>
                    <div className={styles.visualGridBg} />
                    <WeaponSilhouette 
                      type={selectedProject.weaponClass} 
                      className={styles.showcaseSilhouette} 
                      style={{ '--wc': selectedProject.color }} 
                    />
                    <div className={`${styles.ambientGlow} ${styles[selectedProject.rarity + 'Glow']}`} />
                  </div>

                  {/* Stats Section (Free Fire Attribute Bar Style) */}
                  <div className={styles.statsSection}>
                    <div className={styles.statsHeader}>
                      <h4 className={styles.sectionTitle}>ATTRIBUTES</h4>
                      {/* Recoil Sparkline */}
                      <div className={styles.recoilPlot}>
                        <span className={styles.recoilLabel}>STABILITY</span>
                        <div className={styles.recoilSparkWrap}>
                          <MiniSpark points={selectedProject.spark} color={selectedProject.color} />
                        </div>
                      </div>
                    </div>
                    <div className={styles.attributesList}>
                      {selectedProject.stats.map((st) => (
                        <div key={st.name} className={styles.attributeRow}>
                          <span className={styles.attributeName}>{st.name}</span>
                          <div className={styles.attributeBarContainer}>
                            <div 
                              className={`${styles.attributeBar} ${st.positive ? styles.positiveBar : styles.negativeBar}`} 
                              style={{ width: st.val === '++' ? '90%' : st.val === '+' ? '60%' : '35%' }} 
                            />
                          </div>
                          <span className={`${styles.attributeValue} ${st.positive ? styles.positiveText : styles.negativeText}`}>
                            {st.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Points description */}
                  <div className={styles.descriptionSection}>
                    <h4 className={styles.sectionTitle}>FIELD DATA / KEY ACHIEVEMENTS</h4>
                    <div className={styles.projectPoints}>
                      {selectedProject.points.map((pt, i) => (
                        <p key={i} className={styles.projectPoint}>{pt}</p>
                      ))}
                    </div>
                  </div>

                  {/* Stack attachments */}
                  <div className={styles.attachmentsSection}>
                    <h4 className={styles.sectionTitle}>EQUIPPED TECH MODULES</h4>
                    <div className={styles.attachmentsList}>
                      {selectedProject.stack.map((stk) => (
                        <span key={stk} className={styles.attachmentTag}>
                          <span className={styles.attachmentDot} style={{ background: `rgb(${selectedProject.color})` }} />
                          {stk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Equip / Visit Action Button */}
                  {selectedProject.link && (
                    <div className={styles.equipBtnWrapper}>
                      <a 
                        href={selectedProject.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.equipBtn}
                        style={{ '--glow-color': `rgb(${selectedProject.color})` }}
                      >
                        <span>EQUIP & ENTER</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
