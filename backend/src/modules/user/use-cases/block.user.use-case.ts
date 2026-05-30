import { inject, injectable } from "tsyringe";
import type { IBlockUserUseCase } from "./interfaces/block.user.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

@injectable()
export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this._userRepository.findById(id);
    if (!user) {
      throw new CustomError(
        ResponseMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (user.isBlocked) {
      throw new CustomError(
        ResponseMessages.USER_ALREADY_BLOCKED,
        HttpStatusCode.CONFLICT,
      );
    }

    const blocked = user.block();
    await this._userRepository.save(blocked);
  }
}
