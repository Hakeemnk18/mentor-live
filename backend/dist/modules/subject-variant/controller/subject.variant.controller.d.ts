import type { Request, Response } from "express";
import type { IAddSubjectVariantUseCase } from "../use-cases/interfaces/add.subject.variant.use-case.interface.js";
import type { IDeleteSubjectVariantUseCase } from "../use-cases/interfaces/delete.subject.variant.use-case.interface.js";
import type { ISubjectVariantController } from "./interfaces/subject.variant.controller.interface.js";
import type { IFindSubjectVariantWithSubjectUseCase } from "../use-cases/interfaces/find.subject.variant.with.subject.use-case.interface.js";
export declare class SubjectVariantController implements ISubjectVariantController {
    private readonly _addSubjectVariantUseCase;
    private readonly _deleteSubjectVariantUseCase;
    private readonly _findSubjectVariantWithSubjectUseCase;
    constructor(_addSubjectVariantUseCase: IAddSubjectVariantUseCase, _deleteSubjectVariantUseCase: IDeleteSubjectVariantUseCase, _findSubjectVariantWithSubjectUseCase: IFindSubjectVariantWithSubjectUseCase);
    addSubjectVariant(req: Request, res: Response): Promise<void>;
    removeSubjectVariant(req: Request, res: Response): Promise<void>;
    findAllSubjectVariantWithSubject(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=subject.variant.controller.d.ts.map