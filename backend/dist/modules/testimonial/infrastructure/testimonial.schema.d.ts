import { Document } from "mongoose";
export interface ITestimonial extends Document {
    author: string;
    designation: string;
    comment: string;
    isDeleted: boolean;
}
export declare const TestimonialModel: import("mongoose").Model<ITestimonial, {}, {}, {}, Document<unknown, {}, ITestimonial, {}, import("mongoose").DefaultSchemaOptions> & ITestimonial & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITestimonial>;
//# sourceMappingURL=testimonial.schema.d.ts.map