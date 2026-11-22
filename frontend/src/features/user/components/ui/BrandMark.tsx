import wordmark from "../../../../assets/mentor/wordmark.webp";
import wordmarkLight from "../../../../assets/mentor/wordmark-light.webp";

type BrandMarkProps = {
  /** "light" = on the page background (purple logo), "dark" = on the footer (white logo) */
  tone?: "light" | "dark";
  className?: string;
};

/** Official Mentorlive wordmark ("mentorlive · customized online learning"). */
const BrandMark: React.FC<BrandMarkProps> = ({ tone = "light", className = "h-9 sm:h-10" }) => (
  <img
    src={tone === "dark" ? wordmarkLight : wordmark}
    alt="Mentorlive — customized online learning"
    width={622}
    height={132}
    className={`block w-auto ${className}`}
    draggable={false}
  />
);

export default BrandMark;
