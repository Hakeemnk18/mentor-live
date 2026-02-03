import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { ChapterController } from "../controller/chapter.controller.js";

const router = Router();

const authenticate = container.resolve(Authenticate);
const chapterController = container.resolve(ChapterController);



router.post(
  "/",
  
  (req, res) => chapterController.createChapter(req, res)
);

router.put(
  "/:id",
  
  (req, res) => chapterController.editChapter(req, res)
);

router.patch(
  "/:id/block",
  
  (req, res) => chapterController.blockChapter(req, res)
);

router.patch(
  "/:id/unblock",
  
  (req, res) => chapterController.unblockChapter(req, res)
);


router.get(
  "/list",
  (req, res) => chapterController.getChaptersForUser(req, res)
);


router.get("/names", (req, res) =>
  chapterController.getChapterNameAndId(req, res)
);

router.get(
  "/",
  
  (req, res) => chapterController.getChaptersForAdmin(req, res)
);



router.get(
  "/:id",
  
  (req, res) => chapterController.getChaptersForAdmin(req, res) 
);

export default router;
