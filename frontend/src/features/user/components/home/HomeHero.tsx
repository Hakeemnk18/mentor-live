import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Bear from "../ui/Bear";
import SnowCanvas, { type SnowHandle } from "../ui/SnowCanvas";
import FloatingTiles from "../ui/FloatingTiles";
import { ArrowRight } from "../ui/Icons";

const BUBBLES = [
  "Hi! I'm the Mentorlive bear. Tap anywhere here to make it snow.",
  "Whee! Do it again!",
  "You're a natural. Ready to find a tutor?",
  "Snow day = study day. Book a class!",
  "Okay, okay, I'm getting cold now.",
];

/** Shorter lines for the compact phone bubble (same order as BUBBLES) */
const MOBILE_BUBBLES = [
  "Tap me for snow!",
  "Whee! Again!",
  "Ready to find a tutor?",
  "Snow day = study day!",
  "Brr, I'm cold now.",
];

const HERO_POINTS =["Verified faculty", "1-on-1 or pool learning", "Flexible slots"];

type HomeHeroProps = {
  /** Smooth-scrolls to the "How Learning Works" section */
  onHowItWorks: () => void;
};

const HomeHero: React.FC<HomeHeroProps> = ({ onHowItWorks }) => {
  const snowRef = useRef<SnowHandle>(null);
  const bearRef = useRef<HTMLDivElement>(null);       // desktop/tablet bear
  const mobileBearRef = useRef<HTMLDivElement>(null); // compact bear beside the headline on phones
  const [pops, setPops] = useState(0);

  const hop = () => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    // Only one of the two bears is visible at a time; animate whichever is on screen
    const el = [bearRef.current, mobileBearRef.current].find((b) => b && b.offsetParent !== null);
    if (!el?.animate) return;
    el.animate(
      [
        { transform: "translateY(0) scale(1,1)" },
        { transform: "translateY(6px) scale(1.06,.92)", offset: 0.18 },
        { transform: "translateY(-46px) scale(.96,1.05) rotate(-4deg)", offset: 0.5 },
        { transform: "translateY(0) scale(1.04,.95)", offset: 0.82 },
        { transform: "translateY(0) scale(1,1)" },
      ],
      { duration: 650, easing: "ease-out" },
    );
  };

  const heroTap = (e: React.MouseEvent) => {
    // Let real buttons/links do their job without throwing snow
    if ((e.target as HTMLElement).closest("a,button")) return;
    snowRef.current?.burst(e.clientX, e.clientY);
    setPops((p) => p + 1);
    hop();
  };

  return (
    <section
      onClick={heroTap}
      className="relative overflow-hidden bg-ml-hero text-white cursor-pointer select-none"
    >
      <div
        aria-hidden="true"
        className="absolute w-[760px] h-[760px] -right-[200px] -top-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(146,98,245,.6),rgba(146,98,245,0) 65%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute w-[560px] h-[560px] -left-[220px] -bottom-[260px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(255,107,94,.25),rgba(255,107,94,0) 65%)" }}
      />
      <FloatingTiles
        tiles={[
          { pos: "left-[5%] top-[16%]", size: 44, rotate: 18, duration: 7 },
          { pos: "left-[44%] top-[9%]", size: 26, rotate: -14, tint: true, duration: 9 },
          { pos: "right-[4%] top-[62%]", size: 56, rotate: 32, duration: 8 },
        ]}
      />
      <SnowCanvas ref={snowRef} flakes={90} />

      <div className="relative max-w-[1200px] mx-auto px-5 pt-[clamp(36px,6vw,84px)] pb-[clamp(130px,14vw,180px)] flex flex-wrap items-center gap-[clamp(20px,4vw,56px)]">
        {/* Copy */}
        <div className="flex-[1_1_440px] min-w-0 flex flex-col gap-5 sm:gap-6 animate-ml-pop">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/12 border border-white/22 text-[13px] font-bold whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-ml-coral shadow-[0_0_0_4px_rgba(255,107,94,.25)]" />
              Live online tuition
            </span>
          </div>

          {/* Headline — on phones a compact bear sits beside it so the mascot is visible without scrolling */}
          <div className="flex items-end justify-between gap-2">
            <h1 className="m-0 font-display font-extrabold text-[clamp(52px,8.4vw,104px)] leading-[0.92] tracking-[-0.045em]">
              Learn.
              <br />
              Grow.
              <br />
              <span className="inline-block bg-ml-coral text-white px-[0.16em] pt-[0.02em] pb-[0.08em] rounded-[0.14em] -rotate-[2.5deg] mt-[0.08em]">
                Shine.
              </span>
            </h1>

            <div className="sm:hidden relative flex-[0_0_auto] w-[40%] max-w-[170px] flex flex-col items-center">
              <div
                aria-live="polite"
                className="relative z-[3] mb-1.5 max-w-full bg-white text-ml-deep rounded-[16px_16px_16px_5px] px-3 py-2 font-bold text-[12px] leading-snug text-center shadow-[0_12px_28px_-12px_rgba(20,8,50,.6)]"
              >
                {MOBILE_BUBBLES[Math.min(pops, MOBILE_BUBBLES.length - 1)]}
              </div>
              <div className="relative w-full">
                <div
                  aria-hidden="true"
                  className="absolute left-[2%] right-[2%] -bottom-[4%] h-[20%] rounded-[50%] shadow-[inset_0_4px_0_rgba(255,255,255,.9),0_18px_30px_-14px_rgba(10,0,40,.6)]"
                  style={{ background: "linear-gradient(180deg,#F1F7FF 0%,#CFE3FF 55%,#A9CBF5 100%)" }}
                />
                <div ref={mobileBearRef} className="relative w-[82%] mx-auto mb-[3%]">
                  <div className="animate-ml-bob">
                    <Bear pose="wave" eager />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="m-0 max-w-[30em] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-ml-soft text-pretty">
            Connect with expert teachers for personalised live tutoring. Learn one-on-one, or share a faculty with up to 5 friends and split the fee.
          </p>

          {/* Phones: slightly slimmer buttons so both fit on one row */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            <Link
              to="/book-tutor"
              className="h-[52px] sm:h-14 px-5 sm:px-7 rounded-full bg-ml-coral text-ml-deep font-extrabold text-[15px] sm:text-[17px] inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shadow-[0_12px_28px_-10px_rgba(255,107,94,.9)] transition-transform hover:-translate-y-[3px] hover:text-ml-deep"
            >
              Book a Tutor
              <ArrowRight className="w-[18px] h-[18px]" />
            </Link>
            <button
              type="button"
              onClick={onHowItWorks}
              className="h-[52px] sm:h-14 px-4 sm:px-6 rounded-full border-2 border-white/35 bg-transparent text-white font-bold text-[15px] sm:text-base whitespace-nowrap cursor-pointer transition-colors hover:bg-white/10"
            >
              How it works
            </button>
          </div>

          <ul className="m-0 p-0 list-none flex flex-wrap gap-x-[22px] gap-y-2.5 text-sm font-semibold text-ml-soft">
            {HERO_POINTS.map((p) => (
              <li key={p} className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-ml-ice/20 flex items-center justify-center">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#CFE3FF" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Bear on an ice floe — tablet & desktop only (phones use the compact bear beside the headline) */}
        <div className="hidden sm:flex flex-[1_1_340px] min-w-0 justify-center animate-ml-pop" style={{ animationDelay: "160ms" }}>
          <div className="relative w-[min(100%,420px)] aspect-[1/1.02]">
            <div
              aria-live="polite"
              className="absolute left-0 top-[2%] max-w-[250px] bg-white text-ml-deep rounded-[22px_22px_22px_6px] px-[18px] py-3.5 font-bold text-[15px] leading-snug shadow-[0_18px_40px_-14px_rgba(20,8,50,.6)] z-[3]"
            >
              {BUBBLES[Math.min(pops, BUBBLES.length - 1)]}
            </div>
            <div
              aria-hidden="true"
              className="absolute left-[8%] right-[8%] bottom-[4%] h-[22%] rounded-[50%] shadow-[inset_0_6px_0_rgba(255,255,255,.9),0_30px_50px_-20px_rgba(10,0,40,.6)]"
              style={{ background: "linear-gradient(180deg,#F1F7FF 0%,#CFE3FF 55%,#A9CBF5 100%)" }}
            />
            <div className="absolute left-1/2 bottom-[9%] w-[60%] -translate-x-1/2 z-[2]">
              <div ref={bearRef}>
                <div className="animate-ml-bob">
                  <Bear pose="wave" eager />
                </div>
              </div>
            </div>
            <div className="absolute -right-[2%] top-[30%] flex flex-col items-end gap-1.5 z-[3] rotate-6">
              <span className="font-hand font-bold text-[26px] leading-none text-ml-sun">tap the snow!</span>
              <span className="px-[11px] py-[5px] rounded-full bg-white/14 border border-white/28 text-xs font-bold whitespace-nowrap">
                {pops ? `${pops} snow burst${pops > 1 ? "s" : ""}` : "psst… click me"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wavy bottom edge */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" className="absolute left-0 -bottom-px w-full h-[clamp(60px,8vw,110px)] block pointer-events-none">
        <path d="M0 52 C140 18 260 22 380 50 C520 82 640 78 760 54 C900 26 1020 14 1160 40 C1280 62 1360 70 1440 48 L1440 120 L0 120 Z" fill="#F7F5FC" opacity=".45" />
        <path d="M0 84 C160 58 300 62 460 82 C620 102 780 96 940 78 C1100 60 1280 70 1440 88 L1440 120 L0 120 Z" fill="#F7F5FC" />
      </svg>
    </section>
  );
};

export default HomeHero;
