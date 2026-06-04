import { Document } from "mongoose";
export interface IBlog extends Document {
    slug: string;
    author: string;
    heading: string;
    description: string;
    content: string;
    image?: {
        url: string;
        publicId: string;
    };
    priority?: number;
    topic?: string;
    isFeatured: boolean;
    isDeleted: boolean;
}
export declare const BlogModel: import("mongoose").Model<IBlog, {}, {}, {}, Document<unknown, {}, IBlog, {}, import("mongoose").DefaultSchemaOptions> & IBlog & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBlog>;
//# sourceMappingURL=blog.schema.d.ts.map