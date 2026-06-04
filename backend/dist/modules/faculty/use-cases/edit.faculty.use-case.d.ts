import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IEditFacultyUseCase } from "./interfaces/edit.faculty.use-case.interface.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { EditFacultyRequestDto } from "../dtos/edit.faculty.dto.js";
export declare class EditFacultyUseCase implements IEditFacultyUseCase {
    private readonly _facultyRepository;
    private readonly _subjectVariantRepository;
    private readonly _chapterRepository;
    constructor(_facultyRepository: IFacultyRepository, _subjectVariantRepository: ISubjectVariantRepository, _chapterRepository: IChapterRepository);
    execute(id: string, dto: EditFacultyRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.faculty.use-case.d.ts.map