import type { Request, Response } from "express";
import type { ISyllabusController } from "./interfaces/syllabus.controller.interface.js";
import type { ICreateSyllabusUseCase } from "../use-cases/interfaces/create.syllabus.interface.js";
import type { IEditSyllabusUseCase } from "../use-cases/interfaces/edit.syllabus.interface.js";
import type { IGetSyllabusesForUserUseCase } from "../use-cases/interfaces/get.all.for.user.interface.js";
import type { IGetSyllabusesForAdminUseCase } from "../use-cases/interfaces/get.all.for.admin.interface.js";
export declare class SyllabusController implements ISyllabusController {
    private readonly _createSyllabusUseCase;
    private readonly _editSyllabusUseCase;
    private readonly _getSyllabusesForUserUseCase;
    private readonly _getSyllabusesForAdminUseCase;
    constructor(_createSyllabusUseCase: ICreateSyllabusUseCase, _editSyllabusUseCase: IEditSyllabusUseCase, _getSyllabusesForUserUseCase: IGetSyllabusesForUserUseCase, _getSyllabusesForAdminUseCase: IGetSyllabusesForAdminUseCase);
    /** 🏗️ Create syllabus (Admin) */
    createSyllabus(req: Request, res: Response): Promise<void>;
    /** ✏️ Edit syllabus (Admin) */
    editSyllabus(req: Request, res: Response): Promise<void>;
    /** 👤 User: get active syllabuses for dropdown */
    getSyllabusesForUser(req: Request, res: Response): Promise<void>;
    /** 🛠️ Admin: get all syllabuses (including deleted) */
    getSyllabusesForAdmin(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=syllabus.controller.d.ts.map