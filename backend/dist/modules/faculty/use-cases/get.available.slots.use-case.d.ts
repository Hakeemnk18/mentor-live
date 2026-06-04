import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { AvailableSlots } from "../types/faculty.type.js";
import type { IGetAvailableSlotsUseCase } from "./interfaces/get.available.slots.use-case.interface.js";
export declare class GetAvailableSlotsUseCase implements IGetAvailableSlotsUseCase {
    private readonly _facultyRepository;
    constructor(_facultyRepository: IFacultyRepository);
    execute(facultyId: string): Promise<AvailableSlots[]>;
}
//# sourceMappingURL=get.available.slots.use-case.d.ts.map