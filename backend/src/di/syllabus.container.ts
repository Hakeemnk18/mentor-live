import { container } from "tsyringe";

import type { ISyllabusRepository } from "../modules/syllabus/repositories/syllabus.repository.interface.js";
import { SyllabusRepository } from "../modules/syllabus/repositories/syllabus.repository.js";

import { CreateSyllabusUseCase } from "../modules/syllabus/use-cases/create.syllabus.use-case.js";

import { EditSyllabusUseCase } from "../modules/syllabus/use-cases/edit.syllabus.use-case.js";

import { GetSyllabusesForUserUseCase } from "../modules/syllabus/use-cases/get.all.for.user.use-case.js";

import { GetSyllabusesForAdminUseCase } from "../modules/syllabus/use-cases/get.all.for.admin.use-case.js";
import type { ICreateSyllabusUseCase } from "../modules/syllabus/use-cases/interfaces/create.syllabus.interface.js";
import type { IEditSyllabusUseCase } from "../modules/syllabus/use-cases/interfaces/edit.syllabus.interface.js";
import type { IGetSyllabusesForUserUseCase } from "../modules/syllabus/use-cases/interfaces/get.all.for.user.interface.js";
import type { IGetSyllabusesForAdminUseCase } from "../modules/syllabus/use-cases/interfaces/get.all.for.admin.interface.js";

export const registerSyllabusDependencies = () => {
  container.register<ISyllabusRepository>("ISyllabusRepository", {
    useClass: SyllabusRepository,
  });

  container.register<ICreateSyllabusUseCase>("ICreateSyllabusUseCase", {
    useClass: CreateSyllabusUseCase,
  });

  container.register<IEditSyllabusUseCase>("IEditSyllabusUseCase", {
    useClass: EditSyllabusUseCase,
  });

  container.register<IGetSyllabusesForUserUseCase>("IGetSyllabusesForUserUseCase", {
    useClass: GetSyllabusesForUserUseCase,
  });

  container.register<IGetSyllabusesForAdminUseCase>("IGetSyllabusesForAdminUseCase", {
    useClass: GetSyllabusesForAdminUseCase,
  });
};
