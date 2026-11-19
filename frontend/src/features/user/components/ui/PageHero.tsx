import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import WaveEdge from "./WaveEdge";
import FloatingTiles from "./FloatingTiles";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  /** e.g. "CBSE · Class 10" — shows a pill with a "Change" link back to Book Tutor */
  context?: string;
  /** Content that overlaps the bottom of the hero (search / filter bar) */
  children?: React.ReactNode;
};

/** Purple page header used by the listing pages (faculty, chapters, blogs). */
const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, sub, context, children }) => (
  <>
    <section className="relative overflow-hidden bg-ml-hero text-white">
      <div
        aria-hidden="true"
        className="absolute w-[600px] h-[600px] -right-[180px] -top-[320px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(146,98,245,.6),rgba(146,98,245,0) 65%)" }}
      />
      <FloatingTiles
        tiles={[
          { pos: "right-[12%] top-[30%]", size: 40, rotate: 22, duration: 8 },
          { pos: "right-[26%] top-[14%]", size: 22, rotate: -12, tint: true, duration: 10 },
        ]}
      />
      <Reveal className="relative max-w-[1200px] mx-auto px-5 pt-[clamp(32px,5vw,60px)] pb-[clamp(100px,10vw,130px)] flex flex-col gap-3.5 items-start">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-xs font-extrabold tracking-[0.16em] text-ml-peach uppercase">{eyebrow}</span>
          {context && (
            <Link
              to="/book-tutor"
              className="inline-flex items-center gap-2 h-[34px] pl-3.5 pr-[5px] rounded-full border border-white/30 bg-white/12 text-white font-bold text-[13px] hover:bg-white/20 transition-colors"
            >
              {context}
              <span className="px-2.5 py-1 rounded-full bg-white text-ml-deep text-xs font-extrabold">Change</span>
            </Link>
          )}
        </div>
        <h1 className="m-0 font-display font-extrabold text-[clamp(36px,5.4vw,64px)] leading-none tracking-[-0.04em] max-w-[16em] text-balance">
          {title}
        </h1>
        {sub && <p className="m-0 text-[17px] leading-relaxed text-ml-soft max-w-[34em]">{sub}</p>}
      </Reveal>
      <WaveEdge />
    </section>
    {children && (
      <div className="relative z-[2] max-w-[1200px] mx-auto -mt-[clamp(48px,5vw,64px)] px-5">{children}</div>
    )}
  </>
);

export default PageHero;
