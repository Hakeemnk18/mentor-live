import { inject, injectable } from "tsyringe";
import type { CreateChapterRequestDto } from "../../chapter/dtos/create.chapter.dto.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IEditFacultyUseCase } from "./interfaces/edit.faculty.use-case.interface.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { CreateFacultyRequestDto } from "../dtos/create.faculty.dto.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import { validateOnCreate } from "../../../core/utils/validate.time.slot.js";
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
    for (const subjectVariantId of dto.subjects) {
      const variant =
        await this._subjectVariantRepository.findById(subjectVariantId);

      if (!variant || variant.isDeleted) {
        throw new CustomError(
          ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }
    }

    /* ---------- apply edits (no slots touched) ---------- */
    const updateFaculty = faculty.updateProfile({
      name: normalizedName,
      qualifications: dto.qualifications,
      description: dto.description,
      demoClass: dto.demoClass,
      image: dto.image,
      price: dto.price,
      subjectOffering: dto.subjects,
    });

    /* ---------- persist ---------- */
    await this._facultyRepository.save(updateFaculty);
  }
}
