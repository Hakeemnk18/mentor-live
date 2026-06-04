import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import { Subject } from "../entities/subject.entity.js";
import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetSubjectsForAdminUseCase } from "./interfaces/get.all.subject.for.admin.use-case.interface.js";
export declare class GetSubjectsForAdminUseCase implements IGetSubjectsForAdminUseCase {
    private readonly _subjectRepository;
    constructor(_subjectRepository: ISubjectRepository);
    execute(dto: GetAllQueryDto): Promise<{
        data: Subject[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.subject.for.admin.use-case.d.ts.map