import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";
import type { CreateSyllabusRequestDto } from "../dtos/syllabus.create.dto.js";
import type { ICreateSyllabusUseCase } from "./interfaces/create.syllabus.interface.js";
export declare class CreateSyllabusUseCase implements ICreateSyllabusUseCase {
    private readonly _syllabusRepository;
    constructor(_syllabusRepository: ISyllabusRepository);
    execute(dto: CreateSyllabusRequestDto): Promise<void>;
}
//# sourceMappingURL=create.syllabus.use-case.d.ts.map