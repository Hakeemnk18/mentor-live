import type { Request, Response } from "express";
import type { AuthRequest } from "../../../../infrastructure/middileware/auth.type.js";
export interface IAuthController {
    getCurrentUser(req: AuthRequest, res: Response): Promise<void>;
    logoutUserController(req: AuthRequest, res: Response): Promise<void>;
    getRefreshToken(req: Request, res: Response): Promise<void>;
    sendOtp(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.interface.d.ts.map