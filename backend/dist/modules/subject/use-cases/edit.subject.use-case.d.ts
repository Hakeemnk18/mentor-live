import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import type { IEditSubjectUseCase } from "./interfaces/edit.subject.use-case.interface.js";
export declare class EditSubjectUseCase implements IEditSubjectUseCase {
    private readonly _subjectRepository;
    constructor(_subjectRepository: ISubjectRepository);
    execute(id: string, name: string): Promise<void>;
}
//# sourceMappingURL=edit.subject.use-case.d.ts.map