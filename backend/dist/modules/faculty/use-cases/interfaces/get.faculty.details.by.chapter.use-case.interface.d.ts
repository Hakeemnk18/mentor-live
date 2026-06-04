import type { FacultyDetailsViewForUser } from "../../types/faculty.type.js";
export interface IGetFacultyDetailsByChapterUseCase {
    execute(facultyId: string, chapterId: string): Promise<FacultyDetailsViewForUser>;
}
//# sourceMappingURL=get.faculty.details.by.chapter.use-case.interface.d.ts.map