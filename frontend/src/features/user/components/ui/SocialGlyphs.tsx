/* Brand glyphs for social links (components only). */
type IconProps = { className?: string };

/** Simple, recognisable brand glyphs (currentColor), 24×24 grid. */
export const InstagramIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const YouTubeIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M23 12s0-3.6-.46-5.3a2.8 2.8 0 0 0-1.97-1.98C18.88 4.25 12 4.25 12 4.25s-6.88 0-8.57.47A2.8 2.8 0 0 0 1.46 6.7C1 8.4 1 12 1 12s0 3.6.46 5.3a2.8 2.8 0 0 0 1.97 1.98c1.69.47 8.57.47 8.57.47s6.88 0 8.57-.47a2.8 2.8 0 0 0 1.97-1.98C23 15.6 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z" />
  </svg>
);

export const FacebookIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13.5 21.5v-8h2.7l.4-3.2h-3.1V8.3c0-.9.26-1.55 1.57-1.55h1.67V3.9c-.29-.04-1.28-.12-2.43-.12-2.4 0-4.05 1.47-4.05 4.16v2.36H7.55v3.2h2.71v8h3.24z" />
  </svg>
);

export const XIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2z" />
  </svg>
);
