import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { SubjectController } from "../controller/subject.controller.js";



const router = Router();

const authenticate = container.resolve(Authenticate);
const subjectController = container.resolve(SubjectController);


// create subject
router.post(
  "/",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => subjectController.createSubject(req, res)
);

// edit subject name
router.put(
  "/:id",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => subjectController.editSubjectName(req, res)
);

// make a subject inactive / active again (admin)
router.patch(
  "/:id/block",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => subjectController.blockSubject(req, res)
);

router.patch(
  "/:id/unblock",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => subjectController.unblockSubject(req, res)
);

router.get(
  '/list',
  (req,res) => subjectController.getAllSubjectForUser(req,res)
)

// get all subjects for admin with search and pagination
router.get(
  "/",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => subjectController.getAllSubjectForAdmin(req, res)
);

// get subject details for admin
router.get(
  "/:id",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => subjectController.getSubjectDetails(req, res)
);




export default router;
