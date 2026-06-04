import { Router } from "express";
import { container } from "tsyringe";
import { LeadController } from "../controller/lead.controller.js";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
const router = Router();
const leadController = container.resolve(LeadController);
const authenticate = container.resolve(Authenticate);
/* ---------- CREATE — public (no auth) ---------- */
router.post("/", (req, res) => leadController.createLead(req, res));
/* ---------- ADMIN: get all leads ---------- */
router.get("/", authenticate.authenticate, authorizeRoles("admin"), (req, res) => leadController.getAllLeads(req, res));
/* ---------- ADMIN: update lead status ---------- */
router.patch("/:id/status", authenticate.authenticate, authorizeRoles("admin"), (req, res) => leadController.updateLeadStatus(req, res));
export default router;
//# sourceMappingURL=lead.routes.js.map