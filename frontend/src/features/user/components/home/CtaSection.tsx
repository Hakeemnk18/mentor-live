import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import Bear from "../ui/Bear";

const CtaSection: React.FC = () => (
  <section className="max-w-[1200px] mx-auto px-5 py-[clamp(72px,9vw,120px)]">
    <Reveal>
      <div className="relative rounded-[40px] bg-ml-plum text-white overflow-hidden p-[clamp(32px,5vw,64px)] flex flex-wrap gap-6 items-center">
        <div
          aria-hidden="true"
          className="absolute -right-[120px] -top-[120px] w-[420px] h-[420px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(146,98,245,.7),rgba(146,98,245,0) 65%)" }}
        />
        <div className="relative flex-[1_1_420px] min-w-0 flex flex-col gap-5">
          <h2 className="m-0 font-display font-extrabold text-[clamp(38px,5.4vw,66px)] leading-none tracking-[-0.04em]">
            Ready to make
            <br />
            <span className="inline-block bg-ml-coral px-[0.14em] pb-[0.06em] rounded-[0.12em] mt-[0.08em]">learning fun</span>
          </h2>
          <p className="m-0 text-lg leading-relaxed text-ml-soft max-w-[28em]">
            Join Mentorlive and experience personalised online learning
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              to="/book-tutor"
              className="h-14 px-7 rounded-full bg-ml-coral text-ml-deep font-extrabold text-[17px] inline-flex items-center whitespace-nowrap transition-transform hover:-translate-y-[3px] hover:text-ml-deep"
            >
              Book a Tutor
            </Link>
            <div className="flex flex-col px-[18px] py-2 rounded-[18px] bg-white text-ml-deep">
              <span className="text-[11px] font-bold text-ml-muted">For More Details:</span>
              <span className="font-extrabold text-lg tracking-[0.01em]">+91 00000 00000</span>
            </div>
          </div>
        </div>
        <div className="relative flex-[0_1_280px] min-w-[200px] flex justify-center">
          <div className="w-full max-w-[220px] animate-ml-bob" style={{ animationDuration: "3.6s" }}>
            <Bear pose="study" />
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);

export default CtaSection;
