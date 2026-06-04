import type { GetAllQueryDto } from "../../../../core/shared/dtos/get.all.doc.dto.js";
import type { Syllabus } from "../../entities/syllabus.entity.js";
export interface IGetSyllabusesForAdminUseCase {
    execute(dto: GetAllQueryDto): Promise<{
        data: Syllabus[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.for.admin.interface.d.ts.map