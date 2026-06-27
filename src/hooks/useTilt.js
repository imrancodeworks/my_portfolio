import { useRef, useCallback } from 'react';

/**
 * useTilt — mouse-tracking 3D tilt + specular shine
 * On touch devices: softer tilt angle (max 8°) + vertical-scroll guard
 * so the effect stays alive on mobile without fighting natural scrolling.
 * @param {number} maxTilt  max rotation in degrees for desktop (default 14)
 */

const isTouchDevice =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function useTilt(maxTilt = 14) {
  const ref          = useRef(null);
  const touchStartY  = useRef(0);
  const touchStartX  = useRef(0);
  const isScrolling  = useRef(false);

  // Softer angle on touch so GPU stays comfortable
  const tilt = isTouchDevice ? Math.min(maxTilt, 8) : maxTilt;

  const applyTilt = useCallback((clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width  - 0.5;
    const y = (clientY - rect.top)  / rect.height - 0.5;
    const ry =  x * tilt;
    const rx = -y * tilt;
    el.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04,1.04,1.04)`;
    el.style.transition = 'transform 0.08s ease';

    // Move specular shine to touch/cursor position
    const shine = el.querySelector('[data-shine]');
    if (shine) {
      const px = (x + 0.5) * 100;
      const py = (y + 0.5) * 100;
      shine.style.background =
        `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.22) 0%, transparent 55%)`;
      shine.style.opacity = '1';
    }
  }, [tilt]);

  const onMouseMove = useCallback((e) => {
    applyTilt(e.clientX, e.clientY);
  }, [applyTilt]);

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 0) return;
    const t = e.touches[0];
    touchStartY.current = t.clientY;
    touchStartX.current = t.clientX;
    isScrolling.current = false;
    applyTilt(t.clientX, t.clientY);
  }, [applyTilt]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 0) return;
    const touch  = e.touches[0];
    const deltaY = Math.abs(touch.clientY - touchStartY.current);
    const deltaX = Math.abs(touch.clientX - touchStartX.current);

    // If the gesture is more vertical than horizontal → user is scrolling;
    // skip tilt so it doesn't fight native scroll momentum.
    if (!isScrolling.current && deltaY > 8 && deltaY > deltaX * 1.5) {
      isScrolling.current = true;
    }

    if (!isScrolling.current) {
      applyTilt(touch.clientX, touch.clientY);
    }
  }, [applyTilt]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    el.style.transition = 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1)';
    const shine = el.querySelector('[data-shine]');
    if (shine) { shine.style.opacity = '0'; }
  }, []);

  const onTouchEnd = useCallback(() => {
    isScrolling.current = false;
    onMouseLeave();
  }, [onMouseLeave]);

  return { ref, onMouseMove, onMouseLeave, onTouchStart, onTouchMove, onTouchEnd };
}
