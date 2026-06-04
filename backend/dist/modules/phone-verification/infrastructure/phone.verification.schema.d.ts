import { Document } from "mongoose";
export interface IPhoneVerification extends Document {
    phoneNumber: string;
    isVerified: boolean;
    otpHash?: string;
    otpExpiresAt?: Date;
    attempts: number;
    verifiedAt?: Date;
    isDeleted: boolean;
}
export declare const PhoneVerificationModel: import("mongoose").Model<IPhoneVerification, {}, {}, {}, Document<unknown, {}, IPhoneVerification, {}, import("mongoose").DefaultSchemaOptions> & IPhoneVerification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPhoneVerification>;
//# sourceMappingURL=phone.verification.schema.d.ts.map