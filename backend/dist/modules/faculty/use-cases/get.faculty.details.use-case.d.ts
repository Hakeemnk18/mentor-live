import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IGetFacultyDetailsUseCase } from "./interfaces/get.faculty.details.use-case.interface.js";
import type { FacultyFullAdminView } from "../types/faculty.type.js";
export declare class GetFacultyDetailsUseCase implements IGetFacultyDetailsUseCase {
    private readonly facultyRepo;
    constructor(facultyRepo: IFacultyRepository);
    execute(facultyId: string): Promise<FacultyFullAdminView>;
}
//# sourceMappingURL=get.faculty.details.use-case.d.ts.map