import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { StudentController } from "../controller/student.controller.js";



const router = Router();

const authenticate = container.resolve(Authenticate);
const studentController = container.resolve(StudentController);





router.get(
  "/",
  (req, res) => studentController.getStudentsForAdmin(req, res)
);

router.patch(
  "/:id/block",
  
  (req, res) => studentController.blockStudent(req, res)
);

router.patch(
  "/:id/unblock",
  
  (req, res) => studentController.unblockStudent(req, res)
);

export default router;
