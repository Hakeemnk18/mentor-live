import { Document } from "mongoose";
export type LeadType = "inquiry" | "request";
export type LeadStatus = "new" | "contacted" | "resolved";
export interface ILead extends Document {
    name: string;
    phone: string;
    email?: string;
    message?: string;
    purpose: string;
    type: LeadType;
    status: LeadStatus;
    classId?: string;
    syllabusId?: string;
    className?: string;
    syllabusName?: string;
}
export declare const LeadModel: import("mongoose").Model<ILead, {}, {}, {}, Document<unknown, {}, ILead, {}, import("mongoose").DefaultSchemaOptions> & ILead & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILead>;
//# sourceMappingURL=lead.schema.d.ts.map