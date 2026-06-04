import { Document } from "mongoose";
export interface IClass extends Document {
    name: string;
    isDeleted: boolean;
}
export declare const ClassModel: import("mongoose").Model<IClass, {}, {}, {}, Document<unknown, {}, IClass, {}, import("mongoose").DefaultSchemaOptions> & IClass & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IClass>;
//# sourceMappingURL=class.schema.d.ts.map