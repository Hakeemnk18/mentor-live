import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";

import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";

import type { IAddSubjectVariantUseCase } from "../use-cases/interfaces/add.subject.variant.use-case.interface.js";
import type { IDeleteSubjectVariantUseCase } from "../use-cases/interfaces/delete.subject.variant.use-case.interface.js";
import type { ISubjectVariantController } from "./interfaces/subject.variant.controller.interface.js";

import {
  AddSubjectVariantSchema,
  type AddSubjectVariantRequestDto,
} from "../dtos/add.subject.variant.dto.js";

@injectable()
export class SubjectVariantController implements ISubjectVariantController {
  constructor(
    @inject("IAddSubjectVariantUseCase")
    private readonly _addSubjectVariantUseCase: IAddSubjectVariantUseCase,

    @inject("IDeleteSubjectVariantUseCase")
    private readonly _deleteSubjectVariantUseCase: IDeleteSubjectVariantUseCase
  ) {}

  async addSubjectVariant(req: Request, res: Response): Promise<void> {
    try {
      const { subjectId } = req.params;

      validateObjectId(subjectId);
      const dto: AddSubjectVariantRequestDto = AddSubjectVariantSchema.parse(
        req.body
      );

      await this._addSubjectVariantUseCase.execute(subjectId!, dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.SUBJECT_VARIANT_CREATED,
      });
    } catch (error) {
      console.log("Error in addSubjectVariant:", error);
      handleError(res, error);
    }
  }

  async removeSubjectVariant(req: Request, res: Response): Promise<void> {
    try {
      const { subjectId, id } = req.params;

      validateObjectId(subjectId);
      validateObjectId(id);

      await this._deleteSubjectVariantUseCase.execute(subjectId!, id!);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUBJECT_VARIANT_DELETED,
      });
    } catch (error) {
      console.log("Error in removeSubjectVariant:", error);
      handleError(res, error);
    }
  }
}
