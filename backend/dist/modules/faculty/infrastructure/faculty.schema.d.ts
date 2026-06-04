import { Document, Types } from "mongoose";
export interface IFaculty extends Document {
    name: string;
    qualifications: string[];
    description: string;
    demoClass: string;
    image: {
        url: string;
        publicId: string;
    };
    subjectOffering: {
        variantId: Types.ObjectId;
        price: number;
    }[];
    slots: {
        time: Date;
        isAvailable: boolean;
        pool: Types.ObjectId[];
        poolLimit: number;
    }[];
    chapterSlots: {
        chapter: Types.ObjectId;
        isAvailable: boolean;
        pool: Types.ObjectId[];
        poolLimit: number;
    }[];
    isDeleted: boolean;
}
export declare const FacultyModel: import("mongoose").Model<IFaculty, {}, {}, {}, Document<unknown, {}, IFaculty, {}, import("mongoose").DefaultSchemaOptions> & IFaculty & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IFaculty>;
//# sourceMappingURL=faculty.schema.d.ts.map