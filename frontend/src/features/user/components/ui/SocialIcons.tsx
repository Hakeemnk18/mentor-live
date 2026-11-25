import { SOCIAL_LINKS } from "../../../../shared/constants/contact";
import { SOCIAL_ICON } from "./socialMeta";

/** Compact round icon links (footer). Profiles without a link show greyed with "coming soon". */
export function SocialIconLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2.5 list-none m-0 p-0 ${className}`}>
      {SOCIAL_LINKS.map((s) => {
        const Icon = SOCIAL_ICON[s.network];
        const box = "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200";
        return (
          <li key={s.network}>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Mentorlive on ${s.name}`}
                title={`${s.name} · ${s.handle}`}
                className={`${box} bg-white/10 text-white hover:bg-white hover:text-ml-deep hover:-translate-y-0.5`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </a>
            ) : (
              <span
                aria-label={`${s.name} — coming soon`}
                title={`${s.name} — coming soon`}
                className={`${box} bg-white/5 text-white/35 cursor-default`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
