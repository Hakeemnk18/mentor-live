import { useEffect, useRef, useState } from "react";

type Props = {
  /** Full content shown inside the tooltip bubble */
  content: React.ReactNode;
  /** Element that triggers the tooltip on hover/focus */
  children: React.ReactNode;
  className?: string;
  maxWidth?: number;
};

/**
 * Lightweight custom tooltip — positioned with `position: fixed` (computed
 * from the trigger's bounding rect) so it escapes `overflow-hidden`/scroll
 * containers like table cells, instead of relying on the native `title`
 * attribute.
 */
export default function Tooltip({ content, children, className = "", maxWidth = 320 }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, openUp: false });
  const triggerRef = useRef<HTMLDivElement>(null);

  const calcPos = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const openUp = rect.top > window.innerHeight - rect.bottom;
    const left = Math.min(
      Math.max(rect.left, 8),
      window.innerWidth - maxWidth - 8,
    );
    setPos({
      top: openUp ? rect.top - 8 : rect.bottom + 8,
      left,
      openUp,
    });
  };

  useEffect(() => {
    if (!visible) return;
    calcPos();
    const update = () => calcPos();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [visible]);

  if (!content) return <>{children}</>;

  return (
    <div
      ref={triggerRef}
      className={className}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div
          role="tooltip"
          style={{
            position: "fixed",
            top: pos.openUp ? undefined : pos.top,
            bottom: pos.openUp ? window.innerHeight - pos.top : undefined,
            left: pos.left,
            maxWidth,
            zIndex: 99999,
          }}
          className="px-3 py-2 text-xs leading-relaxed text-white bg-gray-900 rounded-lg shadow-xl whitespace-pre-wrap break-words pointer-events-none"
        >
          {content}
        </div>
      )}
    </div>
  );
}
