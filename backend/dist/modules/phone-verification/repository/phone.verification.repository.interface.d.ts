import type { PhoneVerification } from "../entities/phone.verification.entity.js";
export interface IPhoneVerificationRepository {
    create(phoneVerification: PhoneVerification): Promise<PhoneVerification>;
    findByPhoneNumber(phoneNumber: string): Promise<PhoneVerification | null>;
    save(phoneVerification: PhoneVerification): Promise<PhoneVerification>;
}
//# sourceMappingURL=phone.verification.repository.interface.d.ts.map