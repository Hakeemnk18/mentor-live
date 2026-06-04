import type { ICreateUserUseCase } from "./interfaces/create.user.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
import type { IHashingService } from "../../../core/ports/hashing.service.interface.js";
import { User } from "../entities/user.entity.js";
import type { CreateUserRequestDto } from "../dtos/create.user.dto.js";
export declare class CreateUserUseCase implements ICreateUserUseCase {
    private readonly _userRepository;
    private readonly _hashingService;
    constructor(_userRepository: IUserRepository, _hashingService: IHashingService);
    execute(dto: CreateUserRequestDto): Promise<User>;
}
//# sourceMappingURL=create.user.use-case.d.ts.map