import type { IClassRepository } from "../repositories/class.repository.interface.js";
import type { IGetClassesForUserUseCase } from "./interfaces/get.all.for.user.use-case.interface.js";
export declare class GetClassesForUserUseCase implements IGetClassesForUserUseCase {
    private readonly _classRepository;
    constructor(_classRepository: IClassRepository);
    execute(): Promise<{
        id: string;
        name: string;
    }[]>;
}
//# sourceMappingURL=get.all.for.user.use-case.d.ts.map