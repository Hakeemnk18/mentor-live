import { useCallback, useEffect, useRef, useState } from "react";
import { getUserBanners } from "../../../api/banner.api";
import type { UserBanner } from "../../../shared/types/banner.types";
import LeadFormModal from "./LeadFormModal";

const AUTO_MS = 5000;

export default function BannerCarousel() {
  const [banners, setBanners] = useState<UserBanner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [current, setCurrent]   = useState(0);
  const [animKey, setAnimKey]   = useState(0);   // restarts CSS animations on slide change
  const [hovered, setHovered]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadBanner, setLeadBanner] = useState<UserBanner | null>(null);

  const currentRef   = useRef(0);          // stable ref so interval doesn't go stale
  const dragStartX   = useRef(0);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── fetch ──────────────────────────────────────────────────────── */
  useEffect(() => {
    getUserBanners()
      .then(setBanners)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const count = banners.length;

  /* ── navigation ─────────────────────────────────────────────────── */
  const goTo = useCallback(
    (idx: number) => {
      const n = ((idx % count) + count) % count;
      currentRef.current = n;
      setCurrent(n);
      setAnimKey((k) => k + 1);
    },
    [count],
  );

  /* ── auto-play — stable interval via ref ────────────────────────── */
  useEffect(() => {
    if (count < 2 || hovered || dragging) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(
      () => goTo(currentRef.current + 1),
      AUTO_MS,
    );
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [count, hovered, dragging, goTo]);

  /* ── swipe / drag ───────────────────────────────────────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    setDragging(true);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 40) goTo(currentRef.current + (dx < 0 ? 1 : -1));
    setDragging(false);
  };

  /* ── render guards ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="w-full h-[220px] sm:h-[320px] md:h-[440px] bg-gray-100 animate-pulse" />
    );
  }
  if (count === 0) return null;

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <>
    <section
      className="relative w-full overflow-hidden select-none bg-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
      aria-label="Banner carousel"
      aria-roledescription="carousel"
    >

      {/* ── 1. TOP ATTENTION STRIP — animated gradient ─────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[4px] z-30">
        <div className="h-full w-full banner-top-strip" />
      </div>

      {/* ── 2. SLIDES ──────────────────────────────────────────────── */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: dragging
            ? "none"
            : "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {banners.map((b, i) => (
          <div
            key={i}
            className="relative w-full flex-shrink-0"
            style={{ minWidth: "100%" }}
            aria-hidden={i !== current}
          >
            {/* Image wrapper — overflow:hidden clips Ken Burns */}
            <div className="w-full h-[220px] sm:h-[320px] md:h-[440px] overflow-hidden">
              <img
                key={i === current ? `kb-${animKey}` : i}
                src={b.image}
                alt={b.description}
                className={[
                  "w-full h-full object-cover will-change-transform",
                  i === current ? "banner-ken-burns" : "",
                ].join(" ")}
                draggable={false}
              />
            </div>

            {/* Vignette radial + bottom gradient */}
            <div className="absolute inset-0 pointer-events-none banner-vignette" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

            {/* Caption — only for active slide, animates in */}
            {i === current && (
              <div
                key={`cap-${animKey}`}
                className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 md:px-14 pb-10 sm:pb-12 banner-caption"
              >
                <div className="banner-accent-line mb-3" />
                <p className="text-white text-sm sm:text-base md:text-xl font-semibold leading-snug max-w-2xl drop-shadow-lg line-clamp-2 sm:line-clamp-none">
                  {b.description}
                </p>
                {b.isClickable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLeadBanner(b);
                      setLeadOpen(true);
                    }}
                    className="mt-4 inline-flex items-center gap-2 bg-white text-[#DB313E] text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg hover:bg-[#DB313E] hover:text-white transition-all duration-200 active:scale-95"
                  >
                    {b.buttonText || "Get In Touch"}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── 3. LIVE BADGE — top-right ───────────────────────────────── */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#DB313E] animate-pulse flex-shrink-0" />
        <span className="text-white text-[11px] font-semibold tracking-widest uppercase leading-none">
          Live
        </span>
      </div>

      {/* ── 4. SLIDE COUNTER — top-left ─────────────────────────────── */}
      {count > 1 && (
        <div className="absolute top-4 left-4 z-30 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          <span className="text-white text-[11px] font-semibold tabular-nums tracking-wider">
            {String(current + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(count).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* ── 5. ARROWS ───────────────────────────────────────────────── */}
      {count > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(currentRef.current - 1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-200 hover:bg-white/25 hover:scale-110 active:scale-95"
            aria-label="Previous banner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(currentRef.current + 1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-200 hover:bg-white/25 hover:scale-110 active:scale-95"
            aria-label="Next banner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* ── 6. DOT INDICATORS ───────────────────────────────────────── */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              aria-label={`Go to slide ${i + 1}`}
              className="relative rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                width:  i === current ? 28 : 8,
                height: 8,
                background: i === current ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.35)",
              }}
            >
              {i === current && (
                <span
                  key={`dot-${animKey}`}
                  className="absolute inset-0 rounded-full bg-white banner-dot-fill"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── 7. PROGRESS BAR — bottom edge ───────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] z-30 bg-white/15">
        {!hovered && !dragging && count > 1 && (
          <div
            key={`pb-${animKey}`}
            className="h-full bg-gradient-to-r from-[#DB313E] to-[#ff6b35] banner-progress"
          />
        )}
      </div>

      {/* ── 8. PAUSE PILL — visible on hover ────────────────────────── */}
      {hovered && count > 1 && (
        <div className="absolute bottom-4 right-5 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          <span className="flex gap-[3px]">
            <span className="block w-[3px] h-3 rounded-full bg-white/60" />
            <span className="block w-[3px] h-3 rounded-full bg-white/60" />
          </span>
          <span className="text-white/60 text-[10px] font-medium tracking-wide">Paused</span>
        </div>
      )}

      {/* ── KEYFRAMES & ANIMATIONS ──────────────────────────────────── */}
      <style>{`
        /* Ken Burns — subtle zoom + slight drift */
        @keyframes kenBurns {
          0%   { transform: scale(1)    translate(0%, 0%);    }
          100% { transform: scale(1.07) translate(-0.8%, -0.5%); }
        }
        .banner-ken-burns {
          animation: kenBurns ${AUTO_MS}ms ease-out forwards;
        }

        /* Caption slides up + fades in */
        @keyframes captionReveal {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .banner-caption {
          animation: captionReveal 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Accent line draws from left */
        @keyframes accentDraw {
          from { width: 0; opacity: 0; }
          to   { width: 32px; opacity: 1; }
        }
        .banner-accent-line {
          height: 3px;
          width: 0;
          border-radius: 9999px;
          background: #DB313E;
          animation: accentDraw 0.45s ease-out 0.2s forwards;
        }

        /* Top strip — moving gradient sweep */
        @keyframes stripMove {
          0%   { background-position: 0% 50%;   }
          50%  { background-position: 100% 50%;  }
          100% { background-position: 0% 50%;   }
        }
        .banner-top-strip {
          background: linear-gradient(90deg,
            #DB313E 0%, #ff6b35 25%, #ffcc02 50%, #DB313E 75%, #c62368 100%
          );
          background-size: 300% 100%;
          animation: stripMove 4s linear infinite;
        }

        /* Active dot fill — sweeps across left-to-right matching AUTO_MS */
        @keyframes dotFill {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        .banner-dot-fill {
          transform-origin: left;
          animation: dotFill ${AUTO_MS}ms linear forwards;
        }

        /* Radial vignette on the image */
        .banner-vignette {
          background: radial-gradient(
            ellipse at center,
            transparent 50%,
            rgba(0, 0, 0, 0.22) 100%
          );
        }

        /* Progress bar */
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .banner-progress {
          animation: progressBar ${AUTO_MS}ms linear forwards;
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .banner-ken-burns   { animation: none !important; }
          .banner-caption     { animation: none !important; opacity: 1 !important; }
          .banner-accent-line { animation: none !important; width: 32px !important; opacity: 1 !important; }
          .banner-top-strip   { animation: none !important; background: #DB313E !important; }
          .banner-dot-fill    { animation: none !important; transform: scaleX(1) !important; }
          .banner-progress    { animation: none !important; width: 0 !important; }
        }
      `}</style>
    </section>

    {/* ── Lead inquiry modal ── */}
    {leadOpen && leadBanner && (
      <LeadFormModal
        open={leadOpen}
        onClose={() => { setLeadOpen(false); setLeadBanner(null); }}
        type="inquiry"
        purpose={leadBanner.description}
      />
    )}
    </>
  );
}
