import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";



import type { ICreateChapterUseCase } from "../use-cases/interfaces/create.chapter.use-case.interface.js";
import type { IEditChapterUseCase } from "../use-cases/interfaces/edit.chapter.use-case.interface.js";
import type { IGetChaptersForUserUseCase } from "../use-cases/interfaces/get.all.for.user.use-case.interface.js";
import type { IGetChaptersForAdminUseCase } from "../use-cases/interfaces/get.all.for.admin.use-case.interface.js";
import type { IBlockChapterUseCase } from "../use-cases/interfaces/block.chapter.use-case.interface.js";
import type { IUnblockChapterUseCase } from "../use-cases/interfaces/unblock.chapter.use-case.interface.js";

import type { IChapterController } from "./interfaces/chapter.controller.interface.js";

import { handleError } from "../../../core/errors/custom.error.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import { GetAllQuerySchema } from "../../../core/shared/dtos/get.all.doc.dto.js";
import { parseReq } from "../../../core/utils/parse.query.helper.js";
import { CreateChapterSchema, type CreateChapterRequestDto } from "../dtos/create.chapter.dto.js";
import { FindByClassSyllabusQuerySchema } from "../../../core/shared/dtos/get.by.class.and.subject.dto.js";
import { parseListQuery } from "../../../core/utils/parse.list.query.helper.js";
import { ChapterListQuerySchema } from "../dtos/get.chapter.dto.js";

@injectable()
export class ChapterController implements IChapterController {
  constructor(
    @inject("ICreateChapterUseCase")
    private readonly _createChapterUseCase: ICreateChapterUseCase,

    @inject("IEditChapterUseCase")
    private readonly _editChapterUseCase: IEditChapterUseCase,

    @inject("IGetChaptersForUserUseCase")
    private readonly _getChaptersForUserUseCase: IGetChaptersForUserUseCase,

    @inject("IGetChaptersForAdminUseCase")
    private readonly _getChaptersForAdminUseCase: IGetChaptersForAdminUseCase,

    @inject("IBlockChapterUseCase")
    private readonly _blockChapterUseCase: IBlockChapterUseCase,

    @inject("IUnblockChapterUseCase")
    private readonly _unblockChapterUseCase: IUnblockChapterUseCase
  ) {}

  /** 🏗️ Create chapter (Admin) */
  async createChapter(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateChapterRequestDto = CreateChapterSchema.parse(req.body);

      await this._createChapterUseCase.execute(dto);

      res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: ResponseMessages.CHAPTER_CREATED,
      });
    } catch (error) {
      console.log("Error in createChapter:", error);
      handleError(res, error);
    }
  }

  /** ✏️ Edit chapter (Admin) */
  async editChapter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);

      const dto: CreateChapterRequestDto = CreateChapterSchema.parse(req.body);

      await this._editChapterUseCase.execute(id!, dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.CHAPTER_UPDATED,
      });
    } catch (error) {
      console.log("Error in editChapter:", error);
      handleError(res, error);
    }
  }

  /** 👤 User: get chapters for a subject variant */
  async getChaptersForUser(req: Request, res: Response): Promise<void> {
    try {
   

    const dto = ChapterListQuerySchema.parse(parseListQuery(req));

      const chapters =
        await this._getChaptersForUserUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SUCCESS,
        success: true,
        data: chapters,
      });
    } catch (error) {
      console.log("Error in getChaptersForUser:", error);
      handleError(res, error);
    }
  }

  /** 🛠️ Admin: get all chapters (including deleted) */
  async getChaptersForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetAllQuerySchema.parse(parseReq(req, ["isDeleted","classId","syllabusId","subjectId"]));

      const { data, total } =
        await this._getChaptersForAdminUseCase.execute(dto);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.SUCCESS,
        data,
        total,
        currentPage: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      });
    } catch (error) {
      console.log("Error in getChaptersForAdmin:", error);
      handleError(res, error);
    }
  }

  /** 🚫 Block (soft-delete) chapter */
  async blockChapter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);

      await this._blockChapterUseCase.execute(id!);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.CHAPTER_DELETED,
      });
    } catch (error) {
      console.log("Error in blockChapter:", error);
      handleError(res, error);
    }
  }

  /** ♻️ Unblock (restore) chapter */
  async unblockChapter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      validateObjectId(id);

      await this._unblockChapterUseCase.execute(id!);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: ResponseMessages.CHAPTER_RESTORED,
      });
    } catch (error) {
      console.log("Error in unblockChapter:", error);
      handleError(res, error);
    }
  }
}
