import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>built by Mohamed Imran H</span>
      <span className={styles.dot}>·</span>
      <span>2026</span>
    </footer>
  );
}
