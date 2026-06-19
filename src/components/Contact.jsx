import Epoch from './Epoch';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <Epoch id="contact" index={5} total={5} command="curl -X POST imran.dev/contact" title="Let's build something with data" hideEpoch>
      <div className={styles.box}>
        <p className={styles.lede}>
          Open to AI/ML and full-stack opportunities. Send a message and I'll usually get back within a day.
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
