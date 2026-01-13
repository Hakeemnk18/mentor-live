import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { SyllabusController } from "../controllers/syllabus.controller.js";


const router = Router();

const authenticate = container.resolve(Authenticate);
const syllabusController = container.resolve(SyllabusController);


router.post(
  "/",

  (req, res) => syllabusController.createSyllabus(req, res)
);


router.put(
  "/:id",
  (req, res) => syllabusController.editSyllabus(req, res)
);


router.get(
  "/",
  (req, res) => syllabusController.getSyllabusesForAdmin(req, res)
);

router.get(
  '/list',
  (req,res) => syllabusController.getSyllabusesForUser(req,res)
)

export default router;
