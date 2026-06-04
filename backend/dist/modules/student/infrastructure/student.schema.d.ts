import { Document, Types } from "mongoose";
export interface IStudent extends Document {
    name: string;
    class: Types.ObjectId;
    place: string;
    phoneNumber: string;
    school: string;
    syllabus: Types.ObjectId;
    isDeleted: boolean;
}
export declare const StudentModel: import("mongoose").Model<IStudent, {}, {}, {}, Document<unknown, {}, IStudent, {}, import("mongoose").DefaultSchemaOptions> & IStudent & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IStudent>;
//# sourceMappingURL=student.schema.d.ts.map