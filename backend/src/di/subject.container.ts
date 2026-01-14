import { container } from "tsyringe";
import type { ISubjectRepository } from "../modules/subject/repositories/subject.repository.interface.js";
import { SubjectRepository } from "../modules/subject/repositories/subject.repository.js";
import type { ICreateSubjectUseCase } from "../modules/subject/use-cases/interfaces/create.subject.use-case.interface.js";
import { CreateSubjectUseCase } from "../modules/subject/use-cases/create.subject.use-case.js";
import type { IEditSubjectUseCase } from "../modules/subject/use-cases/interfaces/edit.subject.use-case.interface.js";
import { EditSubjectUseCase } from "../modules/subject/use-cases/edit.subject.use-case.js";
import type { IGetSubjectsForAdminUseCase } from "../modules/subject/use-cases/interfaces/get.all.subject.for.admin.use-case.interface.js";
import { GetSubjectsForAdminUseCase } from "../modules/subject/use-cases/get.all.subject.for.admin.use-case.js";
import type { IGetSubjectDetailsUseCase } from "../modules/subject/use-cases/interfaces/get.subject.details.use-case.interface.js";
import { GetSubjectDetailsUseCase } from "../modules/subject/use-cases/get.subject.details.use-case.js";

export const registerSubjectDependencies = () => {
  container.register<ISubjectRepository>("ISubjectRepository", {
    useClass: SubjectRepository,
  });

  container.register<ICreateSubjectUseCase>("ICreateSubjectUseCase", {
    useClass: CreateSubjectUseCase,
  });

  container.register<IEditSubjectUseCase>("IEditSubjectUseCase", {
    useClass: EditSubjectUseCase,
  });

  container.register<IGetSubjectsForAdminUseCase>("IGetSubjectsForAdminUseCase", {
    useClass: GetSubjectsForAdminUseCase,
  });

  container.register<IGetSubjectDetailsUseCase>("IGetSubjectDetailsUseCase", {
    useClass: GetSubjectDetailsUseCase,
  });
};
