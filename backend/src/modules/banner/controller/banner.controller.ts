import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { z } from "zod";

import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";

import type { IBannerController } from "./interfaces/banner.controller.interface.js";
import type { ICreateBannerUseCase } from "../use-cases/interfaces/create.banner.use-case.interface.js";
import type { IEditBannerUseCase } from "../use-cases/interfaces/edit.banner.use-case.interface.js";
import type { IDeleteBannerUseCase } from "../use-cases/interfaces/delete.banner.use-case.interface.js";
import type { IGetAllBannerUseCase } from "../use-cases/interfaces/get.all.banner.use-case.interface.js";
import type { IGetAllBannerForAdminUseCase } from "../use-cases/interfaces/get.all.banner.for.admin.use-case.interface.js";
import type { IToggleBannerShowUseCase } from "../use-cases/interfaces/toggle.banner.show.use-case.interface.js";
import { CreateBannerSchema, type CreateBannerRequestDto } from "../dto/create.banner.dto.js";

const ToggleShowSchema = z.object({
  isShow: z.boolean(),
  priority: z.number().int().min(1).max(5).optional(),
});

@injectable()
export class BannerController implements IBannerController {
  constructor(
    @inject("ICreateBannerUseCase")
    private readonly _createBannerUseCase: ICreateBannerUseCase,

    @inject("IEditBannerUseCase")
    private readonly _editBannerUseCase: IEditBannerUseCase,

    @inject("IDeleteBannerUseCase")
    private readonly _deleteBannerUseCase: IDeleteBannerUseCase,

    @inject("IGetAllBannerUseCase")
    private readonly _getAllBannerUseCase: IGetAllBannerUseCase,

    @inject("IGetAllBannerForAdminUseCase")
    private readonly _getAllBannerForAdminUseCase: IGetAllBannerForAdminUseCase,

    @inject("IToggleBannerShowUseCase")
    private readonly _toggleBannerShowUseCase: IToggleBannerShowUseCase,
  ) {}

  async createBanner(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateBannerRequestDto = CreateBannerSchema.parse(req.body);
      await this._createBannerUseCase.execute(dto);
      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.BANNER_CREATED,
      });
    } catch (error) {
      console.log("Error in createBanner:", error);
      handleError(res, error);
    }
  }

  async editBanner(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      const dto: CreateBannerRequestDto = CreateBannerSchema.parse(req.body);
      await this._editBannerUseCase.execute(id!, dto);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.BANNER_UPDATED,
      });
    } catch (error) {
      console.log("Error in editBanner:", error);
      handleError(res, error);
    }
  }

  async deleteBanner(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      await this._deleteBannerUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.BANNER_DELETED,
      });
    } catch (error) {
      console.log("Error in deleteBanner:", error);
      handleError(res, error);
    }
  }

  async toggleBannerShow(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      const { isShow, priority } = ToggleShowSchema.parse(req.body);
      await this._toggleBannerShowUseCase.execute(id!, isShow, priority);
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: isShow
          ? "Banner is now visible to users"
          : "Banner is now hidden from users",
      });
    } catch (error) {
      console.log("Error in toggleBannerShow:", error);
      handleError(res, error);
    }
  }

  async getAllBannerForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(
        parseReq(req, ["isShow"]),
      );
      const { data: banners, total } =
        await this._getAllBannerForAdminUseCase.execute(dto);

      const data = banners.map((b) => ({
        id: b.id,
        image: b.image,
        description: b.description,
        priority: b.priority,
        isShow: b.isShow,
        isDeleted: b.isDeleted,
      }));

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
        total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      });
    } catch (error) {
      console.log("Error in getAllBannerForAdmin:", error);
      handleError(res, error);
    }
  }

  async getAllBannerForUser(req: Request, res: Response): Promise<void> {
    try {
      const banners = await this._getAllBannerUseCase.execute();

      const data = banners.map((b) => ({
        image: b.image.url,
        description: b.description,
        priority: b.priority,
      }));

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
      });
    } catch (error) {
      console.log("Error in getAllBannerForUser:", error);
      handleError(res, error);
    }
  }
}
