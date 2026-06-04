import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
import type { IUnblockFacultyUseCase } from "./interfaces/unblock.faculty.interface.js";
export declare class UnblockFacultyUseCase implements IUnblockFacultyUseCase {
    private readonly _facultyRepository;
    constructor(_facultyRepository: IFacultyRepository);
    execute(facultyId: string): Promise<void>;
}
//# sourceMappingURL=unblock.faculty.d.ts.map