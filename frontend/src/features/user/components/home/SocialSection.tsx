import Reveal from "../ui/Reveal";
import { ArrowRight } from "../ui/Icons";
import { SOCIAL_BG, SOCIAL_ICON } from "../ui/socialMeta";
import { SOCIAL_LINKS } from "../../../../shared/constants/contact";

/** "Follow us" band on the landing page. Live profiles are links; the rest say "Coming soon". */
const SocialSection: React.FC = () => (
  <section className="max-w-[1200px] mx-auto px-5 pt-[clamp(72px,9vw,120px)]">
    <div className="relative overflow-hidden rounded-[34px] bg-white border border-ml-line p-[clamp(24px,4vw,48px)] shadow-[0_1px_0_rgba(42,22,80,.04),0_24px_50px_-30px_rgba(42,22,80,.35)]">
      {/* soft brand glow */}
      <div
        aria-hidden
        className="absolute -right-24 -top-24 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(146,98,245,.18), rgba(146,98,245,0) 65%)" }}
      />

      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <Reveal stagger className="flex flex-col gap-3 max-w-[560px]">
          <span className="text-[13px] font-extrabold tracking-[0.16em] text-ml-rust">STAY CONNECTED</span>
          <h2 className="m-0 font-display font-extrabold text-[clamp(30px,4vw,46px)] leading-[1.05] tracking-[-0.035em] text-ml-deep">
            Follow Mentorlive
          </h2>
          <p className="m-0 text-base leading-relaxed text-ml-muted">
            Study tips, class updates and fun moments from our tutors and students.
          </p>
        </Reveal>
      </div>

      <Reveal stagger delay={150} className="relative mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SOCIAL_LINKS.map((s) => {
          const Icon = SOCIAL_ICON[s.network];
          const live = !!s.url;
          const body = (
            <>
              <span className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-sm ${SOCIAL_BG[s.network]} ${live ? "" : "opacity-40 grayscale"}`}>
                <Icon className="w-5 h-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block font-extrabold text-[15px] leading-tight ${live ? "text-ml-ink" : "text-ml-muted"}`}>{s.name}</span>
                <span className={`block text-xs font-semibold truncate mt-0.5 ${live ? "text-ml-muted" : "text-[#A39CB5]"}`}>
                  {live ? s.handle : "Coming soon"}
                </span>
              </span>
              {live && (
                <ArrowRight className="w-4 h-4 shrink-0 text-ml-violet transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </>
          );
          const base = "group flex items-center gap-3 rounded-2xl border-2 p-3 sm:p-3.5 min-h-[72px]";
          return live ? (
            <a
              key={s.network}
              href={s.url!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow Mentorlive on ${s.name} (${s.handle})`}
              className={`${base} border-ml-line bg-white transition-[border-color,transform,box-shadow] duration-300 hover:border-ml-violet hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(42,22,80,.45)] hover:text-inherit`}
            >
              {body}
            </a>
          ) : (
            <div key={s.network} aria-label={`${s.name} — coming soon`} className={`${base} border-dashed border-ml-line bg-ml-page/60 cursor-default`}>
              {body}
            </div>
          );
        })}
      </Reveal>
    </div>
  </section>
);

export default SocialSection;
