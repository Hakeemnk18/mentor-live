import { Types } from "mongoose";
import { FacultySlotModel } from "../faculty-slot/infrastructure/faculty.slot.schema.js";
import { FacultyModel } from "../faculty/infrastructure/faculty.schema.js";
import { SubjectVariantModel } from "../subject-variant/infrastructure/subject.variant.schema.js";
import { SubjectModel } from "../subject/infrastructure/subject.schema.js";
import { ClassModel } from "../class/infrastructure/class.schema.js";
import { SyllabusModel } from "../syllabus/infrastructure/syllabus.schema.js";

/**
 * Public summary of a pool slot, used by "invite a friend" links.
 * Only public info: tutor, subject, time and seat COUNT — never who is in the pool.
 */
export type PoolShareSummary = {
  slotId: string;
  facultyId: string;
  facultyName: string;
  facultyImage: string;
  variantId: string;
  subjectName: string;
  classId: string;
  className: string;
  syllabusId: string;
  syllabusName: string;
  time: string;
  poolCount: number;
  poolLimit: number;
  isAvailable: boolean;
  isFull: boolean;
};

export async function getPoolShareSummary(slotId: string): Promise<PoolShareSummary | null> {
  if (!Types.ObjectId.isValid(slotId)) return null;

  const slot = await FacultySlotModel.findById(slotId).select("facultyId variantId time isAvailable pool poolLimit").lean();
  if (!slot) return null;

  const [faculty, variant] = await Promise.all([
    FacultyModel.findOne({ _id: slot.facultyId, isDeleted: { $ne: true } }).select("name image").lean(),
    SubjectVariantModel.findOne({ _id: slot.variantId, isDeleted: { $ne: true } }).select("subject class syllabus").lean(),
  ]);
  if (!faculty || !variant) return null;

  const [subject, cls, syllabus] = await Promise.all([
    SubjectModel.findById(variant.subject).select("name").lean(),
    ClassModel.findById(variant.class).select("name").lean(),
    SyllabusModel.findById(variant.syllabus).select("name").lean(),
  ]);

  const poolCount = Array.isArray(slot.pool) ? slot.pool.length : 0;
  const poolLimit = slot.poolLimit ?? 5;

  return {
    slotId: String(slot._id),
    facultyId: String(slot.facultyId),
    facultyName: faculty.name,
    facultyImage: faculty.image?.url ?? "",
    variantId: String(slot.variantId),
    subjectName: subject?.name ?? "",
    classId: String(variant.class),
    className: cls?.name ?? "",
    syllabusId: String(variant.syllabus),
    syllabusName: syllabus?.name ?? "",
    time: new Date(slot.time).toISOString(),
    poolCount,
    poolLimit,
    isAvailable: !!slot.isAvailable,
    isFull: poolCount >= poolLimit,
  };
}

/* ─── Link preview (WhatsApp / Instagram / Telegram cards) ─── */

/** Slot times are stored as a clock time in UTC (same as the website shows). */
export const formatSlotTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC" });

/**
 * Turn the tutor's Cloudinary photo into a 1200×630 preview image:
 * the whole photo (never cropped) centred on a Mentorlive deep-purple background.
 */
export function previewImage(url: string): string {
  if (!url) return "";
  const marker = "/image/upload/";
  if (!url.includes("res.cloudinary.com") || !url.includes(marker)) return url;
  return url.replace(marker, `${marker}c_pad,w_1200,h_630,b_rgb:2A1650,q_auto,f_jpg/`);
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/**
 * Tiny HTML page: link-preview bots read the meta tags (they don't run JavaScript),
 * real visitors are sent straight on to the booking page by the script.
 */
export function renderPreviewPage(opts: { joinUrl: string; summary: PoolShareSummary | null; siteUrl: string }): string {
  const { joinUrl, summary, siteUrl } = opts;
  const s = summary;
  const course = s ? [s.className, s.syllabusName].filter(Boolean).join(" · ") : "";
  const title = s ? `Join my ${s.subjectName} pool class with ${s.facultyName}` : "Mentorlive · Live online tutoring";
  const seatsLeft = s ? Math.max(s.poolLimit - s.poolCount, 0) : 0;
  const description = s
    ? `${[course, formatSlotTime(s.time)].filter(Boolean).join(" · ")} · Small group of up to ${s.poolLimit}${
        s.isAvailable && !s.isFull ? ` · ${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left` : ""
      }. Every new student lowers the fee.`
    : "Book live classes with verified faculty, one-on-one or in small groups.";
  const image = s ? previewImage(s.facultyImage) : "";

  const meta = [
    `<meta name="description" content="${esc(description)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Mentorlive">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${esc(joinUrl)}">`,
    image && `<meta property="og:image" content="${esc(image)}">`,
    image && `<meta property="og:image:secure_url" content="${esc(image)}">`,
    image && `<meta property="og:image:width" content="1200">`,
    image && `<meta property="og:image:height" content="630">`,
    image && `<meta property="og:image:alt" content="${esc(s!.facultyName)}">`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    image && `<meta name="twitter:image" content="${esc(image)}">`,
  ]
    .filter(Boolean)
    .join("\n    ");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>${esc(title)}</title>
    ${meta}
    <link rel="canonical" href="${esc(joinUrl)}">
    <style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#2A1650;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center;padding:24px}a{color:#FF6B5E;font-weight:800}</style>
  </head>
  <body>
    <p>Opening Mentorlive… <a href="${esc(joinUrl)}">Tap here if nothing happens</a></p>
    <script>location.replace(${JSON.stringify(joinUrl).replace(/</g, "\\u003c")});</script>
    <noscript><a href="${esc(siteUrl)}">Mentorlive</a></noscript>
  </body>
</html>`;
}
