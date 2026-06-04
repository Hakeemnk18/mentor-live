import type { GetAllQueryDto } from "../../../../core/shared/dtos/get.all.doc.dto.js";
import type { Student } from "../../entities/student.entity.js";
export interface IGetAllForAdminStudentUseCase {
    execute(dto: GetAllQueryDto): Promise<{
        data: Student[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.for.admin.use-case.interface.d.ts.map