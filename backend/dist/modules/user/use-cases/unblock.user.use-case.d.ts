import type { IUnblockUserUseCase } from "./interfaces/unblock.user.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
export declare class UnblockUserUseCase implements IUnblockUserUseCase {
    private readonly _userRepository;
    constructor(_userRepository: IUserRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=unblock.user.use-case.d.ts.map