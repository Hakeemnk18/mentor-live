import type { Request, Response } from "express";
import type { ISubjectController } from "./interfaces/subject.controller.interface.js";
import { inject, injectable } from "tsyringe";
import type { ICreateSubjectUseCase } from "../use-cases/interfaces/create.subject.use-case.interface.js";
import { CreateSubjectSchema, type CreateSubjectRequestDto } from "../dtos/subject.create.dto.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { handleError } from "../../../core/errors/custom.error.js";


@injectable()
export class SubjectController implements ISubjectController {
    
    constructor(
        @inject("ICreateSubjectUseCase")
        private readonly _createSubjectUseCase: ICreateSubjectUseCase
    ){}
    async createSubject(req: Request, res: Response): Promise<void> {
        try {
              const dto: CreateSubjectRequestDto = CreateSubjectSchema.parse(req.body);
        
              await this._createSubjectUseCase.execute(dto)
        
              res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: ResponseMessages.SYLLABUS_CREATED,
              });
            } catch (error) {
              console.log("Error in createSubject:", error);
              handleError(res, error);
            }
    }
}