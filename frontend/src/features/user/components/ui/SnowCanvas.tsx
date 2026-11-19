import { useEffect, useImperativeHandle, useRef } from "react";

export type SnowHandle = {
  /** Throw a burst of coloured snow from a viewport (clientX/clientY) point */
  burst: (clientX: number, clientY: number, count?: number) => void;
};

type Flake = {
  x: number; y: number; r: number; vx: number; vy: number;
  a: number; t: number; ph: number; c: string;
  burst?: boolean; life?: number;
};

type SnowCanvasProps = {
  ref?: React.Ref<SnowHandle>;
  /** Number of ambient falling flakes (bursts are extra) */
  flakes?: number;
  /** Speed multiplier for ambient flakes */
  speed?: number;
  /** Ambient flakes recycle this many px above the bottom edge (e.g. to stop at an ice shelf) */
  floor?: number;
  className?: string;
};

const BURST_COLOURS = ["#fff", "#CFE3FF", "#FFD447", "#FFB4AC"];

const mkFlake = (w: number, h: number, init: boolean): Flake => ({
  x: Math.random() * w,
  y: init ? Math.random() * h : -10,
  r: 1 + Math.random() * 3,
  vx: (Math.random() - 0.5) * 0.3,
  vy: 0.35 + Math.random() * 1.1,
  a: 0.35 + Math.random() * 0.55,
  t: 0,
  ph: Math.random() * 6,
  c: "#fff",
});

/**
 * Gentle falling snow on a canvas that fills its (relative) parent.
 * Only animates while on screen, and is disabled for prefers-reduced-motion.
 */
const SnowCanvas: React.FC<SnowCanvasProps> = ({ ref, flakes = 90, speed = 1, floor = 0, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{ flakes: Flake[]; w: number; h: number; wake: () => void }>({
    flakes: [], w: 0, h: 0, wake: () => {},
  });

  useImperativeHandle(ref, () => ({
    burst(clientX, clientY, count = 34) {
      const c = canvasRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = clientX - r.left, y = clientY - r.top;
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2, s = 1.5 + Math.random() * 4.5;
        stateRef.current.flakes.push({
          x, y, r: 1.5 + Math.random() * 3.5, vx: Math.cos(ang) * s, vy: Math.sin(ang) * s - 2,
          a: 1, t: 0, ph: 0, c: BURST_COLOURS[i % BURST_COLOURS.length], burst: true, life: 1,
        });
      }
      stateRef.current.wake();
    },
  }), []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const st = stateRef.current;
    let raf = 0;
    let visible = true;

    const fit = () => {
      const w = c.offsetWidth, h = c.offsetHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.w = w;
      st.h = h;
    };

    fit();
    if (!reduced) st.flakes = Array.from({ length: flakes }, () => mkFlake(st.w, st.h, true));

    const frame = () => {
      raf = 0;
      fit();
      ctx.clearRect(0, 0, st.w, st.h);
      for (const f of st.flakes) {
        f.t += 0.01;
        f.x += f.vx + (f.burst ? 0 : Math.sin(f.t + f.ph) * 0.3);
        f.y += f.burst ? f.vy : f.vy * speed;
        if (f.burst) {
          f.vy += 0.06;
          f.vx *= 0.985;
          f.life! -= 0.011;
        } else if (f.y > st.h + 10 - floor) {
          Object.assign(f, mkFlake(st.w, st.h, false));
        }
        ctx.globalAlpha = f.burst ? Math.max(0, f.life!) : f.a;
        ctx.fillStyle = f.c;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      st.flakes = st.flakes.filter((f) => !f.burst || f.life! > 0);
      // Keep animating while visible and there is something to draw
      if (visible && st.flakes.length) raf = requestAnimationFrame(frame);
    };

    st.wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) st.wake();
    });
    io.observe(c);
    st.wake();

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      st.wake = () => {};
    };
  }, [flakes, speed, floor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default SnowCanvas;
