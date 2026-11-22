import ShapeCropModal from "./ShapeCropModal";
import { BANNER_SHAPES } from "./bannerShapes";
import type { BannerShape } from "./bannerShapes";

type Props = {
  open: boolean;
  image: string;
  /** desktop = 2:1 (laptops/tablets), mobile = 1:1 (phones) */
  shape: BannerShape;
  onClose: () => void;
  onCropComplete: (file: File) => void;
};

/** Banner cropper: ShapeCropModal locked to the desktop or mobile banner shape. */
export default function BannerCropModal({ shape, ...rest }: Props) {
  return <ShapeCropModal spec={BANNER_SHAPES[shape]} {...rest} />;
}
