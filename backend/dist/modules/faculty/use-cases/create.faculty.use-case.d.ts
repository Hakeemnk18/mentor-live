import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { CreateFacultyRequestDto } from "../dtos/create.faculty.dto.js";
import type { ICreateFacultyUseCase } from "./interfaces/create.faculty.use-case.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";
export declare class CreateFacultyUseCase implements ICreateFacultyUseCase {
    private readonly _facultyRepository;
    private readonly _subjectVariantRepository;
    private readonly _chapterRepository;
    constructor(_facultyRepository: IFacultyRepository, _subjectVariantRepository: ISubjectVariantRepository, _chapterRepository: IChapterRepository);
    execute(dto: CreateFacultyRequestDto): Promise<void>;
}
//# sourceMappingURL=create.faculty.use-case.d.ts.map