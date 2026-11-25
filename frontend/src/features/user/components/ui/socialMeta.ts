import { FacebookIcon, InstagramIcon, XIcon, YouTubeIcon } from "./SocialGlyphs";
import type { SocialNetwork } from "../../../../shared/constants/contact";

type IconProps = { className?: string };

export const SOCIAL_ICON: Record<SocialNetwork, (p: IconProps) => React.ReactElement> = {
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  facebook: FacebookIcon,
  x: XIcon,
};

/** Brand colours for the icon backgrounds (Instagram uses its gradient). */
export const SOCIAL_BG: Record<SocialNetwork, string> = {
  instagram: "bg-[radial-gradient(circle_at_30%_110%,#FDCB52_0%,#FD5949_45%,#D6249F_65%,#285AEB_100%)]",
  youtube: "bg-[#FF0000]",
  facebook: "bg-[#1877F2]",
  x: "bg-[#111111]",
};
