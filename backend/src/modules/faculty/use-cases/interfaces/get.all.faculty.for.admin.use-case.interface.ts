import type { FindByClassSyllabusQueryDto } from "../../../../core/shared/dtos/get.by.class.and.subject.dto.js";
import type { FacultyView } from "../../types/faculty.type.js";

export interface IGetAllFacultyForAdminUseCase {
    execute(dto : FindByClassSyllabusQueryDto ):Promise<{ data: FacultyView[], total: number}>
}