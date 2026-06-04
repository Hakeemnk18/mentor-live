import type { CreateClassRequestDto } from "../dtos/class.create.dto.js";
import type { IClassRepository } from "../repositories/class.repository.interface.js";
import type { IEditClassUseCase } from "./interfaces/edit.class.use-case.interface.js";
export declare class EditClassUseCase implements IEditClassUseCase {
    private readonly _classRepository;
    constructor(_classRepository: IClassRepository);
    execute(id: string, dto: CreateClassRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.class.use-case.d.ts.map