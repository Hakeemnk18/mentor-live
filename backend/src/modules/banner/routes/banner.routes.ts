import { Router } from "express";
import { container } from "tsyringe";

import { BannerController } from "../controller/banner.controller.js";

const router = Router();

const bannerController = container.resolve(BannerController);

/* ---------- CREATE ---------- */
router.post(
  "/",
  (req, res) => bannerController.createBanner(req, res),
);

/* ---------- EDIT ---------- */
router.put(
  "/:id",
  (req, res) => bannerController.editBanner(req, res),
);

/* ---------- TOGGLE SHOW / HIDE ---------- */
router.patch(
  "/:id/toggle-show",
  (req, res) => bannerController.toggleBannerShow(req, res),
);

/* ---------- DELETE (hard delete) ---------- */
router.delete(
  "/:id",
  (req, res) => bannerController.deleteBanner(req, res),
);

/* ---------- USER: get visible banners (max 5) ---------- */
router.get(
  "/list",
  (req, res) => bannerController.getAllBannerForUser(req, res),
);

/* ---------- ADMIN: get all banners with search/pagination ---------- */
router.get(
  "/",
  (req, res) => bannerController.getAllBannerForAdmin(req, res),
);

export default router;
