/** Two-layer wavy bottom edge that melts a purple section into the page background. */
const WaveEdge: React.FC<{ className?: string }> = ({ className = "h-[clamp(50px,6vw,90px)]" }) => (
  <svg
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={`absolute left-0 -bottom-px w-full block pointer-events-none ${className}`}
  >
    <path
      d="M0 52 C140 18 260 22 380 50 C520 82 640 78 760 54 C900 26 1020 14 1160 40 C1280 62 1360 70 1440 48 L1440 120 L0 120 Z"
      fill="#F7F5FC"
      opacity=".45"
    />
    <path
      d="M0 84 C160 58 300 62 460 82 C620 102 780 96 940 78 C1100 60 1280 70 1440 88 L1440 120 L0 120 Z"
      fill="#F7F5FC"
    />
  </svg>
);

export default WaveEdge;
