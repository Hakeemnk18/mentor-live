import type { FacultyDetailsViewForUser } from "../../types/faculty.type.js";

export interface IGetFacultyDetailsBySlotUseCase {
    execute(facultyId: string): Promise<FacultyDetailsViewForUser>
}