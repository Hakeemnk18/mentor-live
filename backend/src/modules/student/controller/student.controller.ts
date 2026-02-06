import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";

import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";

import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
import type { IStudentController } from "./interfaces/student.controller.interface.js";
import type { IGetAllForAdminStudentUseCase } from "../use-cases/interfaces/get.all.for.admin.use-case.interface.js";
import type { IBlockStudentUseCase } from "../use-cases/interfaces/block.student.interface.js";
import type { IUnblockStudentUseCase } from "../use-cases/interfaces/unblock.student.interface.js";



@injectable()
export class StudentController implements IStudentController {
  constructor(
    @inject("IGetAllForAdminStudentUseCase")
    private readonly _getStudentsForAdminUseCase: IGetAllForAdminStudentUseCase,

    @inject("IBlockStudentUseCase")
    private readonly _blockStudentUseCase: IBlockStudentUseCase,

    @inject("IUnblockStudentUseCase")
    private readonly _unblockStudentUseCase: IUnblockStudentUseCase
  ) {}

  /** 🛠️ Admin: get all students */
  async getStudentsForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(
        parseReq(req, ["isDeleted","syllabus","class"])
      );

      const { data, total } =
        await this._getStudentsForAdminUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
        total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      });
    } catch (error) {
      console.log("Error in getStudentsForAdmin:", error);
      handleError(res, error);
    }
  }

  /** 🚫 Admin: block student */
  async blockStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);

      await this._blockStudentUseCase.execute(id!);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.STUDENT_BLOCKED,
      });
    } catch (error) {
      console.log("Error in blockStudent:", error);
      handleError(res, error);
    }
  }

  /** ✅ Admin: unblock student */
  async unblockStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);

      await this._unblockStudentUseCase.execute(id!);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.STUDENT_UNBLOCKED,
      });
    } catch (error) {
      console.log("Error in unblockStudent:", error);
      handleError(res, error);
    }
  }
}
