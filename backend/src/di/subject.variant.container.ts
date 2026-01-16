import { container } from "tsyringe";
import type { ISubjectVariantRepository } from "../modules/subject-variant/repositories/subject.variant.repository.interface.js";
import { SubjectVariantRepository } from "../modules/subject-variant/repositories/subject.variant.repository.js";
import type { IAddSubjectVariantUseCase } from "../modules/subject-variant/use-cases/interfaces/add.subject.variant.use-case.interface.js";
import { AddSubjectVariantUseCase } from "../modules/subject-variant/use-cases/add.subject.variant.use-case.js";
import type { IDeleteSubjectVariantUseCase } from "../modules/subject-variant/use-cases/interfaces/delete.subject.variant.use-case.interface.js";
import { DeleteSubjectVariantUseCase } from "../modules/subject-variant/use-cases/delete.subject.variant.use-case.js";
import type { IFindSubjectVariantWithSubjectUseCase } from "../modules/subject-variant/use-cases/interfaces/find.subject.variant.with.subject.use-case.interface.js";
import { FindSubjectVariantWithSubjectUseCase } from "../modules/subject-variant/use-cases/find.subject.vatiant.with.subject.use-case.js";

export const registerSubjectVariantDependencies = () => {
  container.register<ISubjectVariantRepository>("ISubjectVariantRepository", {
    useClass: SubjectVariantRepository,
  });

  container.register<IAddSubjectVariantUseCase>("IAddSubjectVariantUseCase", {
    useClass: AddSubjectVariantUseCase,
  });

  container.register<IDeleteSubjectVariantUseCase>("IDeleteSubjectVariantUseCase", {
    useClass: DeleteSubjectVariantUseCase,
  });

  container.register<IFindSubjectVariantWithSubjectUseCase>("IFindSubjectVariantWithSubjectUseCase", {
    useClass: FindSubjectVariantWithSubjectUseCase,
  });

  
};