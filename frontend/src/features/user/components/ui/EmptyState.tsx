import Bear, { type BearPose } from "./Bear";

type EmptyStateProps = {
  title: string;
  sub?: React.ReactNode;
  pose?: BearPose;
  /** Optional call-to-action button */
  action?: { label: string; onClick: () => void };
};

/** Friendly "nothing here" block with a bobbing bear on an ice floe. */
const EmptyState: React.FC<EmptyStateProps> = ({ title, sub, pose = "think", action }) => (
  <div className="max-w-[720px] mx-auto px-5 pt-6 pb-[clamp(72px,9vw,120px)] flex flex-col items-center text-center gap-3.5">
    <div className="relative w-[220px] pb-4">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[50px] rounded-[50%]"
        style={{ background: "linear-gradient(180deg,#F1F7FF,#BBD7FA)" }}
      />
      <div className="relative w-[140px] mx-auto animate-ml-bob" style={{ animationDuration: "4s" }}>
        <Bear pose={pose} />
      </div>
    </div>
    <h2 className="m-0 font-display font-extrabold text-[28px] text-ml-ink tracking-[-0.02em]">{title}</h2>
    {sub && <p className="m-0 text-base leading-relaxed text-ml-muted max-w-[30em]">{sub}</p>}
    {action && (
      <button
        type="button"
        onClick={action.onClick}
        className="mt-2 h-[52px] px-6 rounded-full bg-ml-violet text-white font-extrabold text-[15px] inline-flex items-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
