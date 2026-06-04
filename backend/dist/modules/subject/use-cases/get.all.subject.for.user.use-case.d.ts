import type { IGetAllSubjectForUserUseCase } from "./interfaces/get.all.subject.for.user.use-case.interface.js";
import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
export declare class GetAllSubjectForUserUseCase implements IGetAllSubjectForUserUseCase {
    private readonly _subjectRepository;
    constructor(_subjectRepository: ISubjectRepository);
    execute(): Promise<{
        id: string;
        name: string;
    }[]>;
}
//# sourceMappingURL=get.all.subject.for.user.use-case.d.ts.map