import type { EditFacultyRequestDto } from "../../dtos/edit.faculty.dto.js";

export interface IEditFacultyUseCase {
    execute(id: string , dto: EditFacultyRequestDto): Promise<void>;
}