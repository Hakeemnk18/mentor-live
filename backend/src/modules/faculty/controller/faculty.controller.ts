import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import type { IFacultyController } from "./interfaces/faculty.controller.interface.js";
import type { ICreateFacultyUseCase } from "../use-cases/interfaces/create.faculty.use-case.interface.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError, handleError } from "../../../core/errors/custom.error.js";
import {
  CreateFacultySchema,
  type CreateFacultyRequestDto,
} from "../dtos/create.faculty.dto.js";
import type { IGetAllFacultyForAdminUseCase } from "../use-cases/interfaces/get.all.faculty.for.admin.use-case.interface.js";
import { FindByClassSyllabusQuerySchema } from "../../../core/shared/dtos/get.by.class.and.subject.dto.js";
import { parseListQuery } from "../../../core/utils/parse.list.query.helper.js";
import { validateObjectId } from "../../../core/utils/validate.object-id.helper.js";
import type { IGetFacultyDetailsUseCase } from "../use-cases/interfaces/get.faculty.details.use-case.interface.js";
import type { IEditFacultyUseCase } from "../use-cases/interfaces/edit.faculty.use-case.interface.js";
import { EditFacultySchema } from "../dtos/edit.faculty.dto.js";
import type { IFacultyAddSlotUseCase } from "../use-cases/interfaces/faculty.add.slot.use-case.interface.js";
import { AddSlotSchema } from "../dtos/add.slot.dto.js";
import type { IFacultyAddChapterSlotUseCase } from "../use-cases/interfaces/faculty.add.chapter.slot.use-case.interface.js";
import { AddChapterSlotSchema } from "../dtos/add.chapter.dto.js";
import { FindFacultyByChapterUseCase } from "../use-cases/find.faculty.by.chapter.use-case.js";
import { GetAllFacultyBYClassAndSyllabusSchema } from "../dtos/find.by.class.and.syllbus.dto.js";
import type { IFindFacultyByChapterUseCase } from "../use-cases/interfaces/find.faculty.by.chapter.use-case.interface.js";
import type { IFindFacultyByClassAndSyllabusUseCaseUseCase } from "../use-cases/interfaces/find.faculty.by.class.and.syllabus.use-case.interface.js";
import { GetAllFacultyBYChapterSchema } from "../dtos/find.by.chapter.dto.js";
import { parseChapterQuery } from "../utils/parse.chapter.request.qury.js";
import type { IGetFacultyDetailsByChapterUseCase } from "../use-cases/interfaces/get.faculty.details.by.chapter.use-case.interface.js";
import z from "zod";
import { ObjectIdSchema } from "../../../core/utils/object.id.validation.js";
import type { IGetFacultyDetailsBySlotUseCase } from "../use-cases/interfaces/get.faculty.details.by.slot.use-case.interface.js";

@injectable()
export class FacultyController implements IFacultyController {
  constructor(
    @inject("ICreateFacultyUseCase")
    private readonly _createFacultyUseCase: ICreateFacultyUseCase,

    @inject("IGetAllFacultyForAdminUseCase")
    private readonly _getAllFacultyForAdminUseCase: IGetAllFacultyForAdminUseCase,

    @inject("IGetFacultyDetailsUseCase")
    private readonly _getFacultyDetailsForAdminUseCase: IGetFacultyDetailsUseCase,

    @inject("IEditFacultyUseCase")
    private readonly _editFacultyUseCase: IEditFacultyUseCase,

    @inject("IFacultyAddSlotUseCase")
    private readonly _facultyAddSlotUseCase: IFacultyAddSlotUseCase,

    @inject("IFacultyAddChapterSlotUseCase")
    private readonly _facultyAddChapterSlotUseCase: IFacultyAddChapterSlotUseCase,

    @inject("IFindFacultyByChapterUseCase")
    private readonly _findFacultyByChapterUseCase: IFindFacultyByChapterUseCase,

    @inject("IFindFacultyByClassAndSyllabusUseCaseUseCase")
    private readonly _findFacultyByClassAndSyllabusUseCaseUseCase: IFindFacultyByClassAndSyllabusUseCaseUseCase,

    @inject("IGetFacultyDetailsByChapterUseCase")
    private readonly _getFacultyDetailsByChapterUseCase: IGetFacultyDetailsByChapterUseCase,

    @inject("IGetFacultyDetailsBySlotUseCase")
    private readonly _getFacultyDetailsBySlotUseCase: IGetFacultyDetailsBySlotUseCase,
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

      const { data, total } =
        await this._getAllFacultyForAdminUseCase.execute(dto);

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

  async getFacultyDetailsForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const facultyId = req.params.id;
      validateObjectId(facultyId);

      const facultyDetails =
        await this._getFacultyDetailsForAdminUseCase.execute(facultyId!);
      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SUCCESS,
        success: true,
        data: facultyDetails,
      });
    } catch (error) {
      console.log("Error in get faculty details for admin:", error);
      handleError(res, error);
    }
  }

  async editFaculty(req: Request, res: Response): Promise<void> {
    try {
      const facultyId = req.params.id;
      validateObjectId(facultyId);

      const dto = EditFacultySchema.parse(req.body);
      await this._editFacultyUseCase.execute(facultyId!, dto);

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.FACULTY_UPDATED,
        success: true,
      });
    } catch (error) {
      console.log("Error in Edit faculty  for admin:", error);
      handleError(res, error);
    }
  }

  async facultyAddSlots(req: Request, res: Response): Promise<void> {
    try {
      const facultyId = req.params.id;
      validateObjectId(facultyId);
      const dto = AddSlotSchema.parse(req.body);
      await this._facultyAddSlotUseCase.execute(facultyId!, dto);
      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SLOT_ADDED_SUCCESS,
        success: true,
      });
    } catch (error) {
      console.log("Error in  add faculty slot", error);
      handleError(res, error);
    }
  }

  async facultyAddChapterSlots(req: Request, res: Response): Promise<void> {
    try {
      const facultyId = req.params.id;
      validateObjectId(facultyId);
      const dto = AddChapterSlotSchema.parse(req.body);
      await this._facultyAddChapterSlotUseCase.execute(facultyId!, dto);
      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SLOT_ADDED_SUCCESS,
        success: true,
      });
    } catch (error) {
      console.log("Error in  add faculty chapter slot", error);
      handleError(res, error);
    }
  }

  async findAllFacultyForUser(req: Request, res: Response): Promise<void> {
    try {
      const type = req.query.type;
      if (type !== "class" && type !== "chapter") {
        throw new CustomError(
          ResponseMessages.INVALID_FACULTY_LIST_TYPE,
          HttpStatusCode.BAD_REQUEST
        )
      }
      let data;
      if (type === "class") {
        const dto = GetAllFacultyBYClassAndSyllabusSchema.parse(
          parseListQuery(req),
        );
        data =
          await this._findFacultyByClassAndSyllabusUseCaseUseCase.execute(dto);
      } else if (type === "chapter") {
        const dto = GetAllFacultyBYChapterSchema.parse(parseChapterQuery(req));
        data = await this._findFacultyByChapterUseCase.execute(dto);
      }

      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SUCCESS,
        success: true,
        data: data,
      });
    } catch (error) {
      console.log("Error in  find faculty for user", error);
      handleError(res, error);
    }
  }

  async getFacultyDetailsByChapter(req: Request, res: Response): Promise<void> {
    try {
      validateObjectId(req.params.id)
      
      const facultyId = req.params.id
      const chapterId = ObjectIdSchema.parse(req.query.chapterId);
      const data = await this._getFacultyDetailsByChapterUseCase.execute(facultyId!, chapterId)
      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SUCCESS,
        success: true,
        data: data
      });
      
    } catch (error) {
       console.log("Error in  get faculty details by chapter", error);
      handleError(res, error);
    }
  }

  async getFacultyDetailsBySlot(req: Request, res: Response): Promise<void> {
    try {
      validateObjectId(req.params.id)
      
      const facultyId = req.params.id
      let slotId
      if(req.query.slotId){
        slotId = ObjectIdSchema.parse(req.query.slotId);
      }
      
      const data = await this._getFacultyDetailsBySlotUseCase.execute(facultyId!, slotId)
      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.SUCCESS,
        success: true,
        data: data
      });
      
    } catch (error) {
       console.log("Error in  get faculty details by slot", error);
      handleError(res, error);
    }
  }
}
