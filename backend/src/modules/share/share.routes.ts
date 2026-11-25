import { Router } from "express";
import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import { getPoolShareSummary, renderPreviewPage } from "./share.service.js";

/** Public website address used in share links (first entry of FRONTEND_URL). */
const siteUrl = () =>
  (env.FRONTEND_URL ?? "http://localhost:5173").split(",")[0]!.trim().replace(/\/$/, "");

/* ── JSON: what the /join page needs to open the booking form ── */
export const shareApiRouter = Router();

shareApiRouter.get("/pool/:slotId", async (req: Request, res: Response) => {
  try {
    const summary = await getPoolShareSummary(String(req.params.slotId));
    if (!summary) return res.status(404).json({ success: false, message: "This class is no longer available." });
    return res.json({ success: true, data: summary });
  } catch (err) {
    console.error("share summary failed", err);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

/* ── HTML: the link people share (shows the tutor's photo in WhatsApp etc.) ── */
export const sharePageRouter = Router();

sharePageRouter.get("/pool/:slotId", async (req: Request, res: Response) => {
  const slotId = String(req.params.slotId);
  const joinUrl = `${siteUrl()}/join/${encodeURIComponent(slotId)}`;
  let summary = null;
  try {
    summary = await getPoolShareSummary(slotId);
  } catch (err) {
    console.error("share preview failed", err);
  }
  res
    .status(200)
    .set("Content-Type", "text/html; charset=utf-8")
    // previews are re-read now and then; seat counts change, so keep the cache short
    .set("Cache-Control", "public, max-age=300")
    .send(renderPreviewPage({ joinUrl, summary, siteUrl: siteUrl() }));
});
