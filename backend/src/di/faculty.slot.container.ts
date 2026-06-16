import { container } from "tsyringe";
import type { IFacultySlotRepository } from "../modules/faculty-slot/repository/faculty.slot.repository.interface.js";
import { FacultySlotRepository } from "../modules/faculty-slot/repository/faculty.slot.repository.js";

export const registerFacultySlotDependencies = () => {
  container.register<IFacultySlotRepository>("IFacultySlotRepository", {
    useClass: FacultySlotRepository,
  });
};
