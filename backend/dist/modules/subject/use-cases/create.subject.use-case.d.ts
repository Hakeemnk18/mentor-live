import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import type { CreateSubjectRequestDto } from "../dtos/subject.create.dto.js";
import type { ICreateSubjectUseCase } from "./interfaces/create.subject.use-case.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { IClassRepository } from "../../class/repositories/class.repository.interface.js";
import type { ISyllabusRepository } from "../../syllabus/repositories/syllabus.repository.interface.js";
export declare class CreateSubjectUseCase implements ICreateSubjectUseCase {
    private readonly _subjectRepository;
    private readonly _subjectVariantRepository;
    private readonly _classRepository;
    private readonly _syllabusRepository;
    constructor(_subjectRepository: ISubjectRepository, _subjectVariantRepository: ISubjectVariantRepository, _classRepository: IClassRepository, _syllabusRepository: ISyllabusRepository);
    execute(dto: CreateSubjectRequestDto): Promise<void>;
}
//# sourceMappingURL=create.subject.use-case.d.ts.map