import { Router } from "express";
import { container } from "tsyringe";
import { LeadController } from "../controller/lead.controller.js";

const router = Router();

const leadController = container.resolve(LeadController);

/* ---------- CREATE — public (no auth) ---------- */
router.post(
  "/",
  (req, res) => leadController.createLead(req, res),
);

/* ---------- ADMIN: get all leads ---------- */
router.get(
  "/",
  (req, res) => leadController.getAllLeads(req, res),
);

/* ---------- ADMIN: update lead status ---------- */
router.patch(
  "/:id/status",
  (req, res) => leadController.updateLeadStatus(req, res),
);

export default router;
