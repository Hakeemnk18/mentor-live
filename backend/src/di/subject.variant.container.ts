import { container } from "tsyringe";
import type { ISubjectVariantRepository } from "../modules/subject-variant/repositories/subject.variant.repository.interface.js";
import { SubjectVariantRepository } from "../modules/subject-variant/repositories/subject.variant.repository.js";

export const registerSubjectVariantDependencies = () => {
  container.register<ISubjectVariantRepository>("ISubjectVariantRepository", {
    useClass: SubjectVariantRepository,
  });
};