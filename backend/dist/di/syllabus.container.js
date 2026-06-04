import { container } from "tsyringe";
import { SyllabusRepository } from "../modules/syllabus/repositories/syllabus.repository.js";
import { CreateSyllabusUseCase } from "../modules/syllabus/use-cases/create.syllabus.use-case.js";
import { EditSyllabusUseCase } from "../modules/syllabus/use-cases/edit.syllabus.use-case.js";
import { GetSyllabusesForUserUseCase } from "../modules/syllabus/use-cases/get.all.for.user.use-case.js";
import { GetSyllabusesForAdminUseCase } from "../modules/syllabus/use-cases/get.all.for.admin.use-case.js";
export const registerSyllabusDependencies = () => {
    container.register("ISyllabusRepository", {
        useClass: SyllabusRepository,
    });
    container.register("ICreateSyllabusUseCase", {
        useClass: CreateSyllabusUseCase,
    });
    container.register("IEditSyllabusUseCase", {
        useClass: EditSyllabusUseCase,
    });
    container.register("IGetSyllabusesForUserUseCase", {
        useClass: GetSyllabusesForUserUseCase,
    });
    container.register("IGetSyllabusesForAdminUseCase", {
        useClass: GetSyllabusesForAdminUseCase,
    });
};
//# sourceMappingURL=syllabus.container.js.map