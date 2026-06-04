import { container } from "tsyringe";
import { StudentRepository } from "../modules/student/repositories/student.repository.js";
import { GetAllForAdminStudentUseCase } from "../modules/student/use-cases/get.all.for.admin.use-case.js";
import { BlockStudentUseCase } from "../modules/student/use-cases/block.student.use-case.js";
import { UnblockStudentUseCase } from "../modules/student/use-cases/unblock.student.use-case.js";
export const registerStudentDependencies = () => {
    container.register("IStudentRepository", {
        useClass: StudentRepository,
    });
    container.register("IGetAllForAdminStudentUseCase", {
        useClass: GetAllForAdminStudentUseCase,
    });
    container.register("IBlockStudentUseCase", {
        useClass: BlockStudentUseCase,
    });
    container.register("IUnblockStudentUseCase", {
        useClass: UnblockStudentUseCase,
    });
};
//# sourceMappingURL=student.container.js.map