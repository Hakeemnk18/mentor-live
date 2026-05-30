import { inject, injectable } from "tsyringe";
import type { IEditUserUseCase } from "./interfaces/edit.user.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
import type { IHashingService } from "../../../core/ports/hashing.service.interface.js";
import { User } from "../entities/user.entity.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { EditUserRequestDto } from "../dtos/edit.user.dto.js";

@injectable()
export class EditUserUseCase implements IEditUserUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,

    @inject("IHashingService")
    private readonly _hashingService: IHashingService,
  ) {}

  async execute(id: string, dto: EditUserRequestDto): Promise<User> {
    const user = await this._userRepository.findById(id);
    if (!user) {
      throw new CustomError(
        ResponseMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this._userRepository.findByEmail(dto.email);
      if (existing) {
        throw new CustomError(
          ResponseMessages.EMAIL_ALREADY_EXISTS,
          HttpStatusCode.CONFLICT,
        );
      }
    }

    let password = user.password;
    if (dto.password) {
      password = await this._hashingService.hash(dto.password);
    }

    const updated = new User({
      id: user.id,
      name: dto.name ?? user.name,
      email: dto.email ?? user.email,
      password,
      role: dto.role ?? user.role,
      tokenVersion: user.tokenVersion,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      googleId: user.googleId,
    });

    return await this._userRepository.save(updated);
  }
}
