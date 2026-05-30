import type { CreateUserRequestDto } from "../../dtos/create.user.dto.js";
import type { User } from "../../entities/user.entity.js";

export interface ICreateUserUseCase {
  execute(dto: CreateUserRequestDto): Promise<User>;
}
