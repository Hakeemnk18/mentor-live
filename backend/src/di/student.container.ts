import { container } from "tsyringe";
import type { IStudentRepository } from "../modules/student/repositories/student.repository.interface.js";
import { StudentRepository } from "../modules/student/repositories/student.repository.js";

export const registerStudentDependencies = () => {
  
    container.register<IStudentRepository>("IStudentRepository", {
        useClass: StudentRepository,
    });

};