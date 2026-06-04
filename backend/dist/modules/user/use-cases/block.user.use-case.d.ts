import type { IBlockUserUseCase } from "./interfaces/block.user.use-case.interface.js";
import type { IUserRepository } from "../repositories/user.repository.interface.js";
export declare class BlockUserUseCase implements IBlockUserUseCase {
    private readonly _userRepository;
    constructor(_userRepository: IUserRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=block.user.use-case.d.ts.map