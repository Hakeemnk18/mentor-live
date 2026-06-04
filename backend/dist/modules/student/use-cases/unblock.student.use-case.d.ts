import type { IStudentRepository } from "../repositories/student.repository.interface.js";
import type { IUnblockStudentUseCase } from "./interfaces/unblock.student.interface.js";
export declare class UnblockStudentUseCase implements IUnblockStudentUseCase {
    private readonly _studentRepository;
    constructor(_studentRepository: IStudentRepository);
    execute(studentId: string): Promise<void>;
}
//# sourceMappingURL=unblock.student.use-case.d.ts.map