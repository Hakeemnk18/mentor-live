import { Document, Types } from "mongoose";
export interface IChapter extends Document {
    icon: {
        url: string;
        publicId: string;
    };
    name: string;
    price: number;
    subjectVariant: Types.ObjectId;
    isDeleted: boolean;
}
export declare const ChapterModel: import("mongoose").Model<IChapter, {}, {}, {}, Document<unknown, {}, IChapter, {}, import("mongoose").DefaultSchemaOptions> & IChapter & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IChapter>;
//# sourceMappingURL=chapter.schema.d.ts.map