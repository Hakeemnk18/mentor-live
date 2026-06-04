import type { FacultyDetailsViewForUser } from "../../types/faculty.type.js";
export interface IGetFacultyDetailsBySlotUseCase {
    execute(facultyId: string, variantId?: string): Promise<FacultyDetailsViewForUser>;
}
//# sourceMappingURL=get.faculty.details.by.slot.use-case.interface.d.ts.map