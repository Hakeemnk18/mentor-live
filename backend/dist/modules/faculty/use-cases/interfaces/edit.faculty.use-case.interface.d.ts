import type { EditFacultyRequestDto } from "../../dtos/edit.faculty.dto.js";
export interface IEditFacultyUseCase {
    execute(id: string, dto: EditFacultyRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.faculty.use-case.interface.d.ts.map