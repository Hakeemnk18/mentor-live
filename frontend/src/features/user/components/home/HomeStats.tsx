import { useEffect, useRef, useState } from "react";
import Reveal from "../ui/Reveal";

const stats = [
  { value: "500+", label: "QUALIFIED TUTORS" },
  { value: "50+", label: "SUBJECTS COVERED" },
  { value: "10k+", label: "HAPPY STUDENTS" },
  { value: "4.9/5", label: "AVG RATING" },
];

/** Counts the leading number of a stat ("10k+", "4.9/5") up from 0 once visible. */
const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const [shown, setShown] = useState(match ? (0).toFixed(decimals) + suffix : value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1400);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown((target * eased).toFixed(decimals) + suffix);
        if (t < 1) raf = requestAnimationFrame(tick);
        else setShown(value);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} aria-label={value}>
      {shown}
    </span>
  );
};

const HomeStats: React.FC = () => (
  <section className="relative z-[2] max-w-[1200px] mx-auto -mt-[clamp(64px,7vw,96px)] px-5">
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-3">
      {stats.map((s, i) => (
        <Reveal key={s.label} variant="zoom" delay={i * 90} className="h-full">
          <div className="relative h-full overflow-hidden bg-white rounded-[26px] p-[clamp(18px,2.4vw,24px)] shadow-[0_1px_0_rgba(42,22,80,.04),0_18px_40px_-18px_rgba(42,22,80,.28)]">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-ml-ice to-[#E4D8FF]" />
            <div className="font-display font-extrabold text-[clamp(30px,4vw,48px)] leading-none text-ml-plum tracking-[-0.035em] whitespace-nowrap">
              <CountUp value={s.value} />
            </div>
            <div className="text-[11px] font-extrabold tracking-[0.12em] text-ml-muted mt-2">{s.label}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default HomeStats;
