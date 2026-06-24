import useReveal from '../hooks/useReveal';
import styles from './Epoch.module.css';

// Each major section is framed as a step in a training run — this is the
// thread that ties the whole page back to the neural-network signature.
export default function Epoch({ id, index, total, title, children, wide, hideEpoch }) {
  const [ref, inView] = useReveal(0.1);

  return (
    <section id={id} className={styles.section}>
      <div className={`${styles.inner} ${wide ? styles.wide : ''}`} ref={ref}>
        <div className={`${styles.header} ${inView ? styles.in : ''}`}>
          {!hideEpoch && (
            <div className={styles.epochTag}>
              epoch {String(index).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </div>
          )}

          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={`${styles.body} ${inView ? styles.in : ''}`}>{children}</div>
      </div>
    </section>
  );
}
