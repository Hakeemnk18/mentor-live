import type { FacultyFullAdminView } from "../../types/faculty.type.js";
export interface IGetFacultyDetailsUseCase {
    execute(facultyId: string): Promise<FacultyFullAdminView>;
}
//# sourceMappingURL=get.faculty.details.use-case.interface.d.ts.map