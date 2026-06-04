import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllUsersUseCase } from "./interfaces/get.all.users.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
import type { User } from "../entities/user.entity.js";
export declare class GetAllUsersUseCase implements IGetAllUsersUseCase {
    private readonly _userRepository;
    constructor(_userRepository: IUserRepository);
    execute(dto: GetAllQueryDto): Promise<{
        data: User[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.users.use-case.d.ts.map