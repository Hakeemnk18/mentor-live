import type { GetAllFacultyBYClassAndSyllabusDto } from "../../dtos/find.by.class.and.syllbus.dto.js";
import type { FacultyViewForUser } from "../../types/faculty.type.js";
export interface IFindFacultyByClassAndSyllabusUseCaseUseCase {
    execute(dto: GetAllFacultyBYClassAndSyllabusDto): Promise<FacultyViewForUser[]>;
}
//# sourceMappingURL=find.faculty.by.class.and.syllabus.use-case.interface.d.ts.map