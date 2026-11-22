import { useEffect, useRef } from "react";

export type RevealVariant = "up" | "fade" | "zoom" | "left" | "right";

type RevealProps = {
  children: React.ReactNode;
  /** Delay in ms before the animation starts */
  delay?: number;
  /** Entrance style. left/right fall back to "up" on phones (no sideways overflow). */
  variant?: RevealVariant;
  /** Animate each direct child one after another instead of the block as a whole. */
  stagger?: boolean;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "ul";
};

/* ── One IntersectionObserver shared by every Reveal on the page (cheap even with 50+ items) ── */
let sharedIO: IntersectionObserver | null = null;
const onEnter = new WeakMap<Element, () => void>();

function observe(el: Element, cb: () => void) {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  if (!sharedIO) {
    sharedIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          onEnter.get(entry.target)?.();
          onEnter.delete(entry.target);
          sharedIO?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
  }
  onEnter.set(el, cb);
  sharedIO.observe(el);
  return () => {
    onEnter.delete(el);
    sharedIO?.unobserve(el);
  };
}

/**
 * Plays an entrance animation the first time the element scrolls into view.
 * Content is always in the HTML (only opacity/transform change), so it stays
 * crawlable and causes no layout shift; it is GPU-only and respects reduced motion.
 */
const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  variant = "up",
  stagger = false,
  className = "",
  as: Tag = "div",
}) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el, () => el.classList.add("ml-in"));
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`ml-reveal${stagger ? " ml-stagger" : ""} ${className}`}
      data-anim={variant === "up" ? undefined : variant}
      style={delay ? ({ "--ml-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
