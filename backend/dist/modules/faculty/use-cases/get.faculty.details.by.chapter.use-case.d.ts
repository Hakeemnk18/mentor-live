import type { IGetFacultyDetailsByChapterUseCase } from "./interfaces/get.faculty.details.by.chapter.use-case.interface.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { FacultyDetailsViewForUser } from "../types/faculty.type.js";
export declare class GetFacultyDetailsByChapterUseCase implements IGetFacultyDetailsByChapterUseCase {
    private readonly _facultyRepository;
    constructor(_facultyRepository: IFacultyRepository);
    execute(facultyId: string, chapterId: string): Promise<FacultyDetailsViewForUser>;
}
//# sourceMappingURL=get.faculty.details.by.chapter.use-case.d.ts.map