import { useEffect, useRef } from 'react';

// A living neural-network: layered nodes, signal pulses traveling along
// synapses, gentle drift. This is the page's one signature visual —
// everything else stays quiet so this can be the thing people remember.
export default function NeuralCanvas({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext('2d');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile       = window.matchMedia('(pointer: coarse)').matches;

    let width, height, dpr;
    let nodes  = [];
    let pulses = [];
    let rafId;
    let lastTime = 0;

    const LAYER_COUNT = 5;
    const ACCENT  = '94, 234, 212';
    const ACCENT2 = '34, 211, 238';
    const AMBER   = '242, 166, 90';

    // Mobile: cap DPR at 1, fewer pulses, no node glow gradient
    const MAX_DPR      = isMobile ? 1 : 2;
    const MAX_PULSES   = isMobile ? 10 : 36;
    const SPAWN_RATE   = isMobile ? 0.3 : 0.12;  // slower spawning on mobile

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width  = rect.width;
      height = rect.height;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      canvas.style.width  = width  + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNetwork();
    }

    function buildNetwork() {
      nodes = [];
      const nodesPerLayer = [4, 6, 8, 6, 3];
      const layerGapX = width / (LAYER_COUNT + 0.4);

      for (let l = 0; l < LAYER_COUNT; l++) {
        const count = nodesPerLayer[l];
        const colX  = layerGapX * (l + 0.9);
        for (let n = 0; n < count; n++) {
          const gapY  = height / (count + 1);
          const baseY = gapY * (n + 1);
          nodes.push({
            layer: l,
            x: colX, y: baseY, baseY,
            phase:      Math.random() * Math.PI * 2,
            r:          2.2 + Math.random() * 1.6,
            activation: Math.random(),
          });
        }
      }
    }

    function getEdges() {
      const edges = [];
      for (let l = 0; l < LAYER_COUNT - 1; l++) {
        const layerA = nodes.filter(n => n.layer === l);
        const layerB = nodes.filter(n => n.layer === l + 1);
        layerA.forEach(a => {
          layerB.forEach(b => {
            if (Math.random() < 0.55) edges.push([a, b]);
          });
        });
      }
      return edges;
    }

    let edges = [];

    function spawnPulse() {
      if (!edges.length) return;
      const edge = edges[Math.floor(Math.random() * edges.length)];
      pulses.push({
        edge,
        t:     0,
        speed: 0.35 + Math.random() * 0.5,
        color: Math.random() < 0.15 ? AMBER : Math.random() < 0.5 ? ACCENT : ACCENT2,
      });
    }

    let spawnAccum = 0;

    function draw(time) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const t = time / 1000;

      // gentle vertical drift
      nodes.forEach(n => {
        n.y = n.baseY + Math.sin(t * 0.4 + n.phase) * 6;
      });

      // edges (very faint)
      ctx.lineWidth   = 1;
      ctx.strokeStyle = `rgba(94, 234, 212, 0.06)`;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      // pulses
      if (!prefersReduced && !isMobile) {
        spawnAccum += dt;
        if (spawnAccum > SPAWN_RATE) {
          spawnAccum = 0;
          if (pulses.length < MAX_PULSES) spawnPulse();
        }
      } else if (!prefersReduced && isMobile) {
        // slower pulse spawn on mobile
        spawnAccum += dt;
        if (spawnAccum > SPAWN_RATE) {
          spawnAccum = 0;
          if (pulses.length < MAX_PULSES) spawnPulse();
        }
      }

      pulses.forEach(p => { p.t += dt * p.speed; });
      pulses = pulses.filter(p => p.t < 1);

      pulses.forEach(p => {
        const [a, b] = p.edge;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;

        if (isMobile) {
          // Cheap solid dot — no radialGradient on mobile
          ctx.fillStyle = `rgba(${p.color}, 0.85)`;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Full glow gradient on desktop
          const glowR = 7;
          const grad  = ctx.createRadialGradient(x, y, 0, x, y, glowR);
          grad.addColorStop(0, `rgba(${p.color}, 0.9)`);
          grad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, glowR, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(${p.color}, 1)`;
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // nodes
      nodes.forEach(n => {
        n.activation += (Math.random() - 0.5) * 0.02;
        n.activation  = Math.max(0.15, Math.min(1, n.activation));

        if (!isMobile) {
          // Glow halo — expensive radialGradient only on desktop
          const glow = 3 + n.activation * 5;
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow * 2.2);
          grad.addColorStop(0, `rgba(${ACCENT}, ${0.35 * n.activation})`);
          grad.addColorStop(1, `rgba(${ACCENT}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(n.x, n.y, glow * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core dot — always drawn
        ctx.fillStyle = `rgba(232, 238, 236, ${0.55 + n.activation * 0.45})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    }

    resize();
    edges = getEdges();

    if (prefersReduced) {
      draw(0);
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => {
      resize();
      edges = getEdges();
    });
    ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
