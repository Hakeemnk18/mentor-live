import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Faculty } from "../entities/faculty.entity.js";

import type { IFacultyRepository } from "../repository/faculty.repository.interface.js"; 
import type { CreateFacultyRequestDto } from "../dtos/create.faculty.dto.js"; 
import type { ICreateFacultyUseCase } from "./interfaces/create.faculty.use-case.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";

@injectable()
export class CreateFacultyUseCase implements ICreateFacultyUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository,

    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository
  ) {}

  async execute(dto: CreateFacultyRequestDto): Promise<void> {
    /* ---------- normalize name ---------- */
    const normalizedName = dto.name.trim();

    /* ---------- uniqueness check ---------- */
    const existing = await this._facultyRepository.findByName(normalizedName);
    if (existing && !existing.isDeleted) {
      throw new CustomError(
        ResponseMessages.FACULTY_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    /**
     * Validation phase (read-only)
     * - validate subject variants
     * - validate chapters (if provided)
     */
    for (const subjectVariantId of dto.subjects) {
      const variant =
        await this._subjectVariantRepository.findById(subjectVariantId);

      if (!variant || variant.isDeleted) {
        throw new CustomError(
          ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
          HttpStatusCode.NOT_FOUND
        );
      }
    }

    if (dto.chapterSlots) {
      for (const slot of dto.chapterSlots) {
        const chapter = await this._chapterRepository.findById(slot.chapter);
        if (!chapter || chapter.isDeleted) {
          throw new CustomError(
            ResponseMessages.CHAPTER_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        }
      }
    }

    /**
     * Create Faculty entity
     */
    const facultyEntity = new Faculty({
      id: null,
      name: normalizedName,
      qualifications: dto.qualifications,
      description: dto.description,
      demoClass: dto.demoClass,
      image: dto.image,
      price: dto.price,
      subjectOffering: dto.subjects,
      slots: dto.slots.map(slot => ({
        time: slot.time,
        isAvailable: true,
        pool: [],
        poolLimit: 5,
      })),
      chapterSlots: (dto.chapterSlots ?? []).map(slot => ({
        chapterId: slot.chapter,
        isAvailable: true,
        pool: [],
        poolLimit: 5,
      })),
      isDeleted: false,
    });

    const faculty = await this._facultyRepository.create(facultyEntity);

    if (!faculty) {
      throw new CustomError(
        ResponseMessages.FACULTY_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
