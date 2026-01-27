import { inject, injectable } from "tsyringe";
import type { AddChapterSlotRequestDto } from "../dtos/add.chapter.dto.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type {  IFacultyAddChapterSlotUseCase } from "./interfaces/faculty.add.chapter.slot.use-case.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";

@injectable()
export class FacultyAddChapterSlotUseCase implements IFacultyAddChapterSlotUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository,
  ) {}
  async execute(
    facultyId: string,
    dto: AddChapterSlotRequestDto,
  ): Promise<void> {
    /* ---------- fetch faculty ---------- */
    let faculty = await this._facultyRepository.findById(facultyId);

    if (!faculty || faculty.isDeleted) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    for (const slot of dto.chapterSlots) {
      const chapter = await this._chapterRepository.findById(slot.chapter);
      if (!chapter || chapter.isDeleted) {
        throw new CustomError(
          ResponseMessages.CHAPTER_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }
    }

    faculty.addChapterSlots(dto.chapterSlots)

    await this._facultyRepository.addChapterSlots(facultyId, dto)
  }
}
