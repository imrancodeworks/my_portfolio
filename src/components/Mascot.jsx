import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Mascot.module.css';

const GREETING_QUOTES = [
  "Hi!!",
  "Hello there!",
  "A wild developer appears!",
  "Summoning complete!",
  "Welcome, traveler!",
  "Hey! Looking for coding jutsu?"
];

const MYSTERY_QUOTES = [
  "The portals are aligned. Do you feel the ambient waves?",
  "The 8-Tails is watching you scroll. Be careful!",
  "Searching for hidden parameters in your layout...",
  "Are you here for the source code, or the secrets in the shadows?",
  "Did you notice the watermark fade? The shadows know the way.",
  "I've been calculating the latency of our connection...",
  "Warning: Entering the Projects Armory may cause endless inspecting.",
  "There is a glitch in the Matrix... or is it just my CSS grid?"
];

const PICKUP_QUOTES = [
  "Are you a CSS grid? Because you align my layout perfectly.",
  "My love for you is like a loop without a break statement.",
  "Are you a git commit? Because I want to push my changes to you.",
  "I must be FastAPI, because my heart is beating under 100ms right now.",
  "Are you full-stack? Because you complete my backend.",
  "Are you a machine learning model? Because you've got me overfitting.",
  "Are you an API key? Because you unlock my full potential.",
  "Is your name Supabase? Because you are my cloud-nine database."
];

const getRandomQuote = (arr) => arr[Math.floor(Math.random() * arr.length)];

const SKINS = [
  {
    id: 'streetwear',
    label: '🎨',
    title: 'Streetwear',
    grad: ['#FF416C', '#FF4B2B', '#FF8C00', '#4BB8FA'],
  },
  {
    id: 'shinobi',
    label: '🌑',
    title: 'Akatsuki Cloak',
    grad: ['#1a1a2e', '#16213e', '#C0392B', '#2C3E50'],
  },
  {
    id: 'cyber',
    label: '⚡',
    title: 'Cyber Armor',
    grad: ['#00F5FF', '#0070FF', '#7B2FFF', '#00FF88'],
  },
];

export default function Mascot({ isNav = false }) {

  const containerRef = useRef(null);
  const [phase, setPhase] = useState(0); // 0: Idle, 1: Waving ("Hi!!"), 2: Pointing + Winking
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isHoveredRef = useRef(false);
  const hoverTimerRef = useRef(null);
  const clickRecoverRef = useRef(null); // tracks the post-click recovery timer
  const [activeSkin, setActiveSkin] = useState('streetwear');
  const currentSkin = SKINS.find(s => s.id === activeSkin) || SKINS[0];

  // Sync isHovered state to ref for timer closures
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // ── 1. Loop Animation State Machine ──
  useEffect(() => {
    if (isHovered) return; // Disable automatic loop when user is hovering

    const runCycle = () => {
      // 0s - 2s: Idle
      setPhase(0);
      setShowBubble(false);

      // 2s - 5s: Waving + greeting
      const t1 = setTimeout(() => {
        setPhase(1);
        setBubbleText(getRandomQuote(GREETING_QUOTES));
        setShowBubble(true);
      }, 2000);

      // 5s - 8s: Pointing + random mystery or pickup quote
      const t2 = setTimeout(() => {
        setPhase(2);
        const choiceList = Math.random() > 0.5 ? MYSTERY_QUOTES : PICKUP_QUOTES;
        setBubbleText(getRandomQuote(choiceList));
        setShowBubble(true);
      }, 5000);

      // 8s: Reset / Close bubble before restart
      const t3 = setTimeout(() => {
        setShowBubble(false);
      }, 7700);

      return [t1, t2, t3];
    };

    let timers = runCycle();

    const interval = setInterval(() => {
      timers.forEach(clearTimeout);
      timers = runCycle();
    }, 8000);

    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, [isHovered]);

  // ── 2. Eye Cursor Tracking ──
  useEffect(() => {
    const handleMove = (e) => {
      let clientX, clientY;
      if (e.type === 'touchmove' || e.type === 'touchstart') {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Locate the center of the mascot eyes locally
      if (!containerRef.current) return;
      const eyeEl = containerRef.current.querySelector('.mascot-eyes-group');
      if (!eyeEl) return;
      const rect = eyeEl.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const dx = clientX - eyeCenterX;
      const dy = clientY - eyeCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Maximum limit for pupil travel inside eyeball
      const maxLimit = 5.5;
      let moveX = 0;
      let moveY = 0;

      if (dist > 0) {
        // Soft dampening factor + clamping
        moveX = (dx / dist) * Math.min(dist * 0.06, maxLimit);
        moveY = (dy / dist) * Math.min(dist * 0.06, maxLimit);
      }

      setEyeOffset({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchstart', handleMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchstart', handleMove);
    };
  }, []);

  // ── 3. Handle Interactivity: Hover & Click ──
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setPhase(1);
    setBubbleText(getRandomQuote(GREETING_QUOTES));
    setShowBubble(true);

    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    // After 2 seconds of staying hovered, point and show a random quote
    hoverTimerRef.current = setTimeout(() => {
      setPhase(2);
      const choiceList = Math.random() > 0.5 ? MYSTERY_QUOTES : PICKUP_QUOTES;
      setBubbleText(getRandomQuote(choiceList));
      setShowBubble(true);
    }, 2000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowBubble(false);
    setPhase(0);
  }, []);

  const handleMascotClick = useCallback(() => {
    setPhase(1);
    const clickQuotes = [
      "Let's build! 🚀",
      "Summoning jutsu! 🌀",
      "Analyzing user behavior... 🤖",
      "Loading secret protocols... 💾",
      "Equipped with passion! ⚡"
    ];
    setBubbleText(getRandomQuote(clickQuotes));
    setShowBubble(true);

    // Dispatch quest tracking event
    window.dispatchEvent(new Event('mascot:click'));

    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (clickRecoverRef.current) clearTimeout(clickRecoverRef.current);

    clickRecoverRef.current = setTimeout(() => {
      // Re-evaluate if still hovered using ref
      if (isHoveredRef.current) {
        setPhase(2);
        const choiceList = Math.random() > 0.5 ? MYSTERY_QUOTES : PICKUP_QUOTES;
        setBubbleText(getRandomQuote(choiceList));
      } else {
        setPhase(0);
        setShowBubble(false);
      }
    }, 1800);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (clickRecoverRef.current) clearTimeout(clickRecoverRef.current);
    };
  }, []);

  // Dynamic arm classes
  const rightArmClass = phase === 1 
    ? `${styles.rightArm} ${styles.rightArmWave}` 
    : styles.rightArm;

  const leftArmClass = phase === 2 
    ? `${styles.leftArm} ${styles.leftArmPoint}` 
    : styles.leftArm;

  const containerClass = isNav
    ? `${styles.navMascotContainer} ${styles.floatNav}`
    : `${styles.mascotContainer} ${styles.float}`;

  const bubbleClass = isNav
    ? styles.navBubble
    : styles.bubble;

  return (
    <div
      ref={containerRef}
      className={containerClass}
      onClick={handleMascotClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Comic Speech Bubble */}
      {showBubble && (
        <div className={bubbleClass}>
          {bubbleText}
        </div>
      )}

      {/* SVG */}
      <svg viewBox="0 0 300 450" className={styles.svg}>
        <defs>
          {/* Modern Streetwear Neon/Cyberpunk Gradient for Hoodie — skin-driven */}
          <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={currentSkin.grad[0]} />
            <stop offset="40%"  stopColor={currentSkin.grad[1]} />
            <stop offset="70%"  stopColor={currentSkin.grad[2]} />
            <stop offset="100%" stopColor={currentSkin.grad[3]} />
          </linearGradient>
          {/* Volumetric Soft Skin Gradient (Pixar lighting) */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE3D1" />
            <stop offset="100%" stopColor="#EFA983" />
          </linearGradient>
          {/* Textured Hair Gradient */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E2E3A" />
            <stop offset="100%" stopColor="#14141C" />
          </linearGradient>
          {/* Hair Highlight Gradient */}
          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4D4D5C" />
            <stop offset="100%" stopColor="#22222E" />
          </linearGradient>
          {/* Volumetric Denim Jeans Gradient */}
          <linearGradient id="denimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34495E" />
            <stop offset="100%" stopColor="#1C2833" />
          </linearGradient>
          {/* Subtle drop shadow for depth */}
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* ── Feet & Upgraded Sneakers ── */}
        <g id="feet" filter="url(#shadow)">
          {/* Left Sneaker Upgraded */}
          <path d="M 105 402 C 105 390, 135 390, 135 402 L 135 412 L 105 412 Z" fill="#E74C3C" />
          <path d="M 112 392 L 128 392 L 132 402 L 108 402 Z" fill="#FFFFFF" opacity="0.95" />
          <rect x="103" y="411" width="34" height="5" rx="2" fill="#FFFFFF" />
          <line x1="114" y1="396" x2="126" y2="396" stroke="#1A1A24" strokeWidth="1.5" />
          <line x1="116" y1="399" x2="124" y2="399" stroke="#1A1A24" strokeWidth="1.5" />
          <ellipse cx="120" cy="402" rx="4" ry="2" fill="#1A1A24" opacity="0.15" />
          
          {/* Right Sneaker Upgraded */}
          <path d="M 165 402 C 165 390, 195 390, 195 402 L 195 412 L 165 412 Z" fill="#E74C3C" />
          <path d="M 172 392 L 188 392 L 192 402 L 168 402 Z" fill="#FFFFFF" opacity="0.95" />
          <rect x="163" y="411" width="34" height="5" rx="2" fill="#FFFFFF" />
          <line x1="174" y1="396" x2="186" y2="396" stroke="#1A1A24" strokeWidth="1.5" />
          <line x1="176" y1="399" x2="184" y2="399" stroke="#1A1A24" strokeWidth="1.5" />
          <ellipse cx="180" cy="402" rx="4" ry="2" fill="#1A1A24" opacity="0.15" />
        </g>

        {/* ── Legs (Volumetric Denim Jeans) ── */}
        <g id="legs" filter="url(#shadow)">
          {/* Left Leg */}
          <path d="M 115 315 L 115 400 L 133 400 L 135 315 Z" fill="url(#denimGrad)" />
          {/* Right Leg */}
          <path d="M 165 315 L 165 400 L 183 400 L 185 315 Z" fill="url(#denimGrad)" />
          {/* Hips */}
          <rect x="115" y="305" width="70" height="20" rx="6" fill="#1A252F" />
        </g>

        {/* ── Torso (Streetwear Hoodie with Zip Detail) ── */}
        <g id="torso" filter="url(#shadow)">
          <path d="M 115 220 L 185 220 L 190 315 L 110 315 Z" fill="url(#rainbowGrad)" />
          {/* White T-Shirt Underneath */}
          <path d="M 135 220 C 135 228, 165 228, 165 220 Z" fill="#FFFFFF" />
          {/* Jacket Zip Detail */}
          <line x1="150" y1="228" x2="150" y2="315" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.3" />
          <rect x="148.5" y="238" width="3" height="12" rx="1" fill="#FFFFFF" opacity="0.75" />
          {/* Hoodie strings */}
          <path d="M 142 225 L 142 258" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M 158 225 L 158 253" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <circle cx="142" cy="259" r="2.5" fill="#E74C3C" />
          <circle cx="158" cy="254" r="2.5" fill="#E74C3C" />
        </g>

        {/* ── Left Arm (Pointing/Relaxed) ── */}
        <g id="left-arm" className={leftArmClass}>
          {/* Sleeve */}
          <path d="M 115 225 L 90 275 L 105 282 L 122 235 Z" fill="url(#rainbowGrad)" />
          {/* Skin Cuff */}
          <circle cx="97" cy="283" r="8" fill="url(#skinGrad)" />
          {/* Hand/Fingers */}
          {phase === 2 ? (
            // Pointing Hand
            <g transform="translate(85, 275) rotate(-10)">
              <path d="M 0 5 C -15 5, -22 -2, -22 -8 C -22 -12, -15 -14, 0 -10 Z" fill="url(#skinGrad)" />
              <circle cx="0" cy="5" r="7" fill="url(#skinGrad)" />
            </g>
          ) : (
            // Relaxed Hand
            <circle cx="97" cy="290" r="6" fill="url(#skinGrad)" />
          )}
        </g>

        {/* ── Right Arm (Waving/Relaxed) ── */}
        <g id="right-arm" className={rightArmClass}>
          {/* Sleeve */}
          {phase === 1 ? (
            // Raised/Waving Arm sleeve
            <path d="M 185 225 L 212 170 L 227 178 L 196 235 Z" fill="url(#rainbowGrad)" />
          ) : (
            // Relaxed Arm sleeve
            <path d="M 185 225 L 210 275 L 195 282 L 178 235 Z" fill="url(#rainbowGrad)" />
          )}

          {/* Skin Cuff & Hand */}
          {phase === 1 ? (
            // Raised Waving Hand
            <g>
              <circle cx="220" cy="168" r="8" fill="url(#skinGrad)" />
              {/* Fingers waving */}
              <path d="M 215 162 L 210 150" stroke="url(#skinGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 220 160 L 218 146" stroke="url(#skinGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 225 162 L 226 148" stroke="url(#skinGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 228 166 L 235 156" stroke="url(#skinGrad)" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : (
            // Relaxed Hand
            <g>
              <circle cx="203" cy="283" r="8" fill="url(#skinGrad)" />
              <circle cx="203" cy="290" r="6" fill="url(#skinGrad)" />
            </g>
          )}
        </g>

        {/* ── Head (Face, Hair, Glasses) ── */}
        <g id="head" filter="url(#shadow)">
          {/* Neck */}
          <rect x="142" y="195" width="16" height="30" rx="4" fill="url(#skinGrad)" />
          {/* Neck shadow under face */}
          <ellipse cx="150" cy="201" rx="8" ry="4" fill="#000000" opacity="0.12" />
          
          {/* Face */}
          <ellipse cx="150" cy="155" rx="42" ry="46" fill="url(#skinGrad)" />

          {/* Hair (Layered quiff style, textured) */}
          <path d="M 108 150 C 100 120, 115 100, 135 98 C 145 80, 175 80, 185 102 C 205 105, 202 135, 195 155 C 195 125, 115 125, 108 150 Z" fill="url(#hairGrad)" />
          <path d="M 125 105 C 130 90, 145 90, 150 100 C 158 85, 172 90, 175 105 Z" fill="url(#hairHighlight)" />
          <path d="M 108 140 C 112 125, 122 120, 132 122" stroke="url(#hairHighlight)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 188 140 C 184 125, 174 120, 164 122" stroke="url(#hairHighlight)" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Eyebrows */}
          <path d="M 112 133 Q 125 126 138 132" stroke="#2E2E3A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {phase === 2 ? (
            // Raised playful eyebrow for winking
            <path d="M 162 130 Q 174 122 186 128" stroke="#2E2E3A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          ) : (
            // Normal eyebrow
            <path d="M 162 132 Q 174 126 186 133" stroke="#2E2E3A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          )}

          {/* Eyes Group for Cursor Tracking */}
          <g className="mascot-eyes-group">
            {/* Left Eye */}
            <ellipse cx="128" cy="152" rx="11" ry="13" fill="#FFFFFF" />
            <circle
              cx="128"
              cy="152"
              r="5.5"
              fill="#1A1A24"
              style={{
                transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                transformOrigin: '128px 152px',
                transition: 'transform 0.08s ease'
              }}
            />
            {/* Left Eye Shine */}
            <circle
              cx="130"
              cy="150"
              r="1.8"
              fill="#FFFFFF"
              style={{
                transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                transformOrigin: '128px 152px',
                transition: 'transform 0.08s ease'
              }}
            />

            {/* Right Eye (Normal tracking OR Wink based on state) */}
            {phase === 2 ? (
              // Closed winking arch
              <path
                d="M 161 154 Q 172 165 183 154"
                stroke="#1A1A24"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Open Eye
              <>
                <ellipse cx="172" cy="152" rx="11" ry="13" fill="#FFFFFF" />
                <circle
                  cx="172"
                  cy="152"
                  r="5.5"
                  fill="#1A1A24"
                  style={{
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    transformOrigin: '172px 152px',
                    transition: 'transform 0.08s ease'
                  }}
                />
                {/* Right Eye Shine */}
                <circle
                  cx="174"
                  cy="150"
                  r="1.8"
                  fill="#FFFFFF"
                  style={{
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    transformOrigin: '172px 152px',
                    transition: 'transform 0.08s ease'
                  }}
                />
              </>
            )}
          </g>

          {/* Glasses (Thin, modern wireframe with glass glare reflections) */}
          <circle cx="128" cy="152" r="16" fill="none" stroke="#2D3748" strokeWidth="2.5" />
          <circle cx="172" cy="152" r="16" fill="none" stroke="#2D3748" strokeWidth="2.5" />
          <path d="M 144 152 L 156 152" stroke="#2D3748" strokeWidth="2.5" />
          {/* Lenses glare reflections */}
          <path d="M 116 142 L 126 138" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M 160 142 L 170 138" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

          {/* Cheek Blush */}
          <ellipse cx="114" cy="170" rx="7" ry="3.5" fill="#FF8B8B" opacity="0.35" />
          <ellipse cx="186" cy="170" rx="7" ry="3.5" fill="#FF8B8B" opacity="0.35" />

          {/* Smiling Mouth */}
          <path d="M 138 178 Q 150 188 162 178" stroke="#E74C3C" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </g>
      </svg>

      {/* Skin Picker — shown only on non-nav mascot */}
      {!isNav && (
        <div className={styles.skinPicker}>
          {SKINS.map(skin => (
            <button
              key={skin.id}
              className={`${styles.skinDot} ${activeSkin === skin.id ? styles.skinDotActive : ''}`}
              onClick={(e) => { e.stopPropagation(); setActiveSkin(skin.id); }}
              title={skin.title}
              style={{ background: `linear-gradient(135deg, ${skin.grad[0]}, ${skin.grad[3]})` }}
            >
              {skin.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
