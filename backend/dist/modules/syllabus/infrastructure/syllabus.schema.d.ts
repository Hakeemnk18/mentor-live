import { Document } from "mongoose";
export interface ISyllabus extends Document {
    name: string;
    isDeleted: boolean;
}
export declare const SyllabusModel: import("mongoose").Model<ISyllabus, {}, {}, {}, Document<unknown, {}, ISyllabus, {}, import("mongoose").DefaultSchemaOptions> & ISyllabus & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISyllabus>;
//# sourceMappingURL=syllabus.schema.d.ts.map