import { Fragment, forwardRef, useEffect, useRef } from "react";
import Reveal from "../ui/Reveal";
import walkCycle from "../../../../assets/mentor/bears/walk-cycle.webp";
import { TINTS } from "../ui/tints";

const STEPS = [
  { title: "Share Your Learning Needs", desc: "Class, syllabus, goals." },
  { title: "Get Matched & Choose Mode", desc: "View matched faculty. Choose 1-to-1 or group (pooling)." },
  { title: "Register & Confirm", desc: "Submit details. Our team contacts you to confirm schedule & payment." },
  { title: "Start Learning", desc: "Live sessions begin with your assigned faculty." },
];
const DOTS = [12.5, 37.5, 62.5, 87.5];

// walk-cycle.webp: 8 frames side by side (left step, then right step)
const WALK_FRAMES = 8;
const STRIDE_RATIO = 1 / 6; // distance walked per frame, relative to the bear's width
const MAX_SPEED_PX = 6;     // per animation frame, so fast scrolling never skips leg frames
const CORAL = "#FF6B5E";
const IDLE = "#DCD3EE";
const DASHES = { background: `repeating-linear-gradient(90deg,${IDLE} 0 10px,transparent 10px 18px)` };
const V_DASHES = { background: `repeating-linear-gradient(180deg,${IDLE} 0 10px,transparent 10px 18px)` };
const BEAR_SPRITE = {
  backgroundImage: `url(${walkCycle})`,
  backgroundSize: `${WALK_FRAMES * 100}% 100%`,
  backgroundPosition: "0 0",
};

// Phones: the path turns down the side margin, this far outside the cards (middle of the 20px margin)
const GUTTER_PX = 10;
const LANE_LINE_Y = 56;     // centre of the walkway line inside a walkway row
const PHONE_BEAR_HALF = 31; // half the phone bear's width

type Walker = { cur: number | null; walked: number; facingLeft: boolean; dir: number };
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const HowItWorks = forwardRef<HTMLElement>(function HowItWorks(_props, sectionRef) {
  const innerRef = useRef<HTMLDivElement>(null);
  // tablet / desktop: one long track
  const trackRef = useRef<HTMLDivElement>(null);
  const bearRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  // phones: one snake path, across above each card, then down the side margin to the next one
  const laneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const laneBearRefs = useRef<(HTMLDivElement | null)[]>([]);
  const laneFillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const laneDotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sideFillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const startDotRef = useRef<HTMLDivElement>(null);

  // The bear follows the scroll at walking speed (capped) and its legs step with the
  // distance it actually walks, so the steps look right on any path length.
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const desk: Walker = { cur: null, walked: 0, facingLeft: false, dir: 1 };  // 0..1 along the track
    const snake: Walker = { cur: null, walked: 0, facingLeft: false, dir: 1 }; // px along the phone path

    /** Moves a walker towards its target. Returns true while it is still walking. */
    const walk = (w: Walker, target: number, unitPx: number) => {
      if (w.cur === null || reduced || unitPx <= 0) { w.cur = target; return false; }
      const gapPx = (target - w.cur) * unitPx;
      if (Math.abs(gapPx) < 0.5) { w.cur = target; return false; }
      const step = Math.max(-MAX_SPEED_PX, Math.min(MAX_SPEED_PX, gapPx * 0.12));
      w.dir = Math.sign(step);
      w.walked += Math.abs(step);
      w.cur += step / unitPx;
      return true;
    };

    const paintBear = (bear: HTMLDivElement, w: Walker) => {
      const stride = Math.max(4, bear.clientWidth * STRIDE_RATIO);
      const frame = Math.floor(w.walked / stride) % WALK_FRAMES;
      bear.style.backgroundPosition = `${(frame * 100) / (WALK_FRAMES - 1)}% 0`;
      bear.style.transform = w.facingLeft ? "scaleX(-1)" : "";
    };

    const light = (d: HTMLDivElement | null, on: boolean) => {
      if (!d) return;
      d.style.background = on ? CORAL : "#fff";
      d.style.borderColor = on ? CORAL : IDLE;
    };

    const tick = () => {
      raf = 0;
      let moving = false;
      const vh = window.innerHeight;

      // tablet / desktop track
      const track = trackRef.current;
      const bear = bearRef.current;
      if (track && bear && innerRef.current && track.offsetParent !== null) {
        const r = innerRef.current.getBoundingClientRect();
        const target = reduced ? 1 : clamp01((vh * 0.8 - r.top - 120) / (r.height * 0.7));
        if (walk(desk, target, track.clientWidth * 0.75)) moving = true;
        desk.facingLeft = desk.dir < 0;
        const p = desk.cur ?? target;
        bear.style.left = `${12.5 + 75 * p}%`;
        paintBear(bear, desk);
        if (fillRef.current) fillRef.current.style.width = `${75 * p}%`;
        dotRefs.current.forEach((d, i) => light(d, p >= i / 3 - 0.01));
      }

      // phones: walkway i runs across above card i (even ones left → right), then the path turns
      // down the side margin beside card i to walkway i + 1. The bear walks the walkways and is
      // out of sight (behind the card) on the side parts.
      const laneEls = laneRefs.current;
      const n = STEPS.length;
      if (laneEls.length === n && laneEls.every(Boolean) && laneEls[0]!.offsetParent !== null) {
        const W = laneEls[0]!.clientWidth;
        const across = W + GUTTER_PX * 2; // walkway length, margin to margin
        const lineY = laneEls.map((l) => l!.getBoundingClientRect().top + LANE_LINE_Y); // in the viewport
        const down = lineY.slice(0, -1).map((y, i) => lineY[i + 1] - y);                // side part lengths

        // Scroll → distance along the path. Walkway i fills while its line moves up from refY + R
        // to refY; its side part then fills while the next walkway comes up, so they never overlap.
        const refY = vh * 0.72;
        // most of the scroll goes to the walkways, so the bear is in view most of the time
        const R = Math.max(40, Math.min(vh * 0.4, Math.min(...down) * 0.7));
        let target = 0;
        lineY.forEach((y, i) => {
          target += clamp01((refY + R - y) / R) * across;
          if (i < n - 1) target += clamp01((refY - y) / (down[i] - R)) * down[i];
        });
        if (reduced) target = across * n + down.reduce((a, b) => a + b, 0);
        if (walk(snake, target, 1)) moving = true;
        const cur = snake.cur ?? target;

        let rest = cur;
        laneEls.forEach((_lane, i) => {
          const rtl = i % 2 === 1;
          const onLane = Math.min(across, Math.max(0, rest)); // px walked on this walkway
          rest -= across;
          const onSide = i < n - 1 ? Math.min(down[i], Math.max(0, rest)) : 0;
          if (i < n - 1) rest -= down[i];
          // the bear belongs to this walkway while it is on it (or standing at the very start)
          const here = (onLane > 0 || (i === 0 && cur <= 0)) && onSide === 0 && (onLane < across || i === n - 1);

          const fill = laneFillRefs.current[i];
          if (fill) {
            fill.style.width = `${onLane}px`;
            fill.style.left = `${rtl ? W + GUTTER_PX - onLane : -GUTTER_PX}px`;
          }
          const side = sideRefs.current[i];
          if (side) side.style.height = `${down[i] ?? 0}px`;
          const sideFill = sideFillRefs.current[i];
          if (sideFill) sideFill.style.height = `${onSide}px`;
          light(laneDotRefs.current[i], onLane >= across - 0.5);

          // the bear walks inside the walkway and fades as it turns the corner at either end
          const laneBear = laneBearRefs.current[i];
          if (laneBear) {
            const x = rtl ? W + GUTTER_PX - onLane : onLane - GUTTER_PX;
            laneBear.style.left = `${Math.min(W - PHONE_BEAR_HALF, Math.max(PHONE_BEAR_HALF, x))}px`;
            const edge = PHONE_BEAR_HALF + GUTTER_PX;
            const fadeIn = i === 0 ? 1 : clamp01(onLane / edge);
            const fadeOut = i === n - 1 ? 1 : clamp01((across - onLane) / edge);
            const show = here ? Math.min(fadeIn, fadeOut) : 0;
            laneBear.style.opacity = String(show);
            if (show > 0) {
              snake.facingLeft = rtl ? snake.dir > 0 : snake.dir < 0;
              paintBear(laneBear, snake);
            }
          }
        });
        light(startDotRef.current, true);
      }

      if (moving) raf = requestAnimationFrame(tick); // keep walking until it reaches the scroll position
    };

    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative overflow-hidden bg-white scroll-mt-[72px]">
      <div ref={innerRef} className="max-w-[1200px] mx-auto px-5 py-[clamp(72px,9vw,120px)]">
        <Reveal stagger className="text-center max-w-[640px] mx-auto mb-[clamp(20px,5vw,56px)] flex flex-col gap-3.5 items-center">
          <span className="text-[13px] font-extrabold tracking-[0.16em] text-ml-rust whitespace-nowrap">4 SIMPLE STEPS</span>
          <h2 className="m-0 font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-none tracking-[-0.04em] text-ml-deep">
            How Learning Works
          </h2>
          <p className="m-0 text-[17px] text-ml-muted">Scroll down and follow the bear.</p>
        </Reveal>

        {/* Tablet / desktop: one track with the walking bear */}
        <div ref={trackRef} className="relative h-[72px] mt-12 mb-3 hidden sm:block" aria-hidden="true">
          <div className="absolute left-[12.5%] right-[12.5%] top-[46px] h-1 rounded" style={DASHES} />
          <div ref={fillRef} className="absolute left-[12.5%] top-[46px] h-1 rounded bg-ml-coral" style={{ width: 0 }} />
          {DOTS.map((left, i) => (
            <div
              key={left}
              ref={(el) => { dotRefs.current[i] = el; }}
              className="absolute top-[37px] w-[22px] h-[22px] -ml-[11px] rounded-full bg-white border-[3px] border-[#DCD3EE] transition-colors duration-300"
              style={{ left: `${left}%` }}
            />
          ))}
          <div
            ref={bearRef}
            className="absolute left-[12.5%] -top-[43px] w-[84px] h-[91px] -ml-[42px] z-[2] bg-no-repeat drop-shadow-[0_14px_16px_rgba(20,8,50,0.28)]"
            style={BEAR_SPRITE}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STEPS.map((s, i) => {
            const t = TINTS[i % TINTS.length];
            const reverse = i % 2 === 1;
            return (
              <Fragment key={s.title}>
                {/* Phones: walkway above each card (alternating direction), joined by a line down the side */}
                <div
                  ref={(el) => { laneRefs.current[i] = el; }}
                  className="relative h-[72px] sm:hidden"
                  aria-hidden="true"
                >
                  <div className="absolute left-[-10px] right-[-10px] top-[54px] h-1" style={DASHES} />
                  {i < STEPS.length - 1 && (
                    <div
                      ref={(el) => { sideRefs.current[i] = el; }}
                      className={`absolute top-[56px] w-1 ${reverse ? "left-[-12px]" : "right-[-12px]"}`}
                      style={{ ...V_DASHES, height: 0 }}
                    >
                      <div ref={(el) => { sideFillRefs.current[i] = el; }} className="w-1 bg-ml-coral" style={{ height: 0 }} />
                    </div>
                  )}
                  <div
                    ref={(el) => { laneFillRefs.current[i] = el; }}
                    className="absolute top-[54px] h-1 bg-ml-coral"
                    style={{ left: -GUTTER_PX, width: 0 }}
                  />
                  {i === 0 && (
                    <div
                      ref={startDotRef}
                      className="absolute top-[48px] left-[-18px] w-4 h-4 rounded-full bg-white border-[3px] border-[#DCD3EE] z-[1]"
                    />
                  )}
                  <div
                    ref={(el) => { laneDotRefs.current[i] = el; }}
                    className={`absolute top-[48px] w-4 h-4 rounded-full bg-white border-[3px] border-[#DCD3EE] transition-colors duration-300 z-[1] ${reverse ? "left-[-18px]" : "right-[-18px]"}`}
                  />
                  <div
                    ref={(el) => { laneBearRefs.current[i] = el; }}
                    className="absolute left-[31px] top-[-11px] w-[62px] h-[67px] -ml-[31px] z-[2] bg-no-repeat drop-shadow-[0_10px_12px_rgba(20,8,50,0.26)]"
                    style={{ ...BEAR_SPRITE, opacity: i === 0 ? 1 : 0 }}
                  />
                </div>

                <Reveal variant="zoom" delay={i * 110}>
                  <div
                    className="h-full rounded-[22px] sm:rounded-[28px] px-5 sm:px-6 pt-5 sm:pt-[26px] pb-5 sm:pb-7 flex flex-col gap-2 sm:gap-3 transition-transform duration-300 hover:-translate-y-1.5 hover:-rotate-1"
                    style={{ background: t.bg }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-11 h-11 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-[18px] bg-white flex items-center justify-center font-display font-extrabold text-[20px] sm:text-[26px] shadow-[0_8px_18px_-10px_rgba(42,22,80,.4)]"
                        style={{ color: t.ink }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-xs font-extrabold tracking-[0.14em]" style={{ color: t.ink }}>
                        STEP 0{i + 1}
                      </span>
                    </div>
                    <h3 className="m-0 mt-1 sm:mt-2 font-display font-extrabold text-[19px] sm:text-[22px] leading-[1.15] text-ml-ink tracking-[-0.02em]">
                      {s.title}
                    </h3>
                    <p className="m-0 text-[14px] sm:text-[15px] leading-[1.5] sm:leading-[1.55] text-ml-body">{s.desc}</p>
                  </div>
                </Reveal>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
