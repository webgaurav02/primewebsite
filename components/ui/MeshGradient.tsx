"use client";

import { useEffect, useRef } from "react";

type Orb = {
  cx: number; cy: number;          // centre (0–1 of canvas)
  range: number;                   // how far it drifts
  fx: number; fy: number;          // frequency multipliers for x/y
  px: number; py: number;          // phase offsets
  radius: number;                  // radius as fraction of max(w,h)
  rgba: [number, number, number, number];
};

const ORBS: Orb[] = [
  // large dominant mid-green — drifts top-left
  { cx: 0.22, cy: 0.40, range: 0.22, fx: 1.00, fy: 1.30, px: 0.00, py: 1.00, radius: 0.60, rgba: [45,  106, 79,  0.72] },
  // mint accent — right side, keeps it luminous
  { cx: 0.78, cy: 0.28, range: 0.18, fx: 0.70, fy: 0.90, px: 2.00, py: 0.50, radius: 0.42, rgba: [116, 198, 157, 0.24] },
  // deep green shadow — creates a dark pocket in the centre-bottom
  { cx: 0.52, cy: 0.72, range: 0.24, fx: 1.20, fy: 0.80, px: 1.00, py: 2.50, radius: 0.55, rgba: [18,  52,  30,  0.88] },
  // secondary teal — lower right, slow orbit
  { cx: 0.82, cy: 0.68, range: 0.16, fx: 0.60, fy: 1.10, px: 3.00, py: 1.50, radius: 0.40, rgba: [55,  130, 88,  0.40] },
  // near-black anchor — left edge, keeps the base very dark
  { cx: 0.10, cy: 0.58, range: 0.14, fx: 1.40, fy: 0.70, px: 0.50, py: 3.00, radius: 0.36, rgba: [6,   20,  12,  1.00] },
  // subtle lime highlight — floats near top-right on a long period
  { cx: 0.65, cy: 0.15, range: 0.20, fx: 0.50, fy: 1.50, px: 4.00, py: 0.80, radius: 0.30, rgba: [90,  170, 120, 0.18] },
];

export default function MeshGradient({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const setSize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) { raf = requestAnimationFrame(draw); return; }

      const t = Date.now() * 0.000065; // very slow drift

      // Base fill
      ctx.fillStyle = "#0b1c10";
      ctx.fillRect(0, 0, w, h);

      // Layered radial orbs
      for (const orb of ORBS) {
        const x = (orb.cx + Math.sin(t * orb.fx + orb.px) * orb.range) * w;
        const y = (orb.cy + Math.cos(t * orb.fy + orb.py) * orb.range) * h;
        const r = orb.radius * Math.max(w, h);
        const [R, G, B, A] = orb.rgba;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0,   `rgba(${R},${G},${B},${A})`);
        grad.addColorStop(0.45,`rgba(${R},${G},${B},${+(A * 0.28).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${R},${G},${B},0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
