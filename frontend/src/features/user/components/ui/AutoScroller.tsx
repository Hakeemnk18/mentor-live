import { Children, useCallback, useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Width classes for every slide, e.g. "basis-[85%] sm:basis-1/2". */
  itemClassName: string;
  /** Time each slide stays before moving on (ms). */
  interval?: number;
  /** Accessible name of the carousel. */
  label: string;
  /** Spacing classes for the track. */
  gapClassName?: string;
  /** Extra classes for the scroll track (padding for card shadows etc.). */
  trackClassName?: string;
};

/** Pause auto-play this long after the user swipes / scrolls / clicks. */
const IDLE_AFTER_TOUCH = 6000;
/** First start waits for the cards' scroll-reveal animation to finish. */
const START_DELAY = 1100;

/**
 * Horizontal carousel built on native scroll + CSS scroll-snap:
 * - auto-advances one card at a time and loops; underline pagination shows progress
 * - fully manual too (swipe, trackpad, shift+wheel, clicking a line)
 * - pauses on hover/focus, after manual scrolling, off-screen, in background tabs,
 *   and never auto-plays for "reduce motion" users
 * Uses the browser's own smooth scrolling, so there is no JS animation loop to stutter.
 * The underline fill IS the timer: the next slide comes when it finishes, so the
 * line and the movement can never drift apart; pausing simply freezes the line.
 */
export default function AutoScroller({
  children,
  itemClassName,
  interval = 4500,
  label,
  gapClassName = "gap-[18px]",
  trackClassName = "",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<number[]>([0]);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [count, setCount] = useState(1); // reachable snap positions
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const items = Children.toArray(children);

  /* ── measure snap positions (first item offset → each card start, clamped to the end) ── */
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;
    const first = (track.children[0] as HTMLElement).offsetLeft;
    const max = track.scrollWidth - track.clientWidth;
    const pos: number[] = [];
    for (const child of Array.from(track.children)) {
      const p = Math.min((child as HTMLElement).offsetLeft - first, max);
      if (pos.length === 0 || p - pos[pos.length - 1] > 2) pos.push(p);
    }
    positionsRef.current = max > 2 ? pos : [0];
    setCount(positionsRef.current.length);
  }, []);

  const nearestIndex = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const x = track.scrollLeft;
    let best = 0;
    positionsRef.current.forEach((p, i) => {
      if (Math.abs(p - x) < Math.abs(positionsRef.current[best] - x)) best = i;
    });
    return best;
  };

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const pos = positionsRef.current;
    if (!track || pos.length === 0) return;
    track.scrollTo({ left: pos[((i % pos.length) + pos.length) % pos.length], behavior: "smooth" });
  }, []);

  /* ── observers: size changes, on-screen, tab visibility ── */
  useEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    if (!track || !root) return;

    const ro = new ResizeObserver(() => measure()); // also fires once on start
    ro.observe(track);
    Array.from(track.children).forEach((c) => ro.observe(c));

    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(root);

    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [measure, items.length]);

  /* ── track active slide while scrolling (rAF-throttled) ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setActive(nearestIndex());
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ── manual interaction → hold auto-play for a few seconds ── */
  const hold = () => {
    setHolding(true);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setHolding(false), IDLE_AFTER_TOUCH);
  };
  useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  }, []);

  /* ── first start: once the carousel is properly on screen and its cards have revealed ── */
  useEffect(() => {
    if (!inView || started) return;
    const t = setTimeout(() => setStarted(true), START_DELAY);
    return () => clearTimeout(t);
  }, [inView, started]);

  const canAuto = count > 1 && !reducedMotion;
  const playing = canAuto && started && inView && pageVisible && !hovered && !focused && !holding;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <div
        ref={trackRef}
        onTouchStart={hold}
        onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && hold()}
        className={`relative flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain no-scrollbar ${gapClassName} ${trackClassName}`}
      >
        {items.map((child, i) => (
          <div key={i} className={`snap-start shrink-0 grow-0 ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>

      {/* Underline pagination — the active line fills up while the slide is shown */}
      {count > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-5">
          {Array.from({ length: count }, (_, i) => {
            const on = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  hold();
                  goTo(i);
                }}
                aria-label={`Go to slide ${i + 1} of ${count}`}
                aria-current={on ? "true" : undefined}
                className="group py-2.5 cursor-pointer focus:outline-none"
              >
                <span
                  className={`relative block h-1 rounded-full overflow-hidden transition-[width,background-color] duration-300 group-focus-visible:ring-2 group-focus-visible:ring-ml-coral/50 ${
                    on ? "w-11 bg-ml-rose" : "w-5 bg-[#D2C6EC] group-hover:bg-[#FFB3AB]"
                  }`}
                >
                  {on && (
                    <span
                      key={active}
                      className="absolute inset-0 rounded-full bg-ml-coral origin-left ml-autoscroll-fill"
                      style={
                        canAuto
                          ? { animationDuration: `${interval}ms`, animationPlayState: playing ? "running" : "paused" }
                          : { animation: "none" }
                      }
                      onAnimationEnd={() => goTo(active + 1)}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes mlAutoFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .ml-autoscroll-fill { animation-name: mlAutoFill; animation-timing-function: linear; animation-fill-mode: both; }
        @media (prefers-reduced-motion: reduce) { .ml-autoscroll-fill { animation: none !important; } }
      `}</style>
    </div>
  );
}
