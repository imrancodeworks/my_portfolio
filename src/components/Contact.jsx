import Epoch from './Epoch';
import useTilt from '../hooks/useTilt';
import styles from './Contact.module.css';

export default function Contact() {
  const { ref, onMouseMove, onMouseLeave, onTouchStart, onTouchMove, onTouchEnd } = useTilt(10);

  return (
    <Epoch id="contact" index={5} total={5} command="curl -X POST imran.dev/contact" title="Let's build something with data" hideEpoch>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={styles.box}
      >
        {/* Specular shine overlay */}
        <div data-shine className={styles.shine} />

        {/* 3D Portal Background Depth Layers */}
        <div className={styles.portalBg} />
        <div className={styles.portalRing} />

        <p className={styles.lede}>
          Is this a portfolio, a weapons cache, or a secret portal? Send a transmission to find out. I usually materialize a response within a day—unless I've been summoned to another dimension.
        </p>
        <div className={styles.links}>
          <a className={styles.primary} href="mailto:imrancodeworks@gmail.com">
            Email me
          </a>
          <a className={styles.ghost} href="https://linkedin.com/in/mohamed-imran-h/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className={styles.ghost} href="https://github.com/imranpycode" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className={styles.ghost} href="tel:+916381659763">
            +91 63816 59763
          </a>
        </div>
      </div>
    </Epoch>
  );
}
