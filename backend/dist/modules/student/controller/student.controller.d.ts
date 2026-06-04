import type { Request, Response } from "express";
import type { IStudentController } from "./interfaces/student.controller.interface.js";
import type { IGetAllForAdminStudentUseCase } from "../use-cases/interfaces/get.all.for.admin.use-case.interface.js";
import type { IBlockStudentUseCase } from "../use-cases/interfaces/block.student.interface.js";
import type { IUnblockStudentUseCase } from "../use-cases/interfaces/unblock.student.interface.js";
export declare class StudentController implements IStudentController {
    private readonly _getStudentsForAdminUseCase;
    private readonly _blockStudentUseCase;
    private readonly _unblockStudentUseCase;
    constructor(_getStudentsForAdminUseCase: IGetAllForAdminStudentUseCase, _blockStudentUseCase: IBlockStudentUseCase, _unblockStudentUseCase: IUnblockStudentUseCase);
    /** 🛠️ Admin: get all students */
    getStudentsForAdmin(req: Request, res: Response): Promise<void>;
    /** 🚫 Admin: block student */
    blockStudent(req: Request, res: Response): Promise<void>;
    /** ✅ Admin: unblock student */
    unblockStudent(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=student.controller.d.ts.map