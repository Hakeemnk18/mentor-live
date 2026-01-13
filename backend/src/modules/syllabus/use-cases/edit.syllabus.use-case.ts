import { inject, injectable } from "tsyringe";
import type { CreateSyllabusRequestDto } from "../dtos/syllabus.create.dto.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";
import type { IEditSyllabusUseCase } from "./interfaces/edit.syllabus.interface.js";

@injectable()
export class EditSyllabusUseCase implements IEditSyllabusUseCase{
  constructor(
    @inject("ISyllabusRepository")
    private readonly _syllabusRepository: ISyllabusRepository
  ) {}

  async execute(id: string, dto: CreateSyllabusRequestDto): Promise<void> {
    const normalizedName = dto.name.trim();

    // 1️⃣ Fetch syllabus
    const existingSyllabus = await this._syllabusRepository.findById(id);

    if (!existingSyllabus) {
      throw new CustomError(
        ResponseMessages.SYLLABUS_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    // 2️⃣ If name is changing, check for duplicates
    if (existingSyllabus.name !== normalizedName) {
        
      const duplicate = await this._syllabusRepository.findByName(normalizedName);

      if (duplicate && !duplicate.isDeleted) {
        throw new CustomError(
          ResponseMessages.SYLLABUS_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST
        );
      }
    }

    // 3️⃣ Rename via domain
    const renamed = existingSyllabus.rename(normalizedName);

    // 4️⃣ Persist
    await this._syllabusRepository.save(renamed);
  }
}
