import type { CreateClassRequestDto } from "../../dtos/class.create.dto.js";
export interface IEditClassUseCase {
    execute(id: string, dto: CreateClassRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.class.use-case.interface.d.ts.map