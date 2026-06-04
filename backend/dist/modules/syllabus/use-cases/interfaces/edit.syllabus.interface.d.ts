import type { CreateClassRequestDto } from "../../../class/dtos/class.create.dto.js";
export interface IEditSyllabusUseCase {
    execute(id: string, dto: CreateClassRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.syllabus.interface.d.ts.map