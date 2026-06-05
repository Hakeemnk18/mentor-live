import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { ChapterController } from "../controller/chapter.controller.js";

const router = Router();

const authenticate = container.resolve(Authenticate);
const chapterController = container.resolve(ChapterController);


// create chapter
router.post(
  "/",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => chapterController.createChapter(req, res)
);

// edit chapter
router.put(
  "/:id",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => chapterController.editChapter(req, res)
);

// block chapter
router.patch(
  "/:id/block",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => chapterController.blockChapter(req, res)
);

// unblock chapter
router.patch(
  "/:id/unblock",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => chapterController.unblockChapter(req, res)
);

// get all chapters for user
router.get(
  "/list",
  (req, res) => chapterController.getChaptersForUser(req, res)
);

// get chapter name and id for dropdowns
router.get("/names", (req, res) =>
  chapterController.getChapterNameAndId(req, res)
);

// get all chapters for admin with search and pagination
router.get(
  "/",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => chapterController.getChaptersForAdmin(req, res)
);


// get chapter details by id for admin
router.get(
  "/:id",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => chapterController.getChapterDetailsForAdmin(req, res)
);

export default router;
