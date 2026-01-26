import type { VerifyOtpRequestDto } from "../../dtos/otp.dto.js";

export interface IVerifyOtpUseCase {
    execute(dto: VerifyOtpRequestDto): Promise<void>
}