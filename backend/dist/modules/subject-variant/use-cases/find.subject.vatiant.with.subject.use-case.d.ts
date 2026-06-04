import type { ISubjectVariantRepository } from "../repositories/subject.variant.repository.interface.js";
import type { IFindSubjectVariantWithSubjectUseCase } from "./interfaces/find.subject.variant.with.subject.use-case.interface.js";
import type { SubjectVariantViewOnlyWithSubject } from "../type/subject.variant.type.js";
import type { GetSubjectVariantsByClassAndSyllabusQueryDto } from "../dtos/get.all.variant.with.subject.dto.js";
export declare class FindSubjectVariantWithSubjectUseCase implements IFindSubjectVariantWithSubjectUseCase {
    private readonly _subjectVariantRepository;
    constructor(_subjectVariantRepository: ISubjectVariantRepository);
    execute(dto: GetSubjectVariantsByClassAndSyllabusQueryDto): Promise<SubjectVariantViewOnlyWithSubject[]>;
}
//# sourceMappingURL=find.subject.vatiant.with.subject.use-case.d.ts.map