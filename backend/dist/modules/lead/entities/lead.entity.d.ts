export type LeadType = "inquiry" | "request";
export type LeadStatus = "new" | "contacted" | "resolved";
export interface LeadProps {
    id: string | null;
    name: string;
    phone: string;
    email?: string | null;
    message?: string | null;
    purpose: string;
    type: LeadType;
    status?: LeadStatus;
    classId?: string | null;
    syllabusId?: string | null;
    className?: string | null;
    syllabusName?: string | null;
}
export declare class Lead {
    readonly id: string | null;
    readonly name: string;
    readonly phone: string;
    readonly email: string | null;
    readonly message: string | null;
    readonly purpose: string;
    readonly type: LeadType;
    readonly status: LeadStatus;
    readonly classId: string | null;
    readonly syllabusId: string | null;
    readonly className: string | null;
    readonly syllabusName: string | null;
    constructor(props: LeadProps);
    updateStatus(status: LeadStatus): Lead;
}
//# sourceMappingURL=lead.entity.d.ts.map