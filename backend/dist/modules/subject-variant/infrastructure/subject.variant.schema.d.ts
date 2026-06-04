import { Document, Types } from "mongoose";
export interface ISubjectVariant extends Document {
    subject: Types.ObjectId;
    class: Types.ObjectId;
    syllabus: Types.ObjectId;
    isDeleted: boolean;
}
export declare const SubjectVariantModel: import("mongoose").Model<ISubjectVariant, {}, {}, {}, Document<unknown, {}, ISubjectVariant, {}, import("mongoose").DefaultSchemaOptions> & ISubjectVariant & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISubjectVariant>;
//# sourceMappingURL=subject.variant.schema.d.ts.map