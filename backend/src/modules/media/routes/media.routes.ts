import { Router } from "express";
import {container} from '../../../di/container.js'
import { MediaController } from "../controller/media.controller.js";

const router = Router();

const mediaController = container.resolve(MediaController)

router.get("/cloudinary/signature",
    (req, res) => mediaController.UploadSignature(req, res)
 );

export default router;