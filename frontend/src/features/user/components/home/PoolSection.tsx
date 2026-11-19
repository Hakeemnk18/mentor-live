import { useState } from "react";
import Reveal from "../ui/Reveal";
import Bear from "../ui/Bear";
import { ArrowRight, Check, Person } from "../ui/Icons";

/** Illustrative hourly fee used only for this calculator (not a real price) */
const SAMPLE_FEE = 1200;

const POINTS = [
  { title: "Flexible Group Size", desc: "Learn solo or with 2-5 students" },
  { title: "Cost Sharing", desc: "Split faculty fees and reduce learning cost" },
  { title: "Same faculty, Same Quality", desc: "No content compromise only smarter pricing" },
];

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

/** One seat in the pool visual: you (dashed coral), a friend (filled), or empty. */
export const PoolCube: React.FC<{ state: "you" | "on" | "off"; radius?: string }> = ({ state, radius = "rounded-[18px]" }) => {
  const styles = {
    you: { cls: "border-dashed border-ml-coral bg-ml-rose scale-100 shadow-[0_8px_18px_-8px_rgba(255,107,94,.8)]", ic: "#B4332A" },
    on: { cls: "border-solid border-ml-ice bg-ml-ice scale-100", ic: "#512B81" },
    off: { cls: "border-dashed border-[#DCD3EE] bg-transparent scale-[.88]", ic: "transparent" },
  }[state];
  return (
    <div
      className={`aspect-square ${radius} border-2 flex items-center justify-center transition-all duration-[450ms] [transition-timing-function:cubic-bezier(.3,1.5,.5,1)] ${styles.cls}`}
    >
      <Person className="w-[46%] h-[46%]" fill={styles.ic} />
    </div>
  );
};

const PoolSection: React.FC = () => {
  const [pool, setPool] = useState(3);
  const saving = Math.round((1 - 1 / pool) * 100);

  return (
    <section className="max-w-[1200px] mx-auto px-5 py-[clamp(72px,9vw,128px)]">
      <div className="flex flex-wrap gap-[clamp(32px,5vw,72px)] items-center">
        {/* Copy */}
        <Reveal className="flex-[1_1_400px] min-w-0 flex flex-col gap-[22px]">
          <span className="text-[13px] font-extrabold tracking-[0.16em] text-ml-rust">POOL LEARNING</span>
          <h2 className="m-0 font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-none tracking-[-0.04em] text-ml-deep">
            Learn Together.
            <br />
            <span className="text-ml-violet">Pay Less.</span>
          </h2>
          <p className="m-0 text-[17px] leading-[1.65] text-ml-muted max-w-[30em]">
            Choose to study or share a faculty with up to 5 students and split the cost without compromising quality
          </p>
          <div className="flex flex-col gap-4">
            {POINTS.map((p) => (
              <div key={p.title} className="flex gap-3.5 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-[14px] bg-ml-lav text-ml-plum flex items-center justify-center">
                  <Check className="w-[18px] h-[18px]" />
                </div>
                <div>
                  <div className="font-extrabold text-base text-ml-ink">{p.title}</div>
                  <div className="text-sm text-ml-muted mt-0.5">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/pool-classes"
            className="self-start max-w-full h-[54px] px-[22px] rounded-full bg-ml-violet text-white font-extrabold text-[15px] inline-flex items-center gap-2.5 whitespace-nowrap shadow-[0_12px_26px_-12px_rgba(109,53,217,.8)] transition-transform hover:-translate-y-[3px] hover:text-white"
          >
            Find Group learning Options
            <ArrowRight className="w-[18px] h-[18px]" />
          </a>
        </Reveal>

        {/* Calculator */}
        <Reveal delay={140} className="flex-[1_1_420px] min-w-0 relative pt-[110px]">
          <div className="absolute right-[clamp(8px,3vw,32px)] top-0 w-[clamp(110px,12vw,140px)] z-[3]">
            <div className="animate-ml-bob" style={{ animationDuration: "4.4s" }}>
              <Bear pose="group" />
            </div>
          </div>
          <div className="relative overflow-hidden bg-white rounded-[34px] p-[clamp(22px,3vw,36px)] shadow-[0_1px_0_rgba(42,22,80,.04),0_30px_60px_-30px_rgba(42,22,80,.4)] flex flex-col gap-[22px]">
            <div aria-hidden="true" className="absolute -right-[60px] -top-[60px] w-[200px] h-[200px] rounded-full bg-[#EAF3FF]" />
            <div className="relative">
              <div className="font-hand font-bold text-[22px] leading-none text-ml-rust mb-1">tap a number!</div>
              <div className="font-display font-extrabold text-2xl text-ml-deep tracking-[-0.02em]">Build your pool</div>
              <div className="text-sm text-ml-muted mt-1">Sample fee: {inr(SAMPLE_FEE)} per hour</div>
            </div>

            <div className="relative flex gap-2 flex-wrap" role="radiogroup" aria-label="Number of students in the pool">
              {[1, 2, 3, 4, 5].map((n) => {
                const on = n === pool;
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPool(n)}
                    className={`flex-[1_1_0] min-w-12 h-[52px] rounded-2xl border-2 font-display font-extrabold text-xl cursor-pointer transition-all duration-200 ${
                      on ? "bg-ml-deep border-ml-deep text-white" : "bg-white border-ml-line text-ml-deep hover:border-ml-violet"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>

            <div className="relative grid grid-cols-5 gap-2.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <PoolCube key={i} state={i === 0 ? "you" : i < pool ? "on" : "off"} />
              ))}
            </div>

            <div className="relative flex items-end justify-between gap-4 flex-wrap pt-[18px] border-t-2 border-dashed border-ml-lav">
              <div>
                <div className="text-[13px] font-bold text-ml-muted">Each student pays</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-extrabold text-[clamp(44px,5vw,58px)] leading-none text-ml-deep tracking-[-0.04em]">
                    {inr(SAMPLE_FEE / pool)}
                  </span>
                  <span className="text-[15px] font-bold text-ml-muted">/hr</span>
                </div>
              </div>
              <span
                className={`px-4 py-2.5 rounded-full font-extrabold text-sm ${
                  pool === 1 ? "bg-[#F1ECFA] text-ml-plum" : "bg-ml-rose text-ml-red"
                }`}
              >
                {pool === 1 ? "1-on-1 focus" : `You save ${saving}%`}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default PoolSection;
