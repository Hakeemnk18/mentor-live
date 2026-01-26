import type { VerifyOtpRequestDto } from "../../dtos/otp.dto.js";

export interface ISendOtpUseCase {
    execute(dto: VerifyOtpRequestDto): Promise<void>
}