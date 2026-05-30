import { inject, injectable } from "tsyringe";
import type { IGetAllUsersUseCase } from "./interfaces/get.all.users.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
import type { User } from "../entities/user.entity.js";

@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return await this._userRepository.findAll();
  }
}
