import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Delay in ms before the fade-up starts */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
};

/** Fades + slides its children up the first time they scroll into view. */
const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = "", as: Tag = "div" }) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("ml-in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("ml-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`ml-reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
