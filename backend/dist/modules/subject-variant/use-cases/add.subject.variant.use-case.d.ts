import type { ISubjectVariantRepository } from "../repositories/subject.variant.repository.interface.js";
import type { IAddSubjectVariantUseCase } from "./interfaces/add.subject.variant.use-case.interface.js";
import type { AddSubjectVariantRequestDto } from "../dtos/add.subject.variant.dto.js";
import type { ISubjectRepository } from "../../subject/repositories/subject.repository.interface.js";
import type { IClassRepository } from "../../class/repositories/class.repository.interface.js";
import type { ISyllabusRepository } from "../../syllabus/repositories/syllabus.repository.interface.js";
export declare class AddSubjectVariantUseCase implements IAddSubjectVariantUseCase {
    private readonly _subjectVariantRepository;
    private readonly _subjectRepository;
    private readonly _classRepository;
    private readonly _syllabusRepository;
    constructor(_subjectVariantRepository: ISubjectVariantRepository, _subjectRepository: ISubjectRepository, _classRepository: IClassRepository, _syllabusRepository: ISyllabusRepository);
    execute(subjectId: string, dto: AddSubjectVariantRequestDto): Promise<void>;
}
//# sourceMappingURL=add.subject.variant.use-case.d.ts.map