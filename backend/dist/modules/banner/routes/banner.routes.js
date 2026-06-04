import { Router } from "express";
import { container } from "tsyringe";
import { BannerController } from "../controller/banner.controller.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
const router = Router();
const bannerController = container.resolve(BannerController);
const authenticate = container.resolve(Authenticate);
/* ---------- CREATE ---------- */
router.post("/", authenticate.authenticate, authorizeRoles("admin"), (req, res) => bannerController.createBanner(req, res));
/* ---------- EDIT ---------- */
router.put("/:id", authenticate.authenticate, authorizeRoles("admin"), (req, res) => bannerController.editBanner(req, res));
/* ---------- TOGGLE SHOW / HIDE ---------- */
router.patch("/:id/toggle-show", authenticate.authenticate, authorizeRoles("admin"), (req, res) => bannerController.toggleBannerShow(req, res));
/* ---------- DELETE (hard delete) ---------- */
router.delete("/:id", authenticate.authenticate, authorizeRoles("admin"), (req, res) => bannerController.deleteBanner(req, res));
/* ---------- USER: get visible banners (max 5) ---------- */
router.get("/list", (req, res) => bannerController.getAllBannerForUser(req, res));
/* ---------- ADMIN: get all banners with search/pagination ---------- */
router.get("/", authenticate.authenticate, authorizeRoles("admin"), (req, res) => bannerController.getAllBannerForAdmin(req, res));
export default router;
//# sourceMappingURL=banner.routes.js.map