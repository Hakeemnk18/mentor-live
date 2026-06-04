import type { Request, Response } from "express";
import type { IBannerController } from "./interfaces/banner.controller.interface.js";
import type { ICreateBannerUseCase } from "../use-cases/interfaces/create.banner.use-case.interface.js";
import type { IEditBannerUseCase } from "../use-cases/interfaces/edit.banner.use-case.interface.js";
import type { IDeleteBannerUseCase } from "../use-cases/interfaces/delete.banner.use-case.interface.js";
import type { IGetAllBannerUseCase } from "../use-cases/interfaces/get.all.banner.use-case.interface.js";
import type { IGetAllBannerForAdminUseCase } from "../use-cases/interfaces/get.all.banner.for.admin.use-case.interface.js";
import type { IToggleBannerShowUseCase } from "../use-cases/interfaces/toggle.banner.show.use-case.interface.js";
export declare class BannerController implements IBannerController {
    private readonly _createBannerUseCase;
    private readonly _editBannerUseCase;
    private readonly _deleteBannerUseCase;
    private readonly _getAllBannerUseCase;
    private readonly _getAllBannerForAdminUseCase;
    private readonly _toggleBannerShowUseCase;
    constructor(_createBannerUseCase: ICreateBannerUseCase, _editBannerUseCase: IEditBannerUseCase, _deleteBannerUseCase: IDeleteBannerUseCase, _getAllBannerUseCase: IGetAllBannerUseCase, _getAllBannerForAdminUseCase: IGetAllBannerForAdminUseCase, _toggleBannerShowUseCase: IToggleBannerShowUseCase);
    createBanner(req: Request, res: Response): Promise<void>;
    editBanner(req: Request, res: Response): Promise<void>;
    deleteBanner(req: Request, res: Response): Promise<void>;
    toggleBannerShow(req: Request, res: Response): Promise<void>;
    getAllBannerForAdmin(req: Request, res: Response): Promise<void>;
    getAllBannerForUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=banner.controller.d.ts.map