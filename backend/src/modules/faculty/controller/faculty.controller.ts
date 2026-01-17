import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import type { IFacultyController } from "./interfaces/faculty.controller.interface.js";
import type { ICreateFacultyUseCase } from "../use-cases/interfaces/create.faculty.use-case.interface.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import {
  CreateFacultySchema,
  type CreateFacultyRequestDto,
} from "../dtos/create.faculty.dto.js";
import type { IGetAllFacultyForAdminUseCase } from "../use-cases/interfaces/get.all.faculty.for.admin.use-case.interface.js";
import { FindByClassSyllabusQuerySchema } from "../../../core/shared/dtos/get.by.class.and.subject.dto.js";
import { parseListQuery } from "../../../core/utils/parse.list.query.helper.js";

@injectable()
export class FacultyController implements IFacultyController {
  constructor(
    @inject("ICreateFacultyUseCase")
    private readonly _createFacultyUseCase: ICreateFacultyUseCase,

    @inject("IGetAllFacultyForAdminUseCase")
    private readonly _getAllFacultyForAdminUseCase: IGetAllFacultyForAdminUseCase
  ) {}

  async createFaculty(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateFacultyRequestDto = CreateFacultySchema.parse(req.body);

      await this._createFacultyUseCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.FACULTY_CREATED,
      });
    } catch (error) {
      console.log("Error in createFaculty:", error);
      handleError(res, error);
    }
  }

  async GetAllFacultyForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const dto = FindByClassSyllabusQuerySchema.parse(parseListQuery(req));

      const { data, total } = await this._getAllFacultyForAdminUseCase.execute(
        dto
      );

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SUCCESS,
        success: true,
        data: data,
        total: total,
      });
    } catch (error) {
      console.log("Error in get all faculty for admin:", error);
      handleError(res, error);
    }
  }
}
