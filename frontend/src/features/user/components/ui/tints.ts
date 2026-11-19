/** Soft background + matching ink colour pairs from the design's subject palette. */
export const TINTS = [
  { bg: "#EDE6FB", ink: "#512B81" }, // lavender
  { bg: "#DCEBFF", ink: "#1F4FA0" }, // ice blue
  { bg: "#FFE3DF", ink: "#B4332A" }, // rose
  { bg: "#DDF3E6", ink: "#1E7A4B" }, // mint
  { bg: "#FFF1CC", ink: "#8A5A00" }, // butter
] as const;

/** Stable tint for a string (same name → same colour on every render). */
export const tintFor = (key: string | undefined | null) => {
  const s = key ?? "";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length];
};

/** "Anjali Menon" → "AM" */
export const initials = (name: string | undefined | null, max = 2) =>
  (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, max);
