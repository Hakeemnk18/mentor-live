import { container } from "tsyringe";
import type { ISubjectRepository } from "../modules/subject/repositories/subject.repository.interface.js";
import { SubjectRepository } from "../modules/subject/repositories/subject.repository.js";
import type { ICreateSubjectUseCase } from "../modules/subject/use-cases/interfaces/create.subject.use-case.interface.js";
import { CreateSubjectUseCase } from "../modules/subject/use-cases/create.subject.use-case.js";

export const registerSubjectDependencies = () => {
  container.register<ISubjectRepository>("ISubjectRepository", {
    useClass: SubjectRepository,
  });

  container.register<ICreateSubjectUseCase>("ICreateSubjectUseCase", {
    useClass: CreateSubjectUseCase,
  });
};
