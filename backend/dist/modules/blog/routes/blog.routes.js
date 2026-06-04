import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { BlogController } from "../controller/blog.controller.js";
const router = Router();
const authenticate = container.resolve(Authenticate);
const blogController = container.resolve(BlogController);
/* ---------- CREATE ---------- */
router.post("/", authenticate.authenticate, authorizeRoles("admin"), (req, res) => blogController.createBlog(req, res));
/* ---------- EDIT ---------- */
router.put("/:id", authenticate.authenticate, authorizeRoles("admin"), (req, res) => blogController.editBlog(req, res));
/* ---------- DELETE (soft delete) ---------- */
router.patch("/:id/block", authenticate.authenticate, authorizeRoles("admin"), (req, res) => blogController.blockBlog(req, res));
/* ---------- UNBLOCK ---------- */
router.patch("/:id/unblock", authenticate.authenticate, authorizeRoles("admin"), (req, res) => blogController.unblockBlog(req, res));
/* ---------- USER: get all blogs ---------- */
router.get("/list", (req, res) => blogController.getAllBlogForUser(req, res));
/* ---------- ADMIN: get all blogs ---------- */
router.get("/", authenticate.authenticate, authorizeRoles("admin"), (req, res) => blogController.getAllBlogForAdmin(req, res));
/* ---------- GET FULL BLOG DETAILS ---------- */
router.get("/:id", (req, res) => blogController.getFullBlogDetails(req, res));
export default router;
//# sourceMappingURL=blog.routes.js.map