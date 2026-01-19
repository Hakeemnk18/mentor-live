import { container } from "tsyringe";
import type { IFacultyRepository } from "../modules/faculty/repository/faculty.repository.interface.js";
import { FacultyRepository } from "../modules/faculty/repository/faculty.repository.js";
import type { ICreateFacultyUseCase } from "../modules/faculty/use-cases/interfaces/create.faculty.use-case.interface.js";
import { CreateFacultyUseCase } from "../modules/faculty/use-cases/create.faculty.use-case.js";
import type { IGetAllFacultyForAdminUseCase } from "../modules/faculty/use-cases/interfaces/get.all.faculty.for.admin.use-case.interface.js";
import { GetAllFacultyForAdminUseCase } from "../modules/faculty/use-cases/get.all.faculty.for.admin.use-case.js";
import type { IGetFacultyDetailsUseCase } from "../modules/faculty/use-cases/interfaces/get.faculty.details.use-case.interface.js";
import { GetFacultyDetailsUseCase } from "../modules/faculty/use-cases/get.faculty.details.use-case.js";
import type { IEditFacultyUseCase } from "../modules/faculty/use-cases/interfaces/edit.faculty.use-case.interface.js";
import { EditFacultyUseCase } from "../modules/faculty/use-cases/edit.faculty.use-case.js";
import type { IFacultyAddSlotUseCase } from "../modules/faculty/use-cases/interfaces/faculty.add.slot.use-case.interface.js";
import { FacultyAddSlotUseCase } from "../modules/faculty/use-cases/faculty.add.slot.use-case.interface.js";
import type { IFacultyAddChapterSlotUseCase } from "../modules/faculty/use-cases/interfaces/faculty.add.chapter.slot.use-case.interface.js";
import { FacultyAddChapterSlotUseCase } from "../modules/faculty/use-cases/faculty.add.chapter.slot.use-case.js";

export const registerFacultyDependencies = () => {
  container.register<IFacultyRepository>("IFacultyRepository", {
    useClass: FacultyRepository,
  });

  container.register<ICreateFacultyUseCase>("ICreateFacultyUseCase", {
    useClass: CreateFacultyUseCase,
  });

  container.register<IGetAllFacultyForAdminUseCase>("IGetAllFacultyForAdminUseCase", {
    useClass: GetAllFacultyForAdminUseCase,
  });

  container.register<IGetFacultyDetailsUseCase>("IGetFacultyDetailsUseCase", {
    useClass: GetFacultyDetailsUseCase,
  });

  container.register<IEditFacultyUseCase>("IEditFacultyUseCase", {
    useClass: EditFacultyUseCase,
  });

  container.register<IFacultyAddSlotUseCase>("IFacultyAddSlotUseCase", {
    useClass: FacultyAddSlotUseCase,
  });

  container.register<IFacultyAddChapterSlotUseCase>("IFacultyAddChapterSlotUseCase", {
    useClass: FacultyAddChapterSlotUseCase,
  });
};