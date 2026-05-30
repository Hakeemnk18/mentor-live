import { inject, injectable } from "tsyringe";
import type { ICreateUserUseCase } from "./interfaces/create.user.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
import type { IHashingService } from "../../../core/ports/hashing.service.interface.js";
import { User } from "../entities/user.entity.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import type { CreateUserRequestDto } from "../dtos/create.user.dto.js";

@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,

    @inject("IHashingService")
    private readonly _hashingService: IHashingService,
  ) {}

  async execute(dto: CreateUserRequestDto): Promise<User> {
    const existing = await this._userRepository.findByEmail(dto.email);
    if (existing) {
      throw new CustomError(
        ResponseMessages.EMAIL_ALREADY_EXISTS,
        HttpStatusCode.CONFLICT,
      );
    }

    const hashedPassword = await this._hashingService.hash(dto.password);

    const user = new User({
      id: null,
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      tokenVersion: 0,
      isVerified: true,
      isBlocked: false,
    });

    return await this._userRepository.create(user);
  }
}
