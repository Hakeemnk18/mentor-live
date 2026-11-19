import { useCallback, useEffect, useRef, useState } from "react";
import { getUserBanners } from "../../../api/banner.api";
import type { UserBanner } from "../../../shared/types/banner.types";
import LeadFormModal from "./LeadFormModal";
import Reveal from "./ui/Reveal";
import { ChevronLeft, ChevronRight } from "./ui/Icons";

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
      <section className="max-w-[1200px] mx-auto px-5 pt-[clamp(56px,7vw,96px)]">
        <div className="w-full h-[260px] sm:h-[340px] md:h-[400px] rounded-[34px] bg-ml-lav animate-pulse" />
      </section>
    );
  }
  if (count === 0) return null;

  const arrowCls =
    "w-11 h-11 rounded-full bg-white/92 text-ml-deep flex items-center justify-center cursor-pointer shadow-md transition hover:bg-white hover:scale-105 active:scale-95";

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <>
    <section className="max-w-[1200px] mx-auto px-5 pt-[clamp(56px,7vw,96px)]">
      <Reveal>
        <div
          className="relative rounded-[34px] overflow-hidden select-none bg-ml-hero shadow-[0_30px_60px_-30px_rgba(42,22,80,.5)]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "pan-y" }}
          aria-label="Banner carousel"
          aria-roledescription="carousel"
        >
          {/* Slides */}
          <div
            className="flex"
            style={{
              transform: `translateX(-${current * 100}%)`,
              transition: dragging
                ? "none"
                : "transform 800ms cubic-bezier(.7,0,.2,1)",
            }}
          >
            {banners.map((b, i) => (
              <div
                key={i}
                className="relative w-full flex-shrink-0"
                style={{ minWidth: "100%" }}
                aria-hidden={i !== current}
              >
                <div className="w-full h-[300px] sm:h-[340px] md:h-[400px] overflow-hidden">
                  <img
                    key={i === current ? `kb-${animKey}` : i}
                    src={b.image}
                    alt={b.description}
                    loading={i === 0 ? "eager" : "lazy"}
                    className={[
                      "w-full h-full object-cover will-change-transform",
                      i === current ? "banner-ken-burns" : "",
                    ].join(" ")}
                    draggable={false}
                  />
                </div>

                {/* Purple wash so text stays readable on any image */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[rgba(36,19,63,.92)] via-[rgba(36,19,63,.35)] to-transparent" />

                {/* Caption — only for active slide, animates in */}
                {i === current && (
                  <div
                    key={`cap-${animKey}`}
                    className="absolute inset-x-0 bottom-0 px-[clamp(24px,4.5vw,56px)] pb-[clamp(84px,7vw,56px)] md:pr-[300px] flex flex-col items-start gap-3.5 banner-caption"
                  >
                    <span className="h-1 w-10 rounded-full bg-ml-coral" />
                    <p className="m-0 text-white font-display font-extrabold text-[clamp(22px,3.2vw,40px)] leading-[1.05] tracking-[-0.03em] max-w-[20em] line-clamp-3 drop-shadow-sm">
                      {b.description}
                    </p>
                    {b.isClickable && (
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLeadBanner(b);
                          setLeadOpen(true);
                        }}
                        className="mt-1.5 h-12 px-[22px] rounded-full bg-white text-ml-deep font-extrabold text-[15px] inline-flex items-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
                      >
                        {b.buttonText || "Get In Touch"}
                        <ChevronRight />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dots + arrows */}
          {count > 1 && (
            <div className="absolute right-[clamp(20px,3vw,32px)] bottom-[clamp(20px,3vw,32px)] flex items-center gap-2.5 z-10">
              <div className="flex gap-1.5 mr-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                    aria-label={`Go to slide ${i + 1}`}
                    className="h-2 rounded-lg cursor-pointer transition-all duration-300"
                    style={{
                      width: i === current ? 26 : 8,
                      background: i === current ? "#fff" : "rgba(255,255,255,.5)",
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); goTo(currentRef.current - 1); }}
                className={arrowCls}
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-[18px] h-[18px]" />
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); goTo(currentRef.current + 1); }}
                className={arrowCls}
                aria-label="Next banner"
              >
                <ChevronRight className="w-[18px] h-[18px]" />
              </button>
            </div>
          )}

          {/* Progress bar — bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15">
            {!hovered && !dragging && count > 1 && (
              <div key={`pb-${animKey}`} className="h-full bg-ml-coral banner-progress" />
            )}
          </div>
        </div>
      </Reveal>

      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1)    translate(0%, 0%);    }
          100% { transform: scale(1.07) translate(-0.8%, -0.5%); }
        }
        .banner-ken-burns { animation: kenBurns ${AUTO_MS}ms ease-out forwards; }
        @keyframes captionReveal {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .banner-caption { animation: captionReveal 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes progressBar { from { width: 0%; } to { width: 100%; } }
        .banner-progress { animation: progressBar ${AUTO_MS}ms linear forwards; }
        @media (prefers-reduced-motion: reduce) {
          .banner-ken-burns { animation: none !important; }
          .banner-caption   { animation: none !important; opacity: 1 !important; }
          .banner-progress  { animation: none !important; width: 0 !important; }
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
