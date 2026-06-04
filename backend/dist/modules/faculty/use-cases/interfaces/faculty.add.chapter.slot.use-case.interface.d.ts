import type { AddChapterSlotRequestDto } from "../../dtos/add.chapter.dto.js";
export interface IFacultyAddChapterSlotUseCase {
    execute(facultyId: string, dto: AddChapterSlotRequestDto): Promise<void>;
}
//# sourceMappingURL=faculty.add.chapter.slot.use-case.interface.d.ts.map