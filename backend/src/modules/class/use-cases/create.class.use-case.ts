import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { Class } from "../entities/class.entity.js";
import type { IClassRepository } from "../repositories/class.repository.interface.js";
import type { CreateClassRequestDto } from "../dtos/class.create.dto.js";
import type { ICreateClassUseCase } from "./interfaces/create.class.use-case.interface.js";

@injectable()
export class CreateClassUseCase implements ICreateClassUseCase{
  constructor(
    @inject("IClassRepository")
    private readonly _classRepository: IClassRepository
  ) {}

  async execute(dto: CreateClassRequestDto): Promise<void> {
    const normalizedName = dto.name.trim();

    // 1️⃣ Check duplicate
    const existing = await this._classRepository.findByName(normalizedName);

    if (existing && !existing.isDeleted) {
      throw new CustomError(
        ResponseMessages.CLASS_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    // 2️⃣ If class exists but deleted → restore instead of creating
    if (existing && existing.isDeleted) {
      const restored = existing.restore();
      await this._classRepository.save(restored);
      return;
    }

    // 3️⃣ Create domain entity
    const classEntity = new Class({
      id: null,
      name: normalizedName,
      isDeleted: false,
    });

    // 4️⃣ Persist
    const createdClass = await this._classRepository.create(classEntity);

    if (!createdClass) {
      throw new CustomError(
        ResponseMessages.CLASS_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
