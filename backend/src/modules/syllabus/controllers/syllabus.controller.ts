import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";

import { CreateSyllabusSchema } from "../dtos/syllabus.create.dto.js";
import type { CreateSyllabusRequestDto } from "../dtos/syllabus.create.dto.js";


import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
import type { ISyllabusController } from "./interfaces/syllabus.controller.interface.js";
import type { ICreateSyllabusUseCase } from "../use-cases/interfaces/create.syllabus.interface.js";
import type { IEditSyllabusUseCase } from "../use-cases/interfaces/edit.syllabus.interface.js";
import type { IGetSyllabusesForUserUseCase } from "../use-cases/interfaces/get.all.for.user.interface.js";
import type { IGetSyllabusesForAdminUseCase } from "../use-cases/interfaces/get.all.for.admin.interface.js";

import type { IBlockSyllabusUseCase } from "../use-cases/interfaces/block.syllabus.use-case.interface.js";
import type { IUnblockSyllabusUseCase } from "../use-cases/interfaces/unblock.syllabus.use-case.interface.js";

@injectable()
export class SyllabusController implements ISyllabusController {
  constructor(
    @inject("ICreateSyllabusUseCase")
    private readonly _createSyllabusUseCase: ICreateSyllabusUseCase,

    @inject("IEditSyllabusUseCase")
    private readonly _editSyllabusUseCase: IEditSyllabusUseCase,

    @inject("IGetSyllabusesForUserUseCase")
    private readonly _getSyllabusesForUserUseCase: IGetSyllabusesForUserUseCase,

    @inject("IGetSyllabusesForAdminUseCase")
    private readonly _getSyllabusesForAdminUseCase: IGetSyllabusesForAdminUseCase,

    @inject("IBlockSyllabusUseCase")
    private readonly _blockSyllabusUseCase: IBlockSyllabusUseCase,

    @inject("IUnblockSyllabusUseCase")
    private readonly _unblockSyllabusUseCase: IUnblockSyllabusUseCase
  ) {}

  /** 🏗️ Create syllabus (Admin) */
  async createSyllabus(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateSyllabusRequestDto = CreateSyllabusSchema.parse(req.body);

      await this._createSyllabusUseCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.SYLLABUS_CREATED,
      });
    } catch (error) {
      console.log("Error in createSyllabus:", error);
      handleError(res, error);
    }
  }

  /** ✏️ Edit syllabus (Admin) */
  async editSyllabus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);

      const dto: CreateSyllabusRequestDto = CreateSyllabusSchema.parse(req.body);

      await this._editSyllabusUseCase.execute(id!, dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SYLLABUS_UPDATED,
      });
    } catch (error) {
      console.log("Error in editSyllabus:", error);
      handleError(res, error);
    }
  }

  /** 👤 User: get active syllabuses for dropdown */
  async getSyllabusesForUser(req: Request, res: Response): Promise<void> {
    try {
      const syllabuses = await this._getSyllabusesForUserUseCase.execute();

      res.status(HttpStatusCode.OK).json({
        success: true,
        data: syllabuses,
      });
    } catch (error) {
      console.log("Error in getSyllabusesForUser:", error);
      handleError(res, error);
    }
  }

  /** 🛠️ Admin: get all syllabuses (including deleted) */
  async getSyllabusesForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted"]));

      const { data, total } = await this._getSyllabusesForAdminUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data: data,
        total: total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      });
    } catch (error) {
      console.log("Error in getSyllabusesForAdmin:", error);
      handleError(res, error);
    }
  }

  /** Make a syllabus inactive (admin) */
  async blockSyllabus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      await this._blockSyllabusUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({ success: true, message: ResponseMessages.SYLLABUS_DELETED });
    } catch (error) {
      handleError(res, error);
    }
  }

  /** Make a syllabus active again (admin) */
  async unblockSyllabus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      await this._unblockSyllabusUseCase.execute(id!);
      res.status(HttpStatusCode.OK).json({ success: true, message: ResponseMessages.SYLLABUS_RESTORED });
    } catch (error) {
      handleError(res, error);
    }
  }
}
