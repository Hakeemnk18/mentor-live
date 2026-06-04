import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllForAdminStudentUseCase } from "./interfaces/get.all.for.admin.use-case.interface.js";
import type { IStudentRepository } from "../repositories/student.repository.interface.js";
import type { Student } from "../entities/student.entity.js";
export declare class GetAllForAdminStudentUseCase implements IGetAllForAdminStudentUseCase {
    private readonly _studentRepository;
    constructor(_studentRepository: IStudentRepository);
    execute(dto: GetAllQueryDto): Promise<{
        data: Student[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.for.admin.use-case.d.ts.map