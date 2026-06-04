import type { AddSlotRequestDto } from "../dtos/add.slot.dto.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IFacultyAddSlotUseCase } from "./interfaces/faculty.add.slot.use-case.interface.js";
export declare class FacultyAddSlotUseCase implements IFacultyAddSlotUseCase {
    private readonly _facultyRepository;
    constructor(_facultyRepository: IFacultyRepository);
    execute(facultyId: string, dto: AddSlotRequestDto): Promise<void>;
}
//# sourceMappingURL=faculty.add.slot.use-case.interface.d.ts.map