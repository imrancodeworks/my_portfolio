import { useRef, useCallback } from 'react';

/**
 * useTilt — mouse-tracking 3D tilt + specular shine
 * @param {number} maxTilt  max rotation in degrees (default 14)
 */
export default function useTilt(maxTilt = 14) {
  const ref = useRef(null);

  const handleMove = useCallback((clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width  - 0.5;
    const y = (clientY - rect.top)  / rect.height - 0.5;
    const ry =  x * maxTilt;
    const rx = -y * maxTilt;
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
  }, [maxTilt]);

  const onMouseMove = useCallback((e) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, [handleMove]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 0) return;
    // Don't call preventDefault to keep scrolling natural
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    el.style.transition = 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1)';
    const shine = el.querySelector('[data-shine]');
    if (shine) { shine.style.opacity = '0'; }
  }, []);

  const onTouchEnd = useCallback(() => {
    onMouseLeave();
  }, [onMouseLeave]);

  return { ref, onMouseMove, onMouseLeave, onTouchStart, onTouchMove, onTouchEnd };
}
