import { container } from "tsyringe";

import type { IClassRepository } from "../modules/class/repositories/class.repository.interface.js";
import { ClassRepository } from "../modules/class/repositories/class.repository.js";

import type { ICreateClassUseCase } from "../modules/class/use-cases/interfaces/create.class.use-case.interface.js";
import { CreateClassUseCase } from "../modules/class/use-cases/create.class.use-case.js";

import type { IEditClassUseCase } from "../modules/class/use-cases/interfaces/edit.class.use-case.interface.js";
import { EditClassUseCase } from "../modules/class/use-cases/edit.class.use-case.js";
import type { IGetClassesForUserUseCase } from "../modules/class/use-cases/interfaces/get.all.for.user.use-case.interface.js";
import { GetClassesForUserUseCase } from "../modules/class/use-cases/get.all.for.user.use-case.js";
import type { IGetClassesForAdminUseCase } from "../modules/class/use-cases/interfaces/get.all.for.admin.use-case.interface.js";
import { GetClassesForAdminUseCase } from "../modules/class/use-cases/get.all.for.admin.use-case.js";



export const registerClassDependencies = () => {
  container.register<IClassRepository>("IClassRepository", {
    useClass: ClassRepository,
  });

  container.register<ICreateClassUseCase>("ICreateClassUseCase", {
    useClass: CreateClassUseCase,
  });

  container.register<IEditClassUseCase>("IEditClassUseCase", {
    useClass: EditClassUseCase,
  });

  container.register<IGetClassesForUserUseCase>("IGetClassesForUserUseCase", {
    useClass: GetClassesForUserUseCase,
  });

  container.register<IGetClassesForAdminUseCase>("IGetClassesForAdminUseCase", {
    useClass: GetClassesForAdminUseCase,
  });
};
