import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import Bear from "../ui/Bear";
import { ArrowRight, Check, Cross, Person } from "../ui/Icons";

const MODES = [
  { label: "1-on-1", n: 1, min: "60", bar: "100%", room: "YOUR PRIVATE CLASS", tag: "Full focus", tagBg: "#DDF3E6", tagFg: "#1E7A4B", c: "#7FE0A8", cta: "Book 1-on-1", yes: [1, 1, 1, 0] },
  { label: "Pool of 5", n: 5, min: "12", bar: "20%", room: "YOUR POOL", tag: "Small & social", tagBg: "#EDE6FB", tagFg: "#512B81", c: "#CFE3FF", cta: "Find a pool", yes: [1, 1, 1, 1] },
  { label: "Class of 40", n: 40, min: "1.5", bar: "2.5%", room: "A CROWDED CLASSROOM", tag: "Easy to get lost", tagBg: "#FFE3DF", tagFg: "#B4332A", c: "#FF6B5E", cta: "", yes: [0, 0, 0, 1] },
] as const;

const ROWS = ["Teacher knows your pace", "Ask doubts anytime", "Lesson adapts to you", "Learn alongside friends"];

/** Seat i of the 40-seat grid for the chosen mode → how it should look */
const seatFor = (i: number, n: number) => {
  const small = n < 40;
  // Small groups sit in the middle row; "you" is the middle seat of the group
  const slot = small ? (n === 1 ? (i === 14 ? 0 : -1) : [12, 13, 14, 15, 16].indexOf(i)) : i;
  const on = small ? slot >= 0 : true;
  const you = small ? slot === Math.floor((n - 1) / 2) : i === 24;
  return {
    scale: on ? 1 : 0.35,
    opacity: on ? 1 : 0.12,
    bg: you ? "#FF6B5E" : on ? (small ? "#CFE3FF" : "#E4DDF2") : "#E4DDF2",
    ic: you ? "#2A1650" : on ? (small ? "#512B81" : "#A39CB5") : "transparent",
    shadow: you ? "0 6px 14px -6px rgba(255,107,94,.9)" : "none",
    delay: `${(i % 10) * 18}ms`,
  };
};

const ClassSizeSection: React.FC = () => {
  const [size, setSize] = useState(0);
  const m = MODES[size];

  return (
    <section className="relative overflow-hidden bg-ml-night text-white">
      <div
        aria-hidden="true"
        className="absolute w-[700px] h-[700px] -left-[260px] -top-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(146,98,245,.45),rgba(146,98,245,0) 65%)" }}
      />
      <div className="relative max-w-[1200px] mx-auto px-5 py-[clamp(72px,9vw,120px)]">
        <Reveal className="flex flex-col gap-3.5 max-w-[720px] mb-[clamp(28px,4vw,44px)]">
          <span className="text-[13px] font-extrabold tracking-[0.16em] text-ml-peach">WHY SMALL CLASSES</span>
          <h2 className="m-0 font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-none tracking-[-0.04em]">
            Smaller class.
            <br />
            <span className="text-ml-coral">Bigger attention.</span>
          </h2>
          <p className="m-0 text-[17px] leading-relaxed text-ml-soft max-w-[34em]">
            In a crowded class, one teacher is shared by everyone. At Mentorlive, it's just you, or you and up to four friends.
          </p>
        </Reveal>

        <Reveal>
          <div
            role="tablist"
            aria-label="Class size"
            className="flex gap-2 p-1.5 rounded-full bg-white/8 border border-white/14 w-max max-w-full overflow-x-auto no-scrollbar mb-[22px]"
          >
            {MODES.map((x, i) => (
              <button
                key={x.label}
                type="button"
                role="tab"
                aria-selected={i === size}
                onClick={() => setSize(i)}
                className={`flex-shrink-0 h-[46px] px-5 rounded-full font-extrabold text-[15px] whitespace-nowrap cursor-pointer transition-all duration-[250ms] ${
                  i === size ? "bg-white text-ml-deep" : "bg-transparent text-ml-soft hover:text-white"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-wrap gap-5 items-stretch">
          {/* Classroom */}
          <Reveal className="flex-[1.2_1_420px] min-w-0">
            <div className="h-full relative rounded-[32px] bg-ml-page text-ml-ink p-[clamp(20px,3vw,32px)] flex flex-col items-center gap-[18px] overflow-hidden">
              <div className="flex items-center gap-3 self-stretch justify-between">
                <span className="text-xs font-extrabold tracking-[0.14em] text-ml-muted">{m.room}</span>
                <span className="px-3 py-1.5 rounded-full text-xs font-extrabold" style={{ background: m.tagBg, color: m.tagFg }}>
                  {m.tag}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-[84px]"><Bear pose="guide" /></div>
                <div className="w-[120px] h-2.5 rounded-md bg-[#DCD3EE]" />
              </div>
              <div className="relative w-full max-w-[440px] grid grid-cols-10 gap-1.5" aria-hidden="true">
                {Array.from({ length: 40 }, (_, i) => {
                  const s = seatFor(i, m.n);
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-[30%] flex items-center justify-center"
                      style={{
                        background: s.bg,
                        transform: `scale(${s.scale})`,
                        opacity: s.opacity,
                        boxShadow: s.shadow,
                        transition: `transform .5s cubic-bezier(.3,1.5,.5,1) ${s.delay}, opacity .3s ${s.delay}, background .3s`,
                      }}
                    >
                      <Person className="w-[56%] h-[56%]" fill={s.ic} />
                    </div>
                  );
                })}
              </div>
              <div className="text-[13px] font-bold text-ml-muted flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-ml-coral" />
                That's you
              </div>
            </div>
          </Reveal>

          {/* Teacher time */}
          <Reveal delay={120} className="flex-[1_1_340px] min-w-0">
            <div className="h-full rounded-[32px] bg-white/6 border border-white/14 p-[clamp(22px,3vw,32px)] flex flex-col gap-[22px]">
              <div className="flex flex-col gap-2.5">
                <span className="text-[13px] font-bold text-ml-soft">Teacher's time for you, in a 60-minute class</span>
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-display font-extrabold text-[clamp(56px,7vw,84px)] leading-[0.9] tracking-[-0.05em] transition-colors"
                    style={{ color: m.c }}
                  >
                    {m.min}
                  </span>
                  <span className="text-lg font-extrabold text-ml-soft">min</span>
                </div>
                <div className="h-3 rounded-lg bg-white/12 overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-[width] duration-700 [transition-timing-function:cubic-bezier(.3,1,.4,1)]"
                    style={{ width: m.bar, background: m.c }}
                  />
                </div>
              </div>
              <ul className="m-0 p-0 list-none flex flex-col gap-3 pt-[18px] border-t border-dashed border-white/20">
                {ROWS.map((t, i) => {
                  const yes = m.yes[i];
                  return (
                    <li key={t} className="flex items-center gap-3">
                      <span
                        className="flex-[0_0_28px] h-7 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{ background: yes ? "#7FE0A8" : "rgba(255,255,255,.1)", color: yes ? "#14392A" : "#A99DC4" }}
                      >
                        {yes ? <Check className="w-3.5 h-3.5" strokeWidth={3.4} /> : <Cross className="w-3.5 h-3.5" />}
                      </span>
                      <span className="text-[15px] font-bold transition-colors duration-300" style={{ color: yes ? "#fff" : "#A99DC4" }}>
                        {t}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {m.cta && (
                <Link
                  to="/book-tutor"
                  className="mt-auto self-start h-[52px] px-6 rounded-full bg-ml-coral text-ml-deep font-extrabold text-[15px] inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5 hover:text-ml-deep"
                >
                  {m.cta}
                  <ArrowRight />
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ClassSizeSection;
