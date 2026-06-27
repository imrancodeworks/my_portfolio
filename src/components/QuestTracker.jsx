import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './QuestTracker.module.css';
import { useAudio } from '../hooks/useAudio';

const QUESTS = [
  {
    id: 'inspect_all',
    icon: '🔫',
    name: 'Full Arsenal Survey',
    // Shown BEFORE completion — cryptic, no spoilers
    hint: 'Five shadows wait in the Armory. Each conceals a secret. Find them all.',
    // Shown AFTER completion — what they actually did
    desc: 'Inspected all 5 weapons in the Projects Armory',
    event: 'quest:inspect_all',
    xp: 300,
  },
  {
    id: 'pester_mascot',
    icon: '🤖',
    name: 'Mascot Whisperer',
    hint: 'The guardian in the corner responds to those who persist. Patience... and repetition.',
    desc: 'Awakened the guardian by clicking 5 times',
    event: 'quest:pester_mascot',
    xp: 200,
  },
  {
    id: 'found_watermark',
    icon: '👁️',
    name: 'Shadow Seeker',
    hint: 'Something lurks in the first realm — visible only for a moment. Look behind the veil.',
    desc: 'Discovered the hidden mark of the creator',
    event: 'quest:found_watermark',
    xp: 250,
  },
  {
    id: 'scroll_all',
    icon: '🌀',
    name: 'Journey Complete',
    hint: 'Walk the full path. No realm left unexplored. Every section holds a piece of the truth.',
    desc: 'Traversed every realm of the portfolio',
    event: 'quest:scroll_all',
    xp: 350,
  },
  {
    id: 'contact_open',
    icon: '📡',
    name: 'Signal Transmitted',
    hint: 'At the edge of the known world, a transmission portal awaits your command.',
    desc: 'Reached the edge — contact dimension unlocked',
    event: 'quest:contact_open',
    xp: 150,
  },
];

// Redacted name: replace chars with block characters, keep spaces
function redact(name) {
  return name.replace(/[^\s]/g, '█');
}

function confettiBurst(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.5,
    r: 4 + Math.random() * 6,
    color: ['#FFD700', '#39FF14', '#FF3131', '#4BB8FA', '#D980FA'][Math.floor(Math.random() * 5)],
    vx: (Math.random() - 0.5) * 6,
    vy: -6 - Math.random() * 6,
    gravity: 0.25,
    life: 1,
    decay: 0.012 + Math.random() * 0.01,
  }));
  let frame;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      if (p.life <= 0) return;
      alive = true;
      p.x += p.vx; p.y += p.vy;
      p.vy += p.gravity; p.life -= p.decay;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    if (alive) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  draw();
  return () => cancelAnimationFrame(frame);
}

export default function QuestTracker() {
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('portfolio_quests') || '[]'); }
    catch { return []; }
  });
  const [open, setOpen] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [notification, setNotification] = useState(null);
  // tracks which quests just got revealed (for reveal animation)
  const [justRevealed, setJustRevealed] = useState(new Set());
  const canvasRef = useRef(null);
  const notifTimer = useRef(null);
  const mascotClickCount = useRef(0);
  const visitedSections = useRef(new Set());
  const { playQuestComplete, playHologramHum } = useAudio();

  const completeQuest = useCallback((id) => {
    setCompleted(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem('portfolio_quests', JSON.stringify(next));
      const quest = QUESTS.find(q => q.id === id);
      if (quest) {
        setNotification(quest);
        setJustRevealed(r => new Set([...r, id]));
        playQuestComplete();
        if (canvasRef.current) confettiBurst(canvasRef.current);
        if (notifTimer.current) clearTimeout(notifTimer.current);
        notifTimer.current = setTimeout(() => {
          setNotification(null);
          // Clear reveal glow after animation
          setJustRevealed(r => { const n = new Set(r); n.delete(id); return n; });
        }, 4000);
      }
      return next;
    });
  }, [playQuestComplete]);

  // Listen for global quest events
  useEffect(() => {
    const handlers = QUESTS.map(q => {
      const fn = () => completeQuest(q.id);
      window.addEventListener(q.event, fn);
      return { event: q.event, fn };
    });
    return () => handlers.forEach(({ event, fn }) => window.removeEventListener(event, fn));
  }, [completeQuest]);

  // Track mascot click count (quest: pester_mascot)
  useEffect(() => {
    const onMascotClick = () => {
      mascotClickCount.current += 1;
      if (mascotClickCount.current >= 5) {
        window.dispatchEvent(new Event('quest:pester_mascot'));
      }
    };
    window.addEventListener('mascot:click', onMascotClick);
    return () => window.removeEventListener('mascot:click', onMascotClick);
  }, []);

  // Track section visits (quest: scroll_all)
  useEffect(() => {
    const sections = ['about', 'stack', 'experience', 'projects', 'education', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          visitedSections.current.add(id);
          if (visitedSections.current.size >= sections.length) {
            window.dispatchEvent(new Event('quest:scroll_all'));
          }
          if (id === 'contact') {
            window.dispatchEvent(new Event('quest:contact_open'));
          }
        }
      }, { threshold: 0.3 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const totalXP = completed.reduce((sum, id) => {
    const q = QUESTS.find(q => q.id === id);
    return sum + (q?.xp || 0);
  }, 0);
  const maxXP = QUESTS.reduce((s, q) => s + q.xp, 0);
  const incomplete = QUESTS.length - completed.length;

  const handleToggle = () => {
    if (open) {
      setHiding(true);
      setTimeout(() => { setOpen(false); setHiding(false); }, 220);
    } else {
      setOpen(true);
      playHologramHum();
    }
  };

  return (
    <div className={styles.questPanel}>
      {/* Quest Complete Notification Toast */}
      {notification && (
        <div className={styles.notification}>
          <span className={styles.notifIcon}>{notification.icon}</span>
          <span className={styles.notifText}>
            <span className={styles.notifTitle}>◈ SHADOW UNLOCKED</span>
            <span className={styles.notifName}>{notification.name}</span>
            <span className={styles.notifXp}>+{notification.xp} XP transmitted</span>
          </span>
        </div>
      )}

      {/* Expandable Log Panel */}
      {open && (
        <div className={`${styles.log} ${hiding ? styles.logHide : ''}`}>

          {/* Header */}
          <div className={styles.logHeader}>
            <div className={styles.logTitleWrap}>
              <span className={styles.logClassified}>// CLASSIFIED</span>
              <span className={styles.logTitle}>SHADOW LOG</span>
            </div>
            <span className={styles.progressText}>
              {completed.length}<span className={styles.slash}>/</span>{QUESTS.length}
            </span>
          </div>

          <p className={styles.logSubtitle}>
            Hidden objectives detected in this dimension.<br/>
            Complete them to reveal the truth.
          </p>

          {/* Quest List */}
          <div className={styles.questList}>
            {QUESTS.map(q => {
              const done = completed.includes(q.id);
              const revealed = justRevealed.has(q.id);
              return (
                <div
                  key={q.id}
                  className={`${styles.questItem} ${done ? styles.questCompleted : styles.questLocked} ${revealed ? styles.questReveal : ''}`}
                >
                  {/* Left: icon or lock */}
                  <span className={styles.questIcon}>
                    {done ? q.icon : '?'}
                  </span>

                  <span className={styles.questInfo}>
                    {/* Name — redacted until completed */}
                    <span className={styles.questName}>
                      {done
                        ? q.name
                        : <span className={styles.redacted}>{redact(q.name)}</span>
                      }
                    </span>

                    {/* Hint (locked) or Desc (done) */}
                    <span className={styles.questDesc}>
                      {done ? q.desc : q.hint}
                    </span>

                    {/* XP */}
                    <span className={styles.questXp}>
                      {done ? `+${q.xp} XP` : `??? XP`}
                    </span>
                  </span>

                  {/* Check / lock indicator */}
                  <span className={`${styles.questCheck} ${done ? styles.checkDone : ''}`}>
                    {done ? '✓' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* XP Progress Bar */}
          <div className={styles.xpBarWrap}>
            <div className={styles.xpLabel}>
              <span>SHADOW LEVEL</span>
              <span>{totalXP} <span className={styles.slash}>/</span> {maxXP} XP</span>
            </div>
            <div className={styles.xpTrack}>
              <div className={styles.xpFill} style={{ width: `${(totalXP / maxXP) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Toggle — mysterious sigil button */}
      <button
        className={`${styles.toggleBtn} ${open ? styles.toggleOpen : ''}`}
        onClick={handleToggle}
        title="Shadow Log"
        aria-label="Open Shadow Quest Log"
      >
        <span className={styles.sigilRing} />
        <span className={styles.sigilCore}>◈</span>
        {incomplete > 0 && (
          <span className={styles.badge}>{incomplete}</span>
        )}
      </button>

      {/* Confetti Canvas */}
      <canvas ref={canvasRef} className={styles.confettiCanvas} />
    </div>
  );
}
