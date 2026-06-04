import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { FacultyDetailsViewForUser } from "../types/faculty.type.js";
import type { IGetFacultyDetailsBySlotUseCase } from "./interfaces/get.faculty.details.by.slot.use-case.interface.js";
export declare class GetFacultyDetailsBySlotUseCase implements IGetFacultyDetailsBySlotUseCase {
    private readonly _facultyRepository;
    constructor(_facultyRepository: IFacultyRepository);
    execute(facultyId: string, variantId?: string): Promise<FacultyDetailsViewForUser>;
}
//# sourceMappingURL=get.faculty.details.by.slot.use-case.d.ts.map