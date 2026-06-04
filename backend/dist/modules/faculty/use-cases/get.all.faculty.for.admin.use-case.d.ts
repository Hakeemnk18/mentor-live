import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IGetAllFacultyForAdminUseCase } from "./interfaces/get.all.faculty.for.admin.use-case.interface.js";
import type { FindByClassSyllabusQueryDto } from "../../../core/shared/dtos/get.by.class.and.subject.dto.js";
import type { FacultyView } from "../types/faculty.type.js";
export declare class GetAllFacultyForAdminUseCase implements IGetAllFacultyForAdminUseCase {
    private _facultyRepository;
    constructor(_facultyRepository: IFacultyRepository);
    execute(dto: FindByClassSyllabusQueryDto): Promise<{
        data: FacultyView[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.faculty.for.admin.use-case.d.ts.map