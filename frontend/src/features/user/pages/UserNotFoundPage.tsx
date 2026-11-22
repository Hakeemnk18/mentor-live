import { useNavigate } from "react-router-dom";
import Bear from "../components/ui/Bear";

export default function UserNotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-ml-hero text-white min-h-[640px] flex items-center">
      <div
        aria-hidden="true"
        className="absolute w-[700px] h-[700px] left-1/2 -top-[360px] -ml-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(146,98,245,.6),rgba(146,98,245,0) 65%)" }}
      />
      <div className="relative max-w-[900px] mx-auto px-5 py-[clamp(40px,6vw,80px)] flex flex-col items-center text-center gap-[18px] w-full">
        <div className="flex items-end justify-center gap-[clamp(4px,1.5vw,16px)] animate-ml-pop" aria-hidden="true">
          <span className="font-display font-extrabold text-[clamp(120px,20vw,220px)] leading-[0.8] tracking-[-0.06em]">4</span>
          <div className="relative w-[clamp(120px,17vw,180px)] pb-3">
            <div
              className="absolute -left-[10%] -right-[10%] bottom-0 h-[34%] rounded-[50%]"
              style={{ background: "linear-gradient(180deg,#F1F7FF,#A9CBF5)" }}
            />
            <div className="relative animate-ml-bob" style={{ animationDuration: "3.8s" }}>
              <Bear pose="lost" eager />
            </div>
          </div>
          <span className="font-display font-extrabold text-[clamp(120px,20vw,220px)] leading-[0.8] tracking-[-0.06em]">4</span>
        </div>

        <h1 className="mt-3 mb-0 font-display font-extrabold text-[clamp(32px,4.6vw,52px)] leading-none tracking-[-0.04em]">
          This page melted away
        </h1>
        <p className="m-0 text-[17px] leading-relaxed text-ml-soft max-w-[28em]">
          The page you're looking for doesn't exist or has moved. Let's get you back on solid ice.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="h-[54px] px-[26px] rounded-full bg-ml-coral text-ml-deep font-extrabold text-base cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            Back to Home
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-[54px] px-6 rounded-full border-2 border-white/35 bg-transparent text-white font-bold text-base cursor-pointer transition-colors hover:bg-white/10"
          >
            Go back
          </button>
        </div>
      </div>
    </section>
  );
}
