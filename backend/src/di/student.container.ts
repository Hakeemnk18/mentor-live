import { container } from "tsyringe";
import type { IStudentRepository } from "../modules/student/repositories/student.repository.interface.js";
import { StudentRepository } from "../modules/student/repositories/student.repository.js";
import type { IGetAllForAdminStudentUseCase } from "../modules/student/use-cases/interfaces/get.all.for.admin.use-case.interface.js";
import { GetAllForAdminStudentUseCase } from "../modules/student/use-cases/get.all.for.admin.use-case.js";
import type { IBlockStudentUseCase } from "../modules/student/use-cases/interfaces/block.student.interface.js";
import { BlockStudentUseCase } from "../modules/student/use-cases/block.student.use-case.js";
import type { IUnblockStudentUseCase } from "../modules/student/use-cases/interfaces/unblock.student.interface.js";
import { UnblockStudentUseCase } from "../modules/student/use-cases/unblock.student.use-case.js";

export const registerStudentDependencies = () => {
  
    container.register<IStudentRepository>("IStudentRepository", {
        useClass: StudentRepository,
    });

    container.register<IGetAllForAdminStudentUseCase>("IGetAllForAdminStudentUseCase", {
        useClass: GetAllForAdminStudentUseCase,
    });
    container.register<IBlockStudentUseCase>("IBlockStudentUseCase", {
        useClass: BlockStudentUseCase,
    });
    container.register<IUnblockStudentUseCase>("IUnblockStudentUseCase", {
        useClass: UnblockStudentUseCase,
    });

};