import { inject, injectable } from "tsyringe";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IEditFacultyUseCase } from "./interfaces/edit.faculty.use-case.interface.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { IFacultySlotRepository } from "../../faculty-slot/repository/faculty.slot.repository.interface.js";
import type { EditFacultyRequestDto } from "../dtos/edit.faculty.dto.js";

@injectable()
export class EditFacultyUseCase implements IEditFacultyUseCase {
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

  async execute(id: string, dto: EditFacultyRequestDto): Promise<void> {
    /* ---------- fetch faculty ---------- */
    const faculty = await this._facultyRepository.findById(id);

    if (!faculty || faculty.isDeleted) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    /* ---------- normalize & validate name ---------- */
    const normalizedName = dto.name.trim();

    if (normalizedName !== faculty.name) {
      const existing = await this._facultyRepository.findByName(normalizedName);

      if (existing && !existing.isDeleted && existing.id !== faculty.id) {
        throw new CustomError(
          ResponseMessages.FACULTY_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    /* ---------- validate subject variants ---------- */
    for (const offering of dto.subjects) {
      const variant =
        await this._subjectVariantRepository.findById(offering.variantId);

      if (!variant || variant.isDeleted) {
        throw new CustomError(
          ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }
    }

    /* ---------- sync slots for removed variants ---------- */
    const oldVariantIds = new Set(faculty.subjectOffering.map((s) => s.variantId));
    const newVariantIds = new Set(dto.subjects.map((s) => s.variantId));
    const removedVariantIds = [...oldVariantIds].filter((id) => !newVariantIds.has(id));

    if (removedVariantIds.length > 0) {
      const hasBookings = await this._facultySlotRepository.hasActivePooledSlots(
        id,
        removedVariantIds,
      );

      if (hasBookings) {
        throw new CustomError(
          ResponseMessages.VARIANT_HAS_ACTIVE_BOOKINGS,
          HttpStatusCode.CONFLICT,
        );
      }

      await this._facultySlotRepository.deleteByFacultyAndVariants(id, removedVariantIds);
    }

    /* ---------- apply edits ---------- */
    const updateFaculty = faculty.updateProfile({
      name: normalizedName,
      qualifications: dto.qualifications,
      description: dto.description,
      demoClass: dto.demoClass,
      image: dto.image,
      subjectOffering: dto.subjects.map((s) => ({
        variantId: s.variantId,
        price: s.price,
      })),
    });

    /* ---------- persist ---------- */
    await this._facultyRepository.save(updateFaculty);
  }
}
