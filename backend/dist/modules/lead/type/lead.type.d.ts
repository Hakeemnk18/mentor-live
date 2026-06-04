import type { LeadStatus, LeadType } from "../entities/lead.entity.js";
export interface LeadListItem {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    message: string | null;
    purpose: string;
    type: LeadType;
    status: LeadStatus;
    classId: string | null;
    syllabusId: string | null;
    className: string | null;
    syllabusName: string | null;
    createdAt: Date;
}
//# sourceMappingURL=lead.type.d.ts.map