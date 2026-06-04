import type { Request, Response } from "express";
export interface IBannerController {
    createBanner(req: Request, res: Response): Promise<void>;
    editBanner(req: Request, res: Response): Promise<void>;
    deleteBanner(req: Request, res: Response): Promise<void>;
    toggleBannerShow(req: Request, res: Response): Promise<void>;
    getAllBannerForAdmin(req: Request, res: Response): Promise<void>;
    getAllBannerForUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=banner.controller.interface.d.ts.map