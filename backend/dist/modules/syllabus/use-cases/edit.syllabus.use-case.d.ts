import type { CreateSyllabusRequestDto } from "../dtos/syllabus.create.dto.js";
import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";
import type { IEditSyllabusUseCase } from "./interfaces/edit.syllabus.interface.js";
export declare class EditSyllabusUseCase implements IEditSyllabusUseCase {
    private readonly _syllabusRepository;
    constructor(_syllabusRepository: ISyllabusRepository);
    execute(id: string, dto: CreateSyllabusRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.syllabus.use-case.d.ts.map