import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetSyllabusesForAdminUseCase } from "./interfaces/get.all.for.admin.interface.js";
import type { Syllabus } from "../entities/syllabus.entity.js";
import type { ISyllabusRepository } from "../repositories/syllabus.repository.interface.js";
export declare class GetSyllabusesForAdminUseCase implements IGetSyllabusesForAdminUseCase {
    private readonly _syllabusRepository;
    constructor(_syllabusRepository: ISyllabusRepository);
    execute(dto: GetAllQueryDto): Promise<{
        data: Syllabus[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.for.admin.use-case.d.ts.map