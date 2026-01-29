import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";

import type { IBannerController } from "./interfaces/banner.controller.interface.js";
import type { ICreateBannerUseCase } from "../use-cases/interfaces/create.banner.use-case.interface.js";
import type { IEditBannerUseCase } from "../use-cases/interfaces/edit.banner.use-case.interface.js";
import type { IDeleteBannerUseCase } from "../use-cases/interfaces/delete.banner.use-case.interface.js";
import type { IGetAllBannerUseCase } from "../use-cases/interfaces/get.all.banner.use-case.interface.js";
import { CreateBannerSchema, type CreateBannerRequestDto } from "../dto/create.banner.dto.js";



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
    private readonly _getAllBannerUseCase: IGetAllBannerUseCase
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

  async getAllBannerForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const data = await this._getAllBannerUseCase.execute();

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
      });
    } catch (error) {
      console.log("Error in get banners for admin:", error);
      handleError(res, error);
    }
  }

  async getAllBannerForUser(req: Request, res: Response): Promise<void> {
    try {
      const banners = await this._getAllBannerUseCase.execute();

      //  User-specific response mapping
      const data = banners.map((banner) => ({
        image: banner.image.url,
        description: banner.description,
      }));

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
      });
    } catch (error) {
      console.log("Error in get banners for user:", error);
      handleError(res, error);
    }
  }
}
