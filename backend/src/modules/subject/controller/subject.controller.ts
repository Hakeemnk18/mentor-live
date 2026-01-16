import type { Request, Response } from "express";
import type { ISubjectController } from "./interfaces/subject.controller.interface.js";
import { inject, injectable } from "tsyringe";
import type { ICreateSubjectUseCase } from "../use-cases/interfaces/create.subject.use-case.interface.js";
import {
  CreateSubjectSchema,
  type CreateSubjectRequestDto,
} from "../dtos/subject.create.dto.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import type { IEditSubjectUseCase } from "../use-cases/interfaces/edit.subject.use-case.interface.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import {
  EditSubjectSchema,
  type EditSubjectRequestDto,
} from "../dtos/edit.subject.dto.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
import type { IGetSubjectsForAdminUseCase } from "../use-cases/interfaces/get.all.subject.for.admin.use-case.interface.js";
import type { IGetSubjectDetailsUseCase } from "../use-cases/interfaces/get.subject.details.use-case.interface.js";
import type { IGetAllSubjectForUserUseCase } from "../use-cases/interfaces/get.all.subject.for.user.use-case.interface.js";

@injectable()
export class SubjectController implements ISubjectController {
  constructor(
    @inject("ICreateSubjectUseCase")
    private readonly _createSubjectUseCase: ICreateSubjectUseCase,

    @inject("IEditSubjectUseCase")
    private readonly _editSubjectUseCase: IEditSubjectUseCase,

    @inject("IGetSubjectsForAdminUseCase")
    private readonly _getSubjectsForAdminUseCase: IGetSubjectsForAdminUseCase,

    @inject("IGetSubjectDetailsUseCase")
    private readonly _getSubjectDetailsUseCase: IGetSubjectDetailsUseCase,

    @inject("IGetAllSubjectForUserUseCase")
    private readonly _getAllSubjectForUserUseCase: IGetAllSubjectForUserUseCase
  ) {}

  async createSubject(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateSubjectRequestDto = CreateSubjectSchema.parse(req.body);

      await this._createSubjectUseCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.SUBJECT_CREATED,
      });
    } catch (error) {
      console.log("Error in createSubject:", error);
      handleError(res, error);
    }
  }

  async editSubjectName(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      const dto: EditSubjectRequestDto = EditSubjectSchema.parse(req.body);
      await this._editSubjectUseCase.execute(id!, dto.name);
      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.SUBJECT_UPDATED,
      });
    } catch (error) {
      console.log("Error in Edit Subject:", error);
      handleError(res, error);
    }
  }

  async getAllSubjectForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted"]));
      const { data, total } = await this._getSubjectsForAdminUseCase.execute(
        dto
      );
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data: data,
        total: total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      });
    } catch (error) {
      console.log("Error in get subject for admin", error);
      handleError(res, error);
    }
  }

  async getSubjectDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);
      const data  = await this._getSubjectDetailsUseCase.execute(id!)

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data: data
      });
    } catch (error) {
    console.log("Error in get subject details for admin", error);
      handleError(res, error);
    }
  }

  async getAllSubjectForUser(req: Request, res: Response): Promise<void> {
    try {
      const data = await this._getAllSubjectForUserUseCase.execute();
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data: data,
      });
    } catch (error) {
      console.log("Error in get subject for user", error);
      handleError(res, error);
    }
  }
}
