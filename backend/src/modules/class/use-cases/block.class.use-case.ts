import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { IClassRepository } from "../repositories/class.repository.interface.js";
import type { IBlockClassUseCase } from "./interfaces/block.class.use-case.interface.js";

/** Make a class inactive (admin). */
@injectable()
export class BlockClassUseCase implements IBlockClassUseCase {
  constructor(
    @inject("IClassRepository")
    private readonly _classRepository: IClassRepository
  ) {}

  async execute(id: string): Promise<void> {
    const cls = await this._classRepository.findById(id);

    if (!cls) {
      throw new CustomError(ResponseMessages.CLASS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (cls.isDeleted) {
      throw new CustomError(ResponseMessages.CLASS_ALREADY_DELETED, HttpStatusCode.BAD_REQUEST);
    }

    await this._classRepository.save(cls.delete());
  }
}
