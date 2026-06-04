import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import type { ISubjectVariantRepository } from "../../../modules/subject-variant/repositories/subject.variant.repository.interface.js";
import type { IGetSubjectDetailsUseCase } from "./interfaces/get.subject.details.use-case.interface.js";
import type { SubjectDetailsView } from "../type/subject.type.js";
export declare class GetSubjectDetailsUseCase implements IGetSubjectDetailsUseCase {
    private readonly _subjectRepository;
    private readonly _subjectVariantRepository;
    constructor(_subjectRepository: ISubjectRepository, _subjectVariantRepository: ISubjectVariantRepository);
    execute(subjectId: string): Promise<SubjectDetailsView>;
}
//# sourceMappingURL=get.subject.details.use-case.d.ts.map