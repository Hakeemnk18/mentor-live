import { PhoneVerification } from "../entities/phone.verification.entity.js";
import type { IPhoneVerificationRepository } from "./phone.verification.repository.interface.js";
export declare class PhoneVerificationRepository implements IPhoneVerificationRepository {
    create(phoneVerification: PhoneVerification): Promise<PhoneVerification>;
    findByPhoneNumber(phoneNumber: string): Promise<PhoneVerification | null>;
    save(phoneVerification: PhoneVerification): Promise<PhoneVerification>;
}
//# sourceMappingURL=phone.verification.repository.d.ts.map