import { forwardRef, useEffect, useRef } from "react";
import Reveal from "../ui/Reveal";
import Bear from "../ui/Bear";
import { TINTS } from "../ui/tints";

const STEPS = [
  { title: "Share Your Learning Needs", desc: "Class, syllabus, goals." },
  { title: "Get Matched & Choose Mode", desc: "View matched faculty. Choose 1-to-1 or group (pooling)." },
  { title: "Register & Confirm", desc: "Submit details. Our team contacts you to confirm schedule & payment." },
  { title: "Start Learning", desc: "Live sessions begin with your assigned faculty." },
];
const DOTS = [12.5, 37.5, 62.5, 87.5];

const HowItWorks = forwardRef<HTMLElement>(function HowItWorks(_props, sectionRef) {
  const innerRef = useRef<HTMLDivElement>(null);
  const bearRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // The bear walks along the track as the section scrolls through the viewport
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = innerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = reduced ? 1 : Math.min(1, Math.max(0, (vh * 0.8 - r.top - 120) / (r.height * 0.7)));
      if (bearRef.current) {
        bearRef.current.style.left = `${12.5 + 75 * p}%`;
        bearRef.current.style.transform = `rotate(${reduced ? 0 : Math.sin(p * 40) * 6}deg)`;
      }
      if (fillRef.current) fillRef.current.style.width = `${75 * p}%`;
      dotRefs.current.forEach((d, i) => {
        if (!d) return;
        const on = p >= i / 3 - 0.01;
        d.style.background = on ? "#FF6B5E" : "#fff";
        d.style.borderColor = on ? "#FF6B5E" : "#DCD3EE";
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative overflow-hidden bg-white scroll-mt-[72px]">
      <div ref={innerRef} className="max-w-[1200px] mx-auto px-5 py-[clamp(72px,9vw,120px)]">
        <Reveal className="text-center max-w-[640px] mx-auto mb-[clamp(36px,5vw,56px)] flex flex-col gap-3.5 items-center">
          <span className="text-[13px] font-extrabold tracking-[0.16em] text-ml-rust whitespace-nowrap">4 SIMPLE STEPS</span>
          <h2 className="m-0 font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-none tracking-[-0.04em] text-ml-deep">
            How Learning Works
          </h2>
          <p className="m-0 text-[17px] text-ml-muted">Scroll down and follow the bear.</p>
        </Reveal>

        {/* Track with walking bear (hidden on very small screens where steps stack) */}
        <div className="relative h-[72px] mt-12 mb-3 hidden sm:block" aria-hidden="true">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-[46px] h-1 rounded"
            style={{ background: "repeating-linear-gradient(90deg,#DCD3EE 0 10px,transparent 10px 18px)" }}
          />
          <div ref={fillRef} className="absolute left-[12.5%] top-[46px] h-1 rounded bg-ml-coral" style={{ width: 0 }} />
          {DOTS.map((left, i) => (
            <div
              key={left}
              ref={(el) => { dotRefs.current[i] = el; }}
              className="absolute top-[37px] w-[22px] h-[22px] -ml-[11px] rounded-full bg-white border-[3px] border-[#DCD3EE] transition-colors duration-300"
              style={{ left: `${left}%` }}
            />
          ))}
          <div ref={bearRef} className="absolute left-[12.5%] -top-10 w-[76px] -ml-[38px] z-[2]">
            <Bear pose="walk" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => {
            const t = TINTS[i % TINTS.length];
            return (
              <Reveal key={s.title} delay={i * 100}>
                <div
                  className="h-full rounded-[28px] px-6 pt-[26px] pb-7 flex flex-col gap-3 transition-transform duration-300 hover:-translate-y-1.5 hover:-rotate-1"
                  style={{ background: t.bg }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-14 h-14 rounded-[18px] bg-white flex items-center justify-center font-display font-extrabold text-[26px] shadow-[0_8px_18px_-10px_rgba(42,22,80,.4)]"
                      style={{ color: t.ink }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-xs font-extrabold tracking-[0.14em]" style={{ color: t.ink }}>
                      STEP 0{i + 1}
                    </span>
                  </div>
                  <h3 className="m-0 mt-2 font-display font-extrabold text-[22px] leading-[1.15] text-ml-ink tracking-[-0.02em]">
                    {s.title}
                  </h3>
                  <p className="m-0 text-[15px] leading-[1.55] text-ml-body">{s.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
