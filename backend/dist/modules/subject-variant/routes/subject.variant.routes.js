import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { SubjectVariantController } from "../controller/subject.variant.controller.js";
const router = Router({ mergeParams: true });
const authenticate = container.resolve(Authenticate);
const subjectVariantController = container.resolve(SubjectVariantController);
router.get('/subjects', (req, res) => subjectVariantController.findAllSubjectVariantWithSubject(req, res));
export default router;
//# sourceMappingURL=subject.variant.routes.js.map