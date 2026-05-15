'use client';

import { useEffect, useRef } from 'react';

export default function DNABackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Helix geometry ──────────────────────────────────────────────
    // The helix runs diagonally: top-right → bottom-left
    // We parameterise along a diagonal spine, then offset perpendicular to it.

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Spine: from (W*0.85, H*-0.05) to (W*0.55, H*1.05)
    // That gives a gentle diagonal tilt like the reference image.
    const STEPS = 200;       // smoothness
    const TWISTS = 3.5;      // full rotations along the spine
    const RADIUS = 90;       // half-width of the helix in px
    const STRAND_WIDTH_FRONT = 4.5;
    const STRAND_WIDTH_BACK  = 2.0;

    // Colour stops along the helix (top → bottom)
    // Reference: bright violet/purple at top, fading to soft lavender/pink at bottom
    const colorAt = (progress: number, z: number) => {
      // z in [-1, 1]: -1 = back, +1 = front
      // progress in [0, 1]: 0 = top, 1 = bottom

      // Hue shifts from 270 (violet) → 300 (pink-purple) → 320 (pink)
      const hue = 265 + progress * 55;
      // Saturation: vivid at top, softer at bottom
      const sat = 70 - progress * 20;
      // Lightness: slightly lighter at bottom
      const lit = 55 + progress * 15;
      // Alpha: front strands are more opaque
      const alpha = 0.35 + (z + 1) * 0.28;

      return `hsla(${hue}, ${sat}%, ${lit}%, ${alpha})`;
    };

    const rungColorAt = (progress: number, avgZ: number) => {
      const hue = 270 + progress * 50;
      const alpha = 0.12 + (avgZ + 1) * 0.14;
      return `hsla(${hue}, 65%, 65%, ${alpha})`;
    };

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      // Spine endpoints (diagonal, right side of canvas)
      const x0 = w * 0.82;
      const y0 = h * -0.02;
      const x1 = w * 0.52;
      const y1 = h * 1.02;

      // Spine direction vector (normalised)
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / len; // unit along spine
      const uy = dy / len;
      // Perpendicular (rotated 90°)
      const px = -uy;
      const py =  ux;

      // ── Build strand points ──────────────────────────────────────
      type Pt = { x: number; y: number; z: number; progress: number };
      const s1: Pt[] = [];
      const s2: Pt[] = [];

      for (let i = 0; i <= STEPS; i++) {
        const prog = i / STEPS;
        // Spine position
        const sx = x0 + dx * prog;
        const sy = y0 + dy * prog;

        const angle = prog * Math.PI * 2 * TWISTS + t;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle); // z-depth

        // Strand 1
        s1.push({
          x: sx + px * cosA * RADIUS,
          y: sy + py * cosA * RADIUS,
          z: sinA,
          progress: prog,
        });
        // Strand 2 (opposite phase)
        s2.push({
          x: sx - px * cosA * RADIUS,
          y: sy - py * cosA * RADIUS,
          z: -sinA,
          progress: prog,
        });
      }

      // ── Draw rungs (base pairs) ──────────────────────────────────
      // Draw every ~4th step so they're spaced like the reference
      const RUNG_STEP = 4;
      for (let i = 0; i <= STEPS; i += RUNG_STEP) {
        const p1 = s1[i];
        const p2 = s2[i];
        if (!p1 || !p2) continue;

        const avgZ = (p1.z + p2.z) / 2; // ≈ 0 always for rungs
        const col = rungColorAt(p1.progress, avgZ);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Draw a strand as a smooth bezier path ────────────────────
      const drawStrand = (strand: Pt[], glowPass: boolean) => {
        if (strand.length < 2) return;

        for (let i = 0; i < strand.length - 1; i++) {
          const a = strand[i];
          const b = strand[i + 1];

          const col = colorAt(a.progress, a.z);
          const width = glowPass
            ? 10
            : STRAND_WIDTH_BACK + (a.z + 1) * ((STRAND_WIDTH_FRONT - STRAND_WIDTH_BACK) / 2);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = glowPass
            ? colorAt(a.progress, a.z).replace(/[\d.]+\)$/, '0.06)')
            : col;
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
      };

      // Glow pass (wide, very transparent)
      // Removed ctx.filter = 'blur(6px)' for Chrome performance
      ctx.save();
      drawStrand(s1, true);
      drawStrand(s2, true);
      ctx.restore();

      // Solid strands
      drawStrand(s1, false);
      drawStrand(s2, false);

      // ── Node dots at rung attachment points ──────────────────────
      for (let i = 0; i <= STEPS; i += RUNG_STEP) {
        const p1 = s1[i];
        const p2 = s2[i];
        if (!p1 || !p2) continue;

        for (const p of [p1, p2]) {
          const r = 2.5 + (p.z + 1) * 1.5;
          const col = colorAt(p.progress, p.z);
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        }
      }

      // ── Floating micro-particles (dust cloud around helix) ───────
      // Seeded so they don't jump — use deterministic positions
      const N_PARTICLES = 80;
      for (let i = 0; i < N_PARTICLES; i++) {
        const seed = i * 2.399; // golden angle
        const prog = (i / N_PARTICLES);
        const sx = x0 + dx * prog;
        const sy = y0 + dy * prog;

        // Scatter around the spine
        const scatter = RADIUS * 1.8;
        const ox = Math.sin(seed * 7.3 + t * 0.4) * scatter;
        const oy = Math.cos(seed * 5.1 + t * 0.3) * scatter * 0.4;

        const px2 = sx + px * ox + ux * oy;
        const py2 = sy + py * ox + uy * oy;

        const size = 0.6 + Math.abs(Math.sin(seed * 3.7 + t)) * 1.2;
        const alpha = 0.04 + Math.abs(Math.sin(seed * 2.1 + t * 0.5)) * 0.1;
        const hue = 265 + prog * 55;

        ctx.beginPath();
        ctx.arc(px2, py2, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 65%, ${alpha})`;
        ctx.fill();
      }

      t += 0.008;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
