import type { User } from "../../entities/user.entity.js";

export interface IGetAllUsersUseCase {
  execute(): Promise<User[]>;
}
