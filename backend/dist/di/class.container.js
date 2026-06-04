import { container } from "tsyringe";
import { ClassRepository } from "../modules/class/repositories/class.repository.js";
import { CreateClassUseCase } from "../modules/class/use-cases/create.class.use-case.js";
import { EditClassUseCase } from "../modules/class/use-cases/edit.class.use-case.js";
import { GetClassesForUserUseCase } from "../modules/class/use-cases/get.all.for.user.use-case.js";
import { GetClassesForAdminUseCase } from "../modules/class/use-cases/get.all.for.admin.use-case.js";
export const registerClassDependencies = () => {
    container.register("IClassRepository", {
        useClass: ClassRepository,
    });
    container.register("ICreateClassUseCase", {
        useClass: CreateClassUseCase,
    });
    container.register("IEditClassUseCase", {
        useClass: EditClassUseCase,
    });
    container.register("IGetClassesForUserUseCase", {
        useClass: GetClassesForUserUseCase,
    });
    container.register("IGetClassesForAdminUseCase", {
        useClass: GetClassesForAdminUseCase,
    });
};
//# sourceMappingURL=class.container.js.map