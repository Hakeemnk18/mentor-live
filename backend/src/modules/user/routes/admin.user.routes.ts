import { Router } from "express";
import { container } from "../../../di/container.js";
import { AdminUserController } from "../controllers/admin.user.controller.js";

const router = Router();

const adminUserController = container.resolve(AdminUserController);

router.post("/", (req, res) => adminUserController.createUser(req, res));
router.get("/", (req, res) => adminUserController.getAllUsers(req, res));
router.put("/:id", (req, res) => adminUserController.editUser(req, res));
router.patch("/:id/block", (req, res) => adminUserController.blockUser(req, res));
router.patch("/:id/unblock", (req, res) => adminUserController.unblockUser(req, res));

export default router;
