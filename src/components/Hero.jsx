import { useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';
import styles from './Hero.module.css';
import ChakraEffects from './ChakraEffects';
import Mascot from './Mascot';

// Detect touch/mobile once at module level
const IS_MOBILE =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

export default function Hero() {
  const videoRef  = useRef(null);
  const loopedRef = useRef(false);
  const [looped, setLooped] = useState(false);
  const [ref, inView] = useReveal(0.1);
  const [isMobile, setIsMobile] = useState(false);

  /* ── screen width detection for mobile mascot mounting ── */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ── video logic: play once, then loop last 2 s & slide right ──
     On mobile we skip the video entirely to save CPU + bandwidth.   */
  useEffect(() => {
    if (IS_MOBILE) return;           // ← no video on mobile
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
    video.play().catch(() => {});

    const onTime = () => {
      if (!video.duration) return;
      const loopStart = video.duration - 2;

      if (video.currentTime >= video.duration - 0.08) {
        if (!loopedRef.current) {
          loopedRef.current = true;
          setLooped(true);
        }
        video.currentTime = loopStart;
        video.play();
      }
    };

    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, []);

  /* ── Reset state when scrolling out of view so it re-animates ── */
  useEffect(() => {
    if (IS_MOBILE) return;
    if (!inView && looped) {
      setTimeout(() => {
        setLooped(false);
        loopedRef.current = false;
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.playbackRate = 0.75;
        }
      }, 0);
    }
  }, [inView, looped]);

  return (
    <section ref={ref} className={`${styles.hero} ${looped ? styles.heroSplit : ''}`} id="about">

      {/* ── background video — desktop only ── */}
      {!IS_MOBILE && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`${styles.bgVideo} ${looped ? styles.bgVideoRight : ''}`}
        >
          <source src="/rasingaan2.mp4" type="video/mp4" />
        </video>
      )}

      {/* ── chakra particle / lightning layer — desktop only (handled inside component) ── */}
      <ChakraEffects />

      {/* ── dark overlay so text stays readable ── */}
      <div className={`${styles.overlay} ${looped ? styles.overlayLeft : ''}`} />

      {/* ── hero content ── */}
      <div className={`${styles.content} ${looped ? styles.contentLeft : ''} ${inView ? styles.inView : ''}`}>

        {/* Mobile Mascot — Centered in the free space above the name */}
        {isMobile && (
          <div className={styles.mobileMascot}>
            <Mascot />
          </div>
        )}

        <h1 className={styles.headline}>
          <span className={styles.line}>Mohamed Imran H</span>
          <span className={styles.lineAccent}>trains models. ships products.</span>
        </h1>

        <p className={styles.summary}>
          AI/ML enthusiast with hands-on experience in predictive modeling, Flask deployment,
          REST API integration, and MERN-stack development — building data-driven applications
          that turn raw datasets into decisions.
        </p>

        <div className={styles.tags}>
          {['Problem Solving', 'Leadership', 'Project & Time Management', 'Team Collaboration', 'Communication'].map(
            (t) => <span key={t} className={styles.tag}>{t}</span>
          )}
        </div>

        <div className={styles.actions}>
          <a href="#projects" className={styles.btnPrimary}>
            View projects
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#contact" className={styles.btnGhost}>Get in touch</a>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span>scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
