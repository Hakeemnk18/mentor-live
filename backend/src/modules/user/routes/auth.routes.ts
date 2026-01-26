import { Router } from "express";
import { container } from "../../../di/container.js";
import { AuthController } from "../controllers/auth.controller.js";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import type { AuthRequest } from "../../../infrastructure/middileware/auth.type.js";
import { reteLimiter } from "../../../config/rate.limit.js";

const router = Router();

const authController = container.resolve(AuthController);
const authenticate = container.resolve(Authenticate);

router.post("/me", authenticate.authenticate, (req, res) =>
  authController.getCurrentUser(req as AuthRequest, res),
);

router.post("/logout", (req, res) =>
  authController.logoutUserController(req, res),
);

router.post("/refresh", reteLimiter, (req, res) =>
  authController.getRefreshToken(req, res),
);

router.post("/send-otp", reteLimiter,(req, res) => authController.sendOtp(req, res));
router.post("/resend-otp", reteLimiter,(req, res) => authController.resendOtp(req, res));
router.post("/verify-otp", reteLimiter,(req, res) => authController.verifyOtp(req, res));

export default router;
