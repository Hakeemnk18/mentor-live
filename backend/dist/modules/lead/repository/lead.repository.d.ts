import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Lead } from "../entities/lead.entity.js";
import type { LeadListItem } from "../type/lead.type.js";
import type { ILeadRepository } from "./lead.repository.interface.js";
export declare class LeadRepository implements ILeadRepository {
    create(lead: Lead): Promise<Lead>;
    findById(id: string): Promise<Lead | null>;
    save(lead: Lead): Promise<Lead>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<LeadListItem[]>;
    countDocument(query: Record<string, any>): Promise<number>;
}
//# sourceMappingURL=lead.repository.d.ts.map