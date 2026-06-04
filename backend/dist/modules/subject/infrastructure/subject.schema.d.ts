import { Document } from "mongoose";
export interface ISubject extends Document {
    name: string;
    isDeleted: boolean;
}
export declare const SubjectModel: import("mongoose").Model<ISubject, {}, {}, {}, Document<unknown, {}, ISubject, {}, import("mongoose").DefaultSchemaOptions> & ISubject & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISubject>;
//# sourceMappingURL=subject.schema.d.ts.map