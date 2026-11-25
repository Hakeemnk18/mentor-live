import type { Application } from "express";
import { shareApiRouter, sharePageRouter } from "./share.routes.js";

/**
 * "Invite a friend to this pool" links.
 * - GET /api/v1/share/pool/:slotId → JSON summary for the website's /join page
 * - GET /share/pool/:slotId        → small HTML page with link-preview tags (tutor photo), then redirects to /join
 */
export default function registerShareModule(app: Application) {
  app.use("/api/v1/share", shareApiRouter);
  app.use("/share", sharePageRouter);
}
