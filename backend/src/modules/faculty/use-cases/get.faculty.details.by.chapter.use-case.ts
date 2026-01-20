import { inject, injectable } from "tsyringe";
import type { IGetFacultyDetailsByChapterUseCase } from "./interfaces/get.faculty.details.by.chapter.use-case.interface.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { FacultyDetailsViewForUser } from "../types/faculty.type.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

@injectable()
export class GetFacultyDetailsByChapterUseCase implements IGetFacultyDetailsByChapterUseCase {
    constructor(
        @inject("IFacultyRepository")
        private readonly _facultyRepository: IFacultyRepository,
    
      ) {}
    async execute(facultyId: string, chapterId: string): Promise<FacultyDetailsViewForUser> {
        const faculty = await this._facultyRepository.findFacultyFullByIdAndChapter(facultyId, chapterId)
        if(!faculty){
            throw new CustomError(
                ResponseMessages.FACULTY_NOT_FOUND,
                HttpStatusCode.BAD_REQUEST
            )
        }
        return faculty
    }
}