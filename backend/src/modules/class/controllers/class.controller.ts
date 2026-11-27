import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";


import { CreateClassSchema } from "../dtos/class.create.dto.js";
import type { CreateClassRequestDto } from "../dtos/class.create.dto.js";

import type { ICreateClassUseCase } from "../use-cases/interfaces/create.class.use-case.interface.js";
import type { IEditClassUseCase } from "../use-cases/interfaces/edit.class.use-case.interface.js";
import type { IClassController } from "./interfaces/class.controller.interfaces.js";
import type { IGetClassesForUserUseCase } from "../use-cases/interfaces/get.all.for.user.use-case.interface.js";
import type { IGetClassesForAdminUseCase } from "../use-cases/interfaces/get.all.for.admin.use-case.interface.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";


import type { IBlockClassUseCase } from "../use-cases/interfaces/block.class.use-case.interface.js";
import type { IUnblockClassUseCase } from "../use-cases/interfaces/unblock.class.use-case.interface.js";

@injectable()
export class ClassController implements IClassController {
  constructor(
    @inject("ICreateClassUseCase")
    private readonly _createClassUseCase: ICreateClassUseCase,

    @inject("IEditClassUseCase")
    private readonly _editClassUseCase: IEditClassUseCase,

    @inject("IGetClassesForUserUseCase")
    private readonly _getClassesForUserUseCase: IGetClassesForUserUseCase,

    @inject("IGetClassesForAdminUseCase")
    private readonly _getClassesForAdminUseCase: IGetClassesForAdminUseCase,

    @inject("IBlockClassUseCase")
    private readonly _blockClassUseCase: IBlockClassUseCase,

    @inject("IUnblockClassUseCase")
    private readonly _unblockClassUseCase: IUnblockClassUseCase
  ) {}

  /** 🏗️ Create class (Admin) */
  async createClass(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateClassRequestDto = CreateClassSchema.parse(req.body);

      await this._createClassUseCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.CLASS_CREATED,
      });
    } catch (error) {
      console.log("Error in createClass:", error);
      handleError(res, error);
    }
  }

  /** ✏️ Edit class (Admin) */
  async editClass(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);

      const dto: CreateClassRequestDto = CreateClassSchema.parse(req.body);

      await this._editClassUseCase.execute(id!, dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.CLASS_UPDATED,
      });
    } catch (error) {
      console.log("Error in editClass:", error);
      handleError(res, error);
    }
  }

  /** 👤 User: get active classes for dropdown */
  async getClassesForUser(req: Request, res: Response): Promise<void> {
    try {
      const classes = await this._getClassesForUserUseCase.execute();

      res.status(HttpStatusCode.OK).json({
        success: true,
        data: classes,
      });
    } catch (error) {
      console.log("Error in getClassesForUser:", error);
      handleError(res, error);
    }
  }

  /** 🛠️ Admin: get all classes (including deleted) */
  async getClassesForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted"]));
      const { data, total } = await this._getClassesForAdminUseCase.execute(dto)
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data: data,
        total: total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      });

      
    } catch (error) {
      console.log("Error in getClassesForAdmin:", error);
      handleError(res, error);
    }
  }

  /** Make a class inactive (admin) */
  async blockClass(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      await this._blockClassUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({ success: true, message: ResponseMessages.CLASS_DELETED });
    } catch (error) {
      handleError(res, error);
    }
  }

  /** Make a class active again (admin) */
  async unblockClass(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      await this._unblockClassUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({ success: true, message: ResponseMessages.CLASS_RESTORED });
    } catch (error) {
      handleError(res, error);
    }
  }
}
