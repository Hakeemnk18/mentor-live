import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { SubjectController } from "../controller/subject.controller.js";



const router = Router();

const authenticate = container.resolve(Authenticate);
const subjectController = container.resolve(SubjectController);


router.post(
  "/",
  (req, res) => subjectController.createSubject(req, res)
);


// router.put(
//   "/:id",
//   (req, res) => subjectController.editSyllabus(req, res)
// );


// router.get(
//   "/",
//   (req, res) => subjectController.getSyllabusesForAdmin(req, res)
// );

// router.get(
//   '/list',
//   (req,res) => subjectController.getSyllabusesForUser(req,res)
// )

export default router;
