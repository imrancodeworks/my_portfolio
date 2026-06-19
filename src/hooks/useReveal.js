import { useEffect, useRef, useState } from 'react';

export default function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (entry.boundingClientRect.top > 0) {
          // Only reset animation if we scrolled UP (element is below viewport)
          setInView(false);
        }
      },
      { threshold }
    );
    obs.observe(el);

    const onNavClick = (e) => {
      if (e.detail === el.id) {
        setInView(false);
      }
    };
    window.addEventListener('nav-click', onNavClick);

    return () => {
      obs.disconnect();
      window.removeEventListener('nav-click', onNavClick);
    };
  }, [threshold]);

  return [ref, inView];
}
