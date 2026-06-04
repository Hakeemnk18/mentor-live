import { Document, Types } from "mongoose";
import type { BookingMode, BookingStatus, BookingType } from "../type/booking.type.js";
export interface IBooking extends Document {
    userId: Types.ObjectId;
    facultyId: Types.ObjectId;
    type: BookingType;
    mode: BookingMode;
    slotId?: string[];
    chapterId?: Types.ObjectId;
    isContacted: boolean;
    status: BookingStatus;
    isDeleted: boolean;
    class: Types.ObjectId;
    syllabus: Types.ObjectId;
}
export declare const BookingModel: import("mongoose").Model<IBooking, {}, {}, {}, Document<unknown, {}, IBooking, {}, import("mongoose").DefaultSchemaOptions> & IBooking & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBooking>;
//# sourceMappingURL=booking.schema.d.ts.map