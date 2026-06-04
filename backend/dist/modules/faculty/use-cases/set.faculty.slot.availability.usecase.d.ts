import type { ISetFacultySlotAvailabilityUseCase } from "./interfaces/set.faculty.slot.availability.usecase.interface.js";
import type { SetSlotAvailabilityDto } from "../types/faculty.type.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
export declare class SetFacultySlotAvailabilityUseCase implements ISetFacultySlotAvailabilityUseCase {
    private readonly _facultyRepository;
    constructor(_facultyRepository: IFacultyRepository);
    execute(dto: SetSlotAvailabilityDto): Promise<void>;
}
//# sourceMappingURL=set.faculty.slot.availability.usecase.d.ts.map