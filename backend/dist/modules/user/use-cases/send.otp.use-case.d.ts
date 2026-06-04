import type { IOtpService } from "../../../core/ports/otp.service.interface.js";
import type { ISendOtpUseCase } from "./interfaces/send.otp.use-case.interface.js";
import type { IPhoneVerificationRepository } from "../../phone-verification/repository/phone.verification.repository.interface.js";
import type { VerifyOtpRequestDto } from "../dtos/otp.dto.js";
export declare class SendOtpUseCase implements ISendOtpUseCase {
    private readonly _otpService;
    private readonly _phoneVerificationRepo;
    constructor(_otpService: IOtpService, _phoneVerificationRepo: IPhoneVerificationRepository);
    execute(dto: VerifyOtpRequestDto): Promise<void>;
}
//# sourceMappingURL=send.otp.use-case.d.ts.map