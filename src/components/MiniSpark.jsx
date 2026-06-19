import { useEffect, useRef } from 'react';

// Small per-card loss/metric curve — reinforces the training-run motif
// at a micro scale without competing with the hero's network canvas.
export default function MiniSpark({ points, color = '94, 234, 212' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = 36;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const step = w / (points.length - 1);

    const coords = points.map((p, i) => [i * step, h - ((p - min) / range) * (h - 6) - 3]);

    ctx.beginPath();
    ctx.moveTo(coords[0][0], coords[0][1]);
    coords.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.strokeStyle = `rgba(${color}, 0.9)`;
    ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `rgba(${color}, 0.18)`);
    grad.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = grad;
    ctx.fill();
  }, [points, color]);

  return <canvas ref={ref} style={{ display: 'block', width: '100%' }} />;
}
