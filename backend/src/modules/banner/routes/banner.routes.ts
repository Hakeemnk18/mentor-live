import { Router } from "express";
import { container } from "tsyringe";

import { BannerController } from "../controller/banner.controller.js";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";

const router = Router();

const authenticate = container.resolve(Authenticate);
const bannerController = container.resolve(BannerController);

/* ---------- CREATE ---------- */
router.post(
  "/",
  (req, res) => bannerController.createBanner(req, res)
);

/* ---------- EDIT ---------- */
router.put(
  "/:id",
  (req, res) => bannerController.editBanner(req, res)
);

/* ---------- DELETE (hard delete) ---------- */
router.delete(
  "/:id",
  (req, res) => bannerController.deleteBanner(req, res)
);

/* ---------- USER: get all banners ---------- */
router.get(
  "/list",
  (req, res) => bannerController.getAllBannerForUser(req, res)
);

/* ---------- ADMIN: get all banners ---------- */
router.get(
  "/",
  (req, res) => bannerController.getAllBannerForAdmin(req, res)
);

export default router;