import Bear from "./Bear";

/** Shown when a list/detail request fails. */
const ErrorState: React.FC<{ title?: string; sub?: string }> = ({
  title = "Something went wrong",
  sub = "Please check your connection and try again.",
}) => (
  <div className="max-w-[560px] mx-auto px-5 py-16 flex flex-col items-center text-center gap-3">
    <div className="w-[120px]"><Bear pose="lost" /></div>
    <h2 className="m-0 font-display font-extrabold text-2xl text-ml-ink tracking-[-0.02em]">{title}</h2>
    <p className="m-0 text-[15px] text-ml-muted">{sub}</p>
  </div>
);

export default ErrorState;
