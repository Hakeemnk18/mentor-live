import type { CreateSyllabusRequestDto } from "../../dtos/syllabus.create.dto.js";
export interface ICreateSyllabusUseCase {
    execute(dto: CreateSyllabusRequestDto): Promise<void>;
}
//# sourceMappingURL=create.syllabus.interface.d.ts.map