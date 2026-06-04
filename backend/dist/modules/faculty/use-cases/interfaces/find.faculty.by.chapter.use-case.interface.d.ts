import type { GetAllFacultyBYChapterDto } from "../../dtos/find.by.chapter.dto.js";
import type { FacultyViewForUser } from "../../types/faculty.type.js";
export interface IFindFacultyByChapterUseCase {
    execute(dto: GetAllFacultyBYChapterDto): Promise<FacultyViewForUser[]>;
}
//# sourceMappingURL=find.faculty.by.chapter.use-case.interface.d.ts.map