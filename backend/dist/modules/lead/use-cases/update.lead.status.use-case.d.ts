import type { IUpdateLeadStatusUseCase } from "./interfaces/update.lead.status.use-case.interface.js";
import type { ILeadRepository } from "../repository/lead.repository.interface.js";
import type { LeadStatus } from "../entities/lead.entity.js";
export declare class UpdateLeadStatusUseCase implements IUpdateLeadStatusUseCase {
    private readonly _leadRepository;
    constructor(_leadRepository: ILeadRepository);
    execute(id: string, status: LeadStatus): Promise<void>;
}
//# sourceMappingURL=update.lead.status.use-case.d.ts.map