import type { Request, Response } from "express";
import type { ISubjectController } from "./interfaces/subject.controller.interface.js";
import type { ICreateSubjectUseCase } from "../use-cases/interfaces/create.subject.use-case.interface.js";
import type { IEditSubjectUseCase } from "../use-cases/interfaces/edit.subject.use-case.interface.js";
import type { IGetSubjectsForAdminUseCase } from "../use-cases/interfaces/get.all.subject.for.admin.use-case.interface.js";
import type { IGetSubjectDetailsUseCase } from "../use-cases/interfaces/get.subject.details.use-case.interface.js";
import type { IGetAllSubjectForUserUseCase } from "../use-cases/interfaces/get.all.subject.for.user.use-case.interface.js";
export declare class SubjectController implements ISubjectController {
    private readonly _createSubjectUseCase;
    private readonly _editSubjectUseCase;
    private readonly _getSubjectsForAdminUseCase;
    private readonly _getSubjectDetailsUseCase;
    private readonly _getAllSubjectForUserUseCase;
    constructor(_createSubjectUseCase: ICreateSubjectUseCase, _editSubjectUseCase: IEditSubjectUseCase, _getSubjectsForAdminUseCase: IGetSubjectsForAdminUseCase, _getSubjectDetailsUseCase: IGetSubjectDetailsUseCase, _getAllSubjectForUserUseCase: IGetAllSubjectForUserUseCase);
    createSubject(req: Request, res: Response): Promise<void>;
    editSubjectName(req: Request, res: Response): Promise<void>;
    getAllSubjectForAdmin(req: Request, res: Response): Promise<void>;
    getSubjectDetails(req: Request, res: Response): Promise<void>;
    getAllSubjectForUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=subject.controller.d.ts.map