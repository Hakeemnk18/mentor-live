import type { IStudentRepository } from "../repositories/student.repository.interface.js";
import type { IBlockStudentUseCase } from "./interfaces/block.student.interface.js";
export declare class BlockStudentUseCase implements IBlockStudentUseCase {
    private readonly _studentRepository;
    constructor(_studentRepository: IStudentRepository);
    execute(studentId: string): Promise<void>;
}
//# sourceMappingURL=block.student.use-case.d.ts.map