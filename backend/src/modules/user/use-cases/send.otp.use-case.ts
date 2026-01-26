import { inject, injectable } from "tsyringe";
import type { IOtpService } from "../../../core/ports/otp.service.interface.js";
import type { ISendOtpUseCase } from "./interfaces/send.otp.use-case.interface.js";
import type { IPhoneVerificationRepository } from "../../phone-verification/repository/phone.verification.repository.interface.js";
import { PhoneVerification } from "../../phone-verification/entities/phone.verification.entity.js";
import type { VerifyOtpRequestDto } from "../dtos/otp.dto.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
const MAX_ATTEMPTS = Number(process.env.MAX_ATTEMPTS ?? 5);

@injectable()
export class SendOtpUseCase implements ISendOtpUseCase {
   constructor(
    @inject("IOtpService")
    private readonly _otpService: IOtpService,

    @inject("IPhoneVerificationRepository")
    private readonly _phoneVerificationRepo: IPhoneVerificationRepository
  ) {}

  async execute(dto: VerifyOtpRequestDto): Promise<void> {
    const { phoneNumber } = dto
    let verification =
      await this._phoneVerificationRepo.findByPhoneNumber(phoneNumber);

    // Already verified → idempotent success
    if (verification?.isVerified) {
      throw new CustomError(
        ResponseMessages.PHONE_ALREADY_VERIFIED,
        HttpStatusCode.BAD_REQUEST
      )
    }

    // Create record if not exists
    if (!verification) {
      verification = new PhoneVerification({
        id: null,
        phoneNumber,
      });
      verification = await this._phoneVerificationRepo.create(verification);
    }

    if (verification.attempts >= MAX_ATTEMPTS) {
      throw new CustomError(
        ResponseMessages.OTP_MAX_ATTEMPTS_REACHED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const { otp, hashedOtp } = await this._otpService.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    console.log("otp ",otp)
    const updated = verification.issueOtp(hashedOtp, expiresAt);
    
    const d = await this._phoneVerificationRepo.save(updated);

    //await this._otpService.sendOtp(phoneNumber, otp);
    
    const incrementCount = d.recordFailedAttempt()
    
    await this._phoneVerificationRepo.save(incrementCount);

  }
}
