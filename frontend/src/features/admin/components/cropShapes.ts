/** Describes one locked crop shape (used by ShapeCropModal). */
export type CropShapeSpec = {
  /** e.g. "Desktop image", "Faculty photo" */
  name: string;
  /** who sees it, shown in the cropper hint: "phone users", "students" */
  audience: string;
  /** width / height */
  aspect: number;
  ratioLabel: string;
  /** exported width in px (never upscaled) */
  outputWidth: number;
  /** below this source width a "may look blurry" warning shows */
  minSharpWidth: number;
  recommended: string;
};

/**
 * Faculty photo: 7:5 — the exact shape of the photo area on the user-side faculty card
 * (FacultyCard uses aspect-[7/5]), so the crop is shown in full everywhere.
 */
export const FACULTY_PHOTO: CropShapeSpec = {
  name: "Faculty photo",
  audience: "students",
  aspect: 7 / 5,
  ratioLabel: "7 : 5",
  outputWidth: 1120,
  minSharpWidth: 560,
  recommended: "1120×800",
};
