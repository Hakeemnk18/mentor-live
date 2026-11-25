/**
 * Base address for "invite a friend" links.
 * The link opens a tiny backend page that gives WhatsApp etc. the tutor's photo,
 * then forwards the visitor to /join/:slotId on the website.
 *
 * Set VITE_SHARE_URL (e.g. https://mentorlive.in/s) once the static site rewrites /s/* to the API's /share/*.
 * Without it, links use the API's own address (…/share), which works the same.
 */
const apiOrigin = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/api\/v\d+\/?$/, "");
const SHARE_BASE = ((import.meta.env.VITE_SHARE_URL as string | undefined) || `${apiOrigin}/share`).replace(/\/$/, "");

export const poolInviteLink = (slotId: string) => `${SHARE_BASE}/pool/${encodeURIComponent(slotId)}`;
