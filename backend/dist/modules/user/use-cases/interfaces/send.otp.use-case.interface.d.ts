import type { VerifyOtpRequestDto } from "../../dtos/otp.dto.js";
export interface ISendOtpUseCase {
    execute(dto: VerifyOtpRequestDto): Promise<void>;
}
//# sourceMappingURL=send.otp.use-case.interface.d.ts.map