import leadRouter from "./routes/lead.routes.js";
import type { Application } from "express";

export default function registerLeadModule(app: Application) {
  app.use("/api/v1/leads", leadRouter);
}
