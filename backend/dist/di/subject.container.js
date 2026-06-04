import { container } from "tsyringe";
import { SubjectRepository } from "../modules/subject/repositories/subject.repository.js";
import { CreateSubjectUseCase } from "../modules/subject/use-cases/create.subject.use-case.js";
import { EditSubjectUseCase } from "../modules/subject/use-cases/edit.subject.use-case.js";
import { GetSubjectsForAdminUseCase } from "../modules/subject/use-cases/get.all.subject.for.admin.use-case.js";
import { GetSubjectDetailsUseCase } from "../modules/subject/use-cases/get.subject.details.use-case.js";
import { GetAllSubjectForUserUseCase } from "../modules/subject/use-cases/get.all.subject.for.user.use-case.js";
export const registerSubjectDependencies = () => {
    container.register("ISubjectRepository", {
        useClass: SubjectRepository,
    });
    container.register("ICreateSubjectUseCase", {
        useClass: CreateSubjectUseCase,
    });
    container.register("IEditSubjectUseCase", {
        useClass: EditSubjectUseCase,
    });
    container.register("IGetSubjectsForAdminUseCase", {
        useClass: GetSubjectsForAdminUseCase,
    });
    container.register("IGetSubjectDetailsUseCase", {
        useClass: GetSubjectDetailsUseCase,
    });
    container.register("IGetAllSubjectForUserUseCase", {
        useClass: GetAllSubjectForUserUseCase,
    });
};
//# sourceMappingURL=subject.container.js.map