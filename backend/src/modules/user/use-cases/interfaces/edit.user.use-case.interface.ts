import type { EditUserRequestDto } from "../../dtos/edit.user.dto.js";
import type { User } from "../../entities/user.entity.js";

export interface IEditUserUseCase {
  execute(id: string, dto: EditUserRequestDto): Promise<User>;
}
