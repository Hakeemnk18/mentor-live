import { Lead } from "../entities/lead.entity.js";
import type { LeadListItem } from "../type/lead.type.js";
export declare class LeadMapper {
    static toDomain(data: any): Lead | null;
    static toPersistence(lead: Lead): any;
    static toListItem(doc: any): LeadListItem;
}
//# sourceMappingURL=lead.mapper.d.ts.map