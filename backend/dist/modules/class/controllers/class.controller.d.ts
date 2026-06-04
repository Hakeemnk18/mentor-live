import type { Request, Response } from "express";
import type { ICreateClassUseCase } from "../use-cases/interfaces/create.class.use-case.interface.js";
import type { IEditClassUseCase } from "../use-cases/interfaces/edit.class.use-case.interface.js";
import type { IClassController } from "./interfaces/class.controller.interfaces.js";
import type { IGetClassesForUserUseCase } from "../use-cases/interfaces/get.all.for.user.use-case.interface.js";
import type { IGetClassesForAdminUseCase } from "../use-cases/interfaces/get.all.for.admin.use-case.interface.js";
export declare class ClassController implements IClassController {
    private readonly _createClassUseCase;
    private readonly _editClassUseCase;
    private readonly _getClassesForUserUseCase;
    private readonly _getClassesForAdminUseCase;
    constructor(_createClassUseCase: ICreateClassUseCase, _editClassUseCase: IEditClassUseCase, _getClassesForUserUseCase: IGetClassesForUserUseCase, _getClassesForAdminUseCase: IGetClassesForAdminUseCase);
    /** 🏗️ Create class (Admin) */
    createClass(req: Request, res: Response): Promise<void>;
    /** ✏️ Edit class (Admin) */
    editClass(req: Request, res: Response): Promise<void>;
    /** 👤 User: get active classes for dropdown */
    getClassesForUser(req: Request, res: Response): Promise<void>;
    /** 🛠️ Admin: get all classes (including deleted) */
    getClassesForAdmin(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=class.controller.d.ts.map