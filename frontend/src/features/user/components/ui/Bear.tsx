import wave from "../../../../assets/mentor/bears/wave.webp";
import guide from "../../../../assets/mentor/bears/guide.webp";
import walk from "../../../../assets/mentor/bears/walk.webp";
import group from "../../../../assets/mentor/bears/group.webp";
import think from "../../../../assets/mentor/bears/think.webp";
import lost from "../../../../assets/mentor/bears/lost.webp";
import celebrate from "../../../../assets/mentor/bears/celebrate.webp";
import phone from "../../../../assets/mentor/bears/phone.webp";
import study from "../../../../assets/mentor/bears/study.webp";
import read from "../../../../assets/mentor/bears/read.webp";

const POSES = { wave, guide, walk, group, think, lost, celebrate, phone, study, read } as const;
// Intrinsic sizes (all exported at 520px wide) — lets the browser reserve space, no layout shift
const HEIGHTS: Record<BearPose, number> = {
  wave: 650, guide: 650, walk: 444, group: 650, think: 650,
  lost: 650, celebrate: 650, phone: 650, study: 599, read: 599,
};

export type BearPose = keyof typeof POSES;

type BearProps = {
  pose?: BearPose;
  className?: string;
  /** Above-the-fold bears load eagerly; everything else is lazy */
  eager?: boolean;
};

/** The Mentorlive polar-bear mascot. Purely decorative. */
const Bear: React.FC<BearProps> = ({ pose = "wave", className = "", eager = false }) => (
  <img
    src={POSES[pose]}
    alt=""
    aria-hidden="true"
    width={520}
    height={HEIGHTS[pose]}
    loading={eager ? "eager" : "lazy"}
    decoding="async"
    draggable={false}
    className={`block w-full h-auto select-none pointer-events-none drop-shadow-[0_18px_22px_rgba(20,8,50,0.3)] ${className}`}
  />
);

export default Bear;
