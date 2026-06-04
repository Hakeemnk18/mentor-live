import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { SyllabusController } from "../controllers/syllabus.controller.js";
const router = Router();
const authenticate = container.resolve(Authenticate);
const syllabusController = container.resolve(SyllabusController);
// create syllabus
router.post("/", authenticate.authenticate, authorizeRoles('admin'), (req, res) => syllabusController.createSyllabus(req, res));
// edit syllabus
router.put("/:id", authenticate.authenticate, authorizeRoles('admin'), (req, res) => syllabusController.editSyllabus(req, res));
// get syllabuses for admin with search and pagination
router.get("/", authenticate.authenticate, authorizeRoles('admin'), (req, res) => syllabusController.getSyllabusesForAdmin(req, res));
router.get('/list', (req, res) => syllabusController.getSyllabusesForUser(req, res));
export default router;
//# sourceMappingURL=syllabus.routes.js.map