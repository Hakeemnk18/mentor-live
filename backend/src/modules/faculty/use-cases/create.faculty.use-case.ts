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
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import { toMinutes, validateOnCreate } from "../../../core/utils/validate.time.slot.js";

@injectable()
export class CreateFacultyUseCase implements ICreateFacultyUseCase {
  constructor(
    @inject("IFacultyRepository")
    private readonly _facultyRepository: IFacultyRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository,

    @inject("IChapterRepository")
    private readonly _chapterRepository: IChapterRepository,

    @inject("IFacultySlotRepository")
    private readonly _facultySlotRepository: IFacultySlotRepository,
  ) {}

  async execute(dto: CreateFacultyRequestDto): Promise<void> {
    /* ── Normalize name ── */
    const normalizedName = dto.name.trim();

    /* ── Uniqueness check ── */
    const existing = await this._facultyRepository.findByName(normalizedName);
    if (existing && !existing.isDeleted) {
      throw new CustomError(
        ResponseMessages.FACULTY_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    /* ── Validate subject variants ── */
    for (const offering of dto.subjects) {
      const variant = await this._subjectVariantRepository.findById(
        offering.variantId,
      );
      if (!variant || variant.isDeleted) {
        throw new CustomError(
          ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }
    }

    /* ── Validate chapters ── */
    if (dto.chapterSlots) {
      for (const slot of dto.chapterSlots) {
        const chapter = await this._chapterRepository.findById(slot.chapter);
        if (!chapter || chapter.isDeleted) {
          throw new CustomError(
            ResponseMessages.CHAPTER_NOT_FOUND,
            HttpStatusCode.NOT_FOUND,
          );
        }
      }
    }

    /* ── Validate time slots per variant (1-hr gap, end before midnight) ── */
    for (const group of dto.subjectSlots) {
      if (!validateOnCreate(group.times)) {
        throw new CustomError(
          ResponseMessages.SLOT_TIME_NOT_VALID,
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    /* ── Featured faculty cap (max 8 at a time) ── */
    if (dto.isFeatured) {
      const featuredCount = await this._facultyRepository.countFeatured();
      if (featuredCount >= 8) {
        throw new CustomError(
          ResponseMessages.FACULTY_FEATURED_LIMIT_REACHED,
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    /* ── Create Faculty document (no embedded slots) ── */
    const facultyEntity = new Faculty({
      id: null,
      name: normalizedName,
      qualifications: dto.qualifications,
      description: dto.description,
      demoClass: dto.demoClass,
      image: dto.image,
      subjectOffering: dto.subjects.map((s) => ({
        variantId: s.variantId,
        price: s.price,
      })),
      chapterSlots: (dto.chapterSlots ?? []).map((slot) => ({
        chapterId: slot.chapter,
        isAvailable: true,
        pool: [],
        poolLimit: 5,
        poolCycle: 1,
      })),
      isDeleted: false,
      isFeatured: dto.isFeatured ?? false,
    });

    const faculty = await this._facultyRepository.create(facultyEntity);

    if (!faculty || !faculty.id) {
      throw new CustomError(
        ResponseMessages.FACULTY_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    /* ── Create FacultySlot documents (one per variant × time) ── */
    const slotsToCreate = dto.subjectSlots.flatMap((group) => {
      const sorted = [...group.times].sort(
        (a, b) => toMinutes(a.time) - toMinutes(b.time),
      );
      return sorted.map((s) => ({
        facultyId: faculty.id!,
        variantId: group.variantId,
        time: new Date(s.time),
      }));
    });

    await this._facultySlotRepository.createMany(slotsToCreate);
  }
}
