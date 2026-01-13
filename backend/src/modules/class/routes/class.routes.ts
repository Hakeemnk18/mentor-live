import { Router } from "express";
import { container } from "tsyringe";
import { ClassController } from "../controllers/class.controller.js";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";


const router = Router();

const authenticate = container.resolve(Authenticate);
const classController = container.resolve(ClassController);


router.post(
  "/",
  authenticate.authenticate,
  authorizeRoles('admin'),
  (req, res) => classController.createClass(req, res)
);


router.put(
  "/:id",
  (req, res) => classController.editClass(req, res)
);


router.get(
  "/",
  (req, res) => classController.getClassesForAdmin(req, res)
);

router.get(
  '/list',
  (req,res) => classController.getClassesForUser(req,res)
)

export default router;
