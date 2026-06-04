import type { GetAllQueryDto } from "../../../core/shared/dtos/get.all.doc.dto.js";
import type { IGetAllLeadsUseCase } from "./interfaces/get.all.leads.use-case.interface.js";
import type { ILeadRepository } from "../repository/lead.repository.interface.js";
import type { LeadListItem } from "../type/lead.type.js";
export declare class GetAllLeadsUseCase implements IGetAllLeadsUseCase {
    private readonly _leadRepository;
    constructor(_leadRepository: ILeadRepository);
    execute(dto: GetAllQueryDto): Promise<{
        data: LeadListItem[];
        total: number;
    }>;
}
//# sourceMappingURL=get.all.leads.use-case.d.ts.map