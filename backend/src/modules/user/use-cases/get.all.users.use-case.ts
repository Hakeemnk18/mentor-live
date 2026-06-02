import { inject, injectable } from "tsyringe";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { IGetAllUsersUseCase } from "./interfaces/get.all.users.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
import type { User } from "../entities/user.entity.js";

@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(dto: GetAllQueryDto): Promise<{ data: User[]; total: number }> {
    const { page, search, limit, sortValue, filters } = dto;

    let query: Record<string, any> = {};
    let sort: Record<string, any> = { createdAt: -1 };

    if (search && search.trim() !== "") {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ];
    }

    if (filters && Object.keys(filters).length > 0) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          query[key] = value;
        }
      }
    }

    if (sortValue) {
      const dir = sortValue.startsWith("-") ? -1 : 1;
      const field = sortValue.replace(/^-/, "");
      sort = { [field]: dir };
    }

    const allDoc: IGetAllDocDB = { page, limit, query, sort };

    const [data, total] = await Promise.all([
      this._userRepository.findAllPaginated(allDoc),
      this._userRepository.countDocument(query),
    ]);

    return { data, total };
  }
}
