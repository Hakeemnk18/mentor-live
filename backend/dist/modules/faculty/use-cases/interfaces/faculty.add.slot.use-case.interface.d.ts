import type { AddSlotRequestDto } from "../../dtos/add.slot.dto.js";
export interface IFacultyAddSlotUseCase {
    execute(facultyId: string, dto: AddSlotRequestDto): Promise<void>;
}
//# sourceMappingURL=faculty.add.slot.use-case.interface.d.ts.map