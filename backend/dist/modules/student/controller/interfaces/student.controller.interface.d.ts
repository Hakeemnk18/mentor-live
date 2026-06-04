import type { Request, Response } from "express";
export interface IStudentController {
    getStudentsForAdmin(req: Request, res: Response): Promise<void>;
    blockStudent(req: Request, res: Response): Promise<void>;
    unblockStudent(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=student.controller.interface.d.ts.map