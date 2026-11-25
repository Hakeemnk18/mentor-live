import { useEffect, useRef, useState } from "react";
import { poolInviteLink } from "../../../shared/utils/shareLink";
import { WhatsAppIcon } from "./ui/SocialGlyphs";
import { Check, Group } from "./ui/Icons";

type Props = {
  slotId: string;
  /** e.g. "English · 8th · CBSE · 4:00 PM" */
  summary?: string;
  facultyName?: string;
  onDone: () => void;
};

/** Shown after joining a pool: share a link that opens this same pool for a friend. */
const InviteFriendPanel: React.FC<Props> = ({ slotId, summary, facultyName, onDone }) => {
  const link = poolInviteLink(slotId);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const what = [summary && `${summary}`, facultyName && `with ${facultyName}`].filter(Boolean).join(" ");
  const message = `I just joined a pool class on Mentorlive${what ? `: ${what}` : ""}. Join me, every new student lowers the fee for all of us 🙌`;
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // older browsers: fall back to a hidden textarea
      const t = document.createElement("textarea");
      t.value = link;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: "Join my pool class on Mentorlive", text: message, url: link });
    } catch {
      /* closed the share sheet — nothing to do */
    }
  };

  const btn = "h-[50px] rounded-[16px] font-extrabold text-[15px] inline-flex items-center justify-center gap-2 cursor-pointer transition hover:-translate-y-0.5";

  return (
    <div className="flex flex-col gap-3.5">
      <div className="rounded-[22px] bg-ml-page border-2 border-ml-line p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 shrink-0 rounded-2xl bg-ml-coral text-ml-deep flex items-center justify-center">
            <Group className="w-[22px] h-[22px]" />
          </span>
          <div className="min-w-0">
            <p className="m-0 font-display font-extrabold text-lg leading-tight text-ml-deep">Invite a friend to this pool</p>
            <p className="m-0 mt-0.5 text-[13px] font-semibold text-ml-muted">Every new student lowers the fee for everyone.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-3.5 pr-1.5 h-12 rounded-[14px] bg-white border border-ml-line">
          <span className="flex-1 min-w-0 truncate text-[13px] font-semibold text-ml-muted" title={link}>
            {link.replace(/^https?:\/\//, "")}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className={`shrink-0 h-9 px-3.5 rounded-[10px] text-[13px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              copied ? "bg-[#DDF3E6] text-[#1E7A4B]" : "bg-ml-deep text-white hover:brightness-125"
            }`}
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : "Copy link"}
          </button>
        </div>

        <div className={`grid gap-2.5 ${canNativeShare ? "grid-cols-2" : "grid-cols-1"}`}>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${message}\n${link}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} bg-[#25D366] text-white hover:text-white`}
          >
            <WhatsAppIcon className="w-5 h-5" /> WhatsApp
          </a>
          {canNativeShare && (
            <button type="button" onClick={nativeShare} className={`${btn} bg-white border-2 border-ml-line text-ml-ink`}>
              More options
            </button>
          )}
        </div>
      </div>

      <button type="button" onClick={onDone} className={`${btn} w-full bg-ml-violet text-white hover:brightness-110`}>
        Done
      </button>
      <span className="text-xs font-semibold text-ml-muted text-center">
        We&apos;ll contact you on your number to confirm your class.
      </span>
    </div>
  );
};

export default InviteFriendPanel;
