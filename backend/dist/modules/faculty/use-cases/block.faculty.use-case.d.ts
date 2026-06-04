import type { IBlockFacultyUseCase } from "./interfaces/block.faculty.use-case.interface.js";
import type { IFacultyRepository } from "../repository/faculty.repository.interface.js";
export declare class BlockFacultyUseCase implements IBlockFacultyUseCase {
    private readonly _facultyRepository;
    constructor(_facultyRepository: IFacultyRepository);
    execute(facultyId: string): Promise<void>;
}
//# sourceMappingURL=block.faculty.use-case.d.ts.map