import type { VerifyOtpRequestDto } from "../../dtos/otp.dto.js";
export interface IResendOtpUseCase {
    execute(dto: VerifyOtpRequestDto): Promise<void>;
}
//# sourceMappingURL=resend.otp.use-case.interface.d.ts.map