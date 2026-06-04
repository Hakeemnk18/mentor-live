var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VerifyOtpUseCase_1;
import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
let VerifyOtpUseCase = class VerifyOtpUseCase {
    static { VerifyOtpUseCase_1 = this; }
    _phoneVerificationRepo;
    static MAX_ATTEMPTS = 5;
    constructor(_phoneVerificationRepo) {
        this._phoneVerificationRepo = _phoneVerificationRepo;
    }
    async execute(dto) {
        const { phoneNumber, otp } = dto;
        const verification = await this._phoneVerificationRepo.findByPhoneNumber(phoneNumber);
        if (!verification) {
            throw new CustomError(ResponseMessages.PHONE_VERIFICATION_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        if (verification.isVerified) {
            return;
        }
        if (!verification.otpHash || !verification.otpExpiresAt) {
            throw new CustomError(ResponseMessages.OTP_INVALID, HttpStatusCode.BAD_REQUEST);
        }
        if (verification.otpExpiresAt < new Date()) {
            throw new CustomError(ResponseMessages.OTP_EXPIRED, HttpStatusCode.BAD_REQUEST);
        }
        const isMatch = await bcrypt.compare(otp, verification.otpHash);
        if (!isMatch) {
            const failed = verification.recordFailedAttempt();
            await this._phoneVerificationRepo.save(failed);
            if (failed.attempts >= VerifyOtpUseCase_1.MAX_ATTEMPTS) {
                throw new CustomError(ResponseMessages.OTP_MAX_ATTEMPTS_REACHED, HttpStatusCode.BAD_REQUEST);
            }
            throw new CustomError(ResponseMessages.OTP_INVALID, HttpStatusCode.BAD_REQUEST);
        }
        const verified = verification.verify();
        await this._phoneVerificationRepo.save(verified);
    }
};
VerifyOtpUseCase = VerifyOtpUseCase_1 = __decorate([
    injectable(),
    __param(0, inject("IPhoneVerificationRepository")),
    __metadata("design:paramtypes", [Object])
], VerifyOtpUseCase);
export { VerifyOtpUseCase };
//# sourceMappingURL=verify.otp.use-case.js.map