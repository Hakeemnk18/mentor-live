import type { GetAllQueryDto } from "../../../../core/shared/dtos/get.all.doc.dto.js";
import type { User } from "../../entities/user.entity.js";

export interface IGetAllUsersUseCase {
  execute(dto: GetAllQueryDto): Promise<{ data: User[]; total: number }>;
}
