/**
 * Banner image shapes. The user carousel uses the same shapes
 * (1:1 below 640px, 2:1 from 640px up), so what admins crop is exactly what users see.
 */
import type { CropShapeSpec } from "./cropShapes";

export type BannerShape = "desktop" | "mobile";

export const BANNER_SHAPES: Record<BannerShape, CropShapeSpec> = {
  desktop: {
    name: "Desktop image",
    audience: "laptop & tablet users",
    aspect: 2,
    ratioLabel: "2 : 1",
    outputWidth: 2000,
    minSharpWidth: 1200,
    recommended: "2000×1000",
  },
  mobile: {
    name: "Mobile image",
    audience: "phone users",
    aspect: 1,
    ratioLabel: "1 : 1",
    outputWidth: 1080,
    minSharpWidth: 720,
    recommended: "1080×1080",
  },
};
