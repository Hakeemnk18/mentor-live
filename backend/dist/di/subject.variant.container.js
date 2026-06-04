import { container } from "tsyringe";
import { SubjectVariantRepository } from "../modules/subject-variant/repositories/subject.variant.repository.js";
import { AddSubjectVariantUseCase } from "../modules/subject-variant/use-cases/add.subject.variant.use-case.js";
import { DeleteSubjectVariantUseCase } from "../modules/subject-variant/use-cases/delete.subject.variant.use-case.js";
import { FindSubjectVariantWithSubjectUseCase } from "../modules/subject-variant/use-cases/find.subject.vatiant.with.subject.use-case.js";
export const registerSubjectVariantDependencies = () => {
    container.register("ISubjectVariantRepository", {
        useClass: SubjectVariantRepository,
    });
    container.register("IAddSubjectVariantUseCase", {
        useClass: AddSubjectVariantUseCase,
    });
    container.register("IDeleteSubjectVariantUseCase", {
        useClass: DeleteSubjectVariantUseCase,
    });
    container.register("IFindSubjectVariantWithSubjectUseCase", {
        useClass: FindSubjectVariantWithSubjectUseCase,
    });
};
//# sourceMappingURL=subject.variant.container.js.map