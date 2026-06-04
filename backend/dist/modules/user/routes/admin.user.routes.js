import { Router } from "express";
import { container } from "../../../di/container.js";
import { AdminUserController } from "../controllers/admin.user.controller.js";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
const router = Router();
const adminUserController = container.resolve(AdminUserController);
const authenticate = container.resolve(Authenticate);
// create user
router.post("/", authenticate.authenticate, authorizeRoles('admin'), (req, res) => adminUserController.createUser(req, res));
// get all users for admin with search and pagination
router.get("/", authenticate.authenticate, authorizeRoles('admin'), (req, res) => adminUserController.getAllUsers(req, res));
// edit user details
router.put("/:id", authenticate.authenticate, authorizeRoles('admin'), (req, res) => adminUserController.editUser(req, res));
// block user
router.patch("/:id/block", authenticate.authenticate, authorizeRoles('admin'), (req, res) => adminUserController.blockUser(req, res));
// unblock user
router.patch("/:id/unblock", authenticate.authenticate, authorizeRoles('admin'), (req, res) => adminUserController.unblockUser(req, res));
export default router;
//# sourceMappingURL=admin.user.routes.js.map