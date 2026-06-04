import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { IDeleteSubjectVariantUseCase } from "./interfaces/delete.subject.variant.use-case.interface.js";
export declare class DeleteSubjectVariantUseCase implements IDeleteSubjectVariantUseCase {
    private readonly _subjectVariantRepository;
    constructor(_subjectVariantRepository: ISubjectVariantRepository);
    execute(subjectId: string, variantId: string): Promise<void>;
}
//# sourceMappingURL=delete.subject.variant.use-case.d.ts.map