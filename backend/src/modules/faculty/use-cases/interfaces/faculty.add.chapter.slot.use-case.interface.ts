import type { AddChapterSlotRequestDto } from "../../dtos/add.chapter.dto.js";

export interface IFacultyAddChapterSlotUseCase {
    execute(facultyId : string, dto: AddChapterSlotRequestDto):Promise<void>
}