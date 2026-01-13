import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { Syllabus } from "../entities/syllabus.entity.js";
import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";
import type { CreateSyllabusRequestDto } from "../dtos/syllabus.create.dto.js";
import type { ICreateSyllabusUseCase } from "./interfaces/create.syllabus.interface.js";

@injectable()
export class CreateSyllabusUseCase implements ICreateSyllabusUseCase{
  constructor(
    @inject("ISyllabusRepository")
    private readonly _syllabusRepository: ISyllabusRepository
  ) {}

  async execute(dto: CreateSyllabusRequestDto): Promise<void> {
    const normalizedName = dto.name.trim();

    // 1️⃣ Check duplicate
    const existing = await this._syllabusRepository.findByName(normalizedName);

    if (existing && !existing.isDeleted) {
      throw new CustomError(
        ResponseMessages.SYLLABUS_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    // 2️⃣ If syllabus exists but deleted → restore instead of creating
    if (existing && existing.isDeleted) {
      const restored = existing.restore();
      await this._syllabusRepository.save(restored);
      return;
    }

    // 3️⃣ Create domain entity
    const syllabusEntity = new Syllabus({
      id: null,
      name: normalizedName,
      isDeleted: false,
    });

    // 4️⃣ Persist
    const createdSyllabus = await this._syllabusRepository.create(syllabusEntity);

    if (!createdSyllabus) {
      throw new CustomError(
        ResponseMessages.SYLLABUS_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}