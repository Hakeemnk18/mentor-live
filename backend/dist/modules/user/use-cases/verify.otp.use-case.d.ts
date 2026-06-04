import type { IVerifyOtpUseCase } from "./interfaces/verify.otp.use-case.interface.js";
import type { IPhoneVerificationRepository } from "../../phone-verification/repository/phone.verification.repository.interface.js";
import type { VerifyOtpRequestDto } from "../dtos/otp.dto.js";
export declare class VerifyOtpUseCase implements IVerifyOtpUseCase {
    private readonly _phoneVerificationRepo;
    private static readonly MAX_ATTEMPTS;
    constructor(_phoneVerificationRepo: IPhoneVerificationRepository);
    execute(dto: VerifyOtpRequestDto): Promise<void>;
}
//# sourceMappingURL=verify.otp.use-case.d.ts.map