import type { IEditUserUseCase } from "./interfaces/edit.user.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
import type { IHashingService } from "../../../core/ports/hashing.service.interface.js";
import { User } from "../entities/user.entity.js";
import type { EditUserRequestDto } from "../dtos/edit.user.dto.js";
export declare class EditUserUseCase implements IEditUserUseCase {
    private readonly _userRepository;
    private readonly _hashingService;
    constructor(_userRepository: IUserRepository, _hashingService: IHashingService);
    execute(id: string, dto: EditUserRequestDto): Promise<User>;
}
//# sourceMappingURL=edit.user.use-case.d.ts.map