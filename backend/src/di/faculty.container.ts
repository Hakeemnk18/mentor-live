import { container } from "tsyringe";
import type { IFacultyRepository } from "../modules/faculty/repository/faculty.repository.interface.js";
import { FacultyRepository } from "../modules/faculty/repository/faculty.repository.js";
import type { ICreateFacultyUseCase } from "../modules/faculty/use-cases/interfaces/create.faculty.use-case.interface.js";
import { CreateFacultyUseCase } from "../modules/faculty/use-cases/create.faculty.use-case.js";

export const registerFacultyDependencies = () => {
  container.register<IFacultyRepository>("IFacultyRepository", {
    useClass: FacultyRepository,
  });

  container.register<ICreateFacultyUseCase>("ICreateFacultyUseCase", {
    useClass: CreateFacultyUseCase,
  });

};