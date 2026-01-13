import { inject, injectable } from "tsyringe";
import type { CreateClassRequestDto } from "../dtos/class.create.dto.js"; 
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { IClassRepository } from "../repositories/class.repository.interface.js";

@injectable()
export class EditClassUseCase {
  constructor(
    @inject("IClassRepository")
    private readonly _classRepository: IClassRepository
  ) {}

  async execute(id: string, dto: CreateClassRequestDto): Promise<void> {
    const normalizedName = dto.name.trim();

    // 1️⃣ Fetch class
    const existingClass = await this._classRepository.findById(id);

    if (!existingClass) {
      throw new CustomError(
        ResponseMessages.CLASS_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    // 2️⃣ If name is changing, check for duplicates
    if (existingClass.name !== normalizedName) {
      const duplicate = await this._classRepository.findByName(normalizedName);

      if (duplicate && !duplicate.isDeleted) {
        throw new CustomError(
          ResponseMessages.CLASS_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST
        );
      }
    }

    // 3️⃣ Rename via domain
    const renamed = existingClass.rename(normalizedName);

    // 4️⃣ Persist
    await this._classRepository.save(renamed);
  }
}
