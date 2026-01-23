import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";

import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";

import type { IVerifyOtpUseCase } from "./interfaces/verify.otp.use-case.interface.js";
import type { IPhoneVerificationRepository } from "../../phone-verification/repository/phone.verification.repository.interface.js";
import type { VerifyOtpRequestDto } from "../dtos/otp.dto.js";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  private static readonly MAX_ATTEMPTS = 5;

  constructor(
    @inject("IPhoneVerificationRepository")
    private readonly _phoneVerificationRepo: IPhoneVerificationRepository
  ) {}

  async execute(dto: VerifyOtpRequestDto): Promise<void> {
    const { phoneNumber, otp } = dto
    const verification =
      await this._phoneVerificationRepo.findByPhoneNumber(phoneNumber);

    if (!verification) {
      throw new CustomError(
        ResponseMessages.PHONE_VERIFICATION_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (verification.isVerified) {
      return;
    }

    if (!verification.otpHash || !verification.otpExpiresAt) {
      throw new CustomError(
        ResponseMessages.OTP_INVALID,
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (verification.otpExpiresAt < new Date()) {
      throw new CustomError(
        ResponseMessages.OTP_EXPIRED,
        HttpStatusCode.BAD_REQUEST
      );
    }
    console.log("otp ",otp)
    console.log("hash otp ",verification.otpHash)
    const isMatch = await bcrypt.compare(otp!, verification.otpHash);

    if (!isMatch) {
      const failed = verification.recordFailedAttempt();
      await this._phoneVerificationRepo.save(failed);

      if (failed.attempts >= VerifyOtpUseCase.MAX_ATTEMPTS) {
        throw new CustomError(
          ResponseMessages.OTP_MAX_ATTEMPTS_REACHED,
          HttpStatusCode.BAD_REQUEST
        );
      }

      throw new CustomError(
        ResponseMessages.OTP_INVALID,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const verified = verification.verify();
    await this._phoneVerificationRepo.save(verified);
  }
}