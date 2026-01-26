import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";

import type { IOtpService } from "../../../core/ports/otp.service.interface.js";
import type { IResendOtpUseCase } from "./interfaces/resend.otp.use-case.interface.js";
import type { IPhoneVerificationRepository } from "../../phone-verification/repository/phone.verification.repository.interface.js";
import type { VerifyOtpRequestDto } from "../dtos/otp.dto.js";
const MAX_ATTEMPTS = Number(process.env.MAX_ATTEMPTS ?? 5);

@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase{
 

  constructor(
    @inject("IOtpService")
    private readonly _otpService: IOtpService,

    @inject("IPhoneVerificationRepository")
    private readonly _phoneVerificationRepo: IPhoneVerificationRepository
  ) {}

  async execute(dto: VerifyOtpRequestDto): Promise<void> {
    const { phoneNumber } = dto
    const verification =
      await this._phoneVerificationRepo.findByPhoneNumber(phoneNumber);

    if (!verification) {
      throw new CustomError(
        ResponseMessages.PHONE_VERIFICATION_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }
    console.log("verification completed ")
    if (verification.isVerified) {
      throw new CustomError(
        ResponseMessages.PHONE_ALREADY_VERIFIED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (verification.attempts >= MAX_ATTEMPTS) {
      throw new CustomError(
        ResponseMessages.OTP_MAX_ATTEMPTS_REACHED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const { otp, hashedOtp } = await this._otpService.generateOtp();
    console.log("otp ",otp)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    const updated = verification.issueOtp(hashedOtp, expiresAt);
    const newDoc = await this._phoneVerificationRepo.save(updated);
    
    //await this._otpService.sendOtp(phoneNumber, otp);
    const incrementCount = newDoc.recordFailedAttempt()
    await this._phoneVerificationRepo.save(incrementCount);
    
  }
}