import type { IClassRepository } from "../repositories/class.repository.interface.js";
import type { CreateClassRequestDto } from "../dtos/class.create.dto.js";
import type { ICreateClassUseCase } from "./interfaces/create.class.use-case.interface.js";
export declare class CreateClassUseCase implements ICreateClassUseCase {
    private readonly _classRepository;
    constructor(_classRepository: IClassRepository);
    execute(dto: CreateClassRequestDto): Promise<void>;
}
//# sourceMappingURL=create.class.use-case.d.ts.map