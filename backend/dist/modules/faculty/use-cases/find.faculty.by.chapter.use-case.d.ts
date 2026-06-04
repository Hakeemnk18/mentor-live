import type { GetAllFacultyBYChapterDto } from "../dtos/find.by.chapter.dto.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { FacultyViewForUser } from "../types/faculty.type.js";
import type { IFindFacultyByChapterUseCase } from "./interfaces/find.faculty.by.chapter.use-case.interface.js";
export declare class FindFacultyByChapterUseCase implements IFindFacultyByChapterUseCase {
    private readonly _facultyRepository;
    constructor(_facultyRepository: IFacultyRepository);
    execute(dto: GetAllFacultyBYChapterDto): Promise<FacultyViewForUser[]>;
}
//# sourceMappingURL=find.faculty.by.chapter.use-case.d.ts.map