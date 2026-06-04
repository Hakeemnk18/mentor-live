import type { AddChapterSlotRequestDto } from "../dtos/add.chapter.dto.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IFacultyAddChapterSlotUseCase } from "./interfaces/faculty.add.chapter.slot.use-case.interface.js";
import type { IChapterRepository } from "../../chapter/repositories/chapter.repository.interface.js";
export declare class FacultyAddChapterSlotUseCase implements IFacultyAddChapterSlotUseCase {
    private readonly _facultyRepository;
    private readonly _chapterRepository;
    constructor(_facultyRepository: IFacultyRepository, _chapterRepository: IChapterRepository);
    execute(facultyId: string, dto: AddChapterSlotRequestDto): Promise<void>;
}
//# sourceMappingURL=faculty.add.chapter.slot.use-case.d.ts.map