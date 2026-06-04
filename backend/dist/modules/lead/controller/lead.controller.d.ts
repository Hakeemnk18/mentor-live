import type { Request, Response } from "express";
import type { ILeadController } from "./interfaces/lead.controller.interface.js";
import type { ICreateLeadUseCase } from "../use-cases/interfaces/create.lead.use-case.interface.js";
import type { IGetAllLeadsUseCase } from "../use-cases/interfaces/get.all.leads.use-case.interface.js";
import type { IUpdateLeadStatusUseCase } from "../use-cases/interfaces/update.lead.status.use-case.interface.js";
export declare class LeadController implements ILeadController {
    private readonly _createLeadUseCase;
    private readonly _getAllLeadsUseCase;
    private readonly _updateLeadStatusUseCase;
    constructor(_createLeadUseCase: ICreateLeadUseCase, _getAllLeadsUseCase: IGetAllLeadsUseCase, _updateLeadStatusUseCase: IUpdateLeadStatusUseCase);
    createLead(req: Request, res: Response): Promise<void>;
    getAllLeads(req: Request, res: Response): Promise<void>;
    updateLeadStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=lead.controller.d.ts.map