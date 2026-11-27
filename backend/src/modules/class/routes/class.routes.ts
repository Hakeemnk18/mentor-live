import { Router } from "express";
import { container } from "tsyringe";
import { ClassController } from "../controllers/class.controller.js";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";


const router = Router();

const authenticate = container.resolve(Authenticate);
const classController = container.resolve(ClassController);

// create class
router.post(
  "/",
  authenticate.authenticate,
  authorizeRoles('admin'),
  (req, res) => classController.createClass(req, res)
);

// edit class
router.put(
  "/:id",
  authenticate.authenticate,
  authorizeRoles('admin'),
  (req, res) => classController.editClass(req, res)
);

// get all classes for admin with search and pagination
router.get(
  "/",
  authenticate.authenticate,
  authorizeRoles('admin'),
  (req, res) => classController.getClassesForAdmin(req, res)
);

// get all classes for user
router.get(
  '/list',
  (req,res) => classController.getClassesForUser(req,res)
)

// make a class inactive / active again (admin)
router.patch(
  "/:id/block",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => classController.blockClass(req, res)
);

router.patch(
  "/:id/unblock",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => classController.unblockClass(req, res)
);

export default router;
