/** Mentorlive public contact details — change them here and they update everywhere. */
export const CONTACT_PHONE_DISPLAY = "+91 88480 11309";
export const CONTACT_PHONE_TEL = "+918848011309";

/** WhatsApp number in international format without "+" (used for wa.me links). */
export const WHATSAPP_NUMBER = "918848011309";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CONTACT_EMAIL = "info@mentorlive.com";

/** Social profiles. Leave url as null until the profile exists — it shows as "Coming soon". */
export type SocialNetwork = "instagram" | "youtube" | "facebook" | "x";
export const SOCIAL_LINKS: { network: SocialNetwork; name: string; handle: string; url: string | null }[] = [
  { network: "instagram", name: "Instagram", handle: "@mentorlive.in", url: "https://www.instagram.com/mentorlive.in/" },
  { network: "youtube", name: "YouTube", handle: "Mentorlive", url: null },
  { network: "facebook", name: "Facebook", handle: "Mentorlive", url: null },
  { network: "x", name: "X", handle: "@mentorlive", url: null },
];
