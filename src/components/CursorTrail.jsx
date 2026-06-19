import { useEffect, useRef } from 'react';

// A faint trailing dot, like a gradient-descent step marker following the
// cursor. Desktop-only, opt-out on reduced motion, never blocks input.
export default function CursorTrail() {
  const dotRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || isTouch) return;

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 16,
        height: 16,
        marginLeft: -8,
        marginTop: -8,
        borderRadius: '50%',
        border: '1px solid rgba(94, 234, 212, 0.4)',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
        transition: 'opacity 0.3s',
        mixBlendMode: 'screen',
      }}
    />
  );
}
