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
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
const MAX_ATTEMPTS = Number(process.env.MAX_ATTEMPTS ?? 5);
let ResendOtpUseCase = class ResendOtpUseCase {
    _otpService;
    _phoneVerificationRepo;
    constructor(_otpService, _phoneVerificationRepo) {
        this._otpService = _otpService;
        this._phoneVerificationRepo = _phoneVerificationRepo;
    }
    async execute(dto) {
        const { phoneNumber } = dto;
        const verification = await this._phoneVerificationRepo.findByPhoneNumber(phoneNumber);
        if (!verification) {
            throw new CustomError(ResponseMessages.PHONE_VERIFICATION_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        console.log("verification completed ");
        if (verification.isVerified) {
            throw new CustomError(ResponseMessages.PHONE_ALREADY_VERIFIED, HttpStatusCode.BAD_REQUEST);
        }
        if (verification.attempts >= MAX_ATTEMPTS) {
            throw new CustomError(ResponseMessages.OTP_MAX_ATTEMPTS_REACHED, HttpStatusCode.BAD_REQUEST);
        }
        const { otp, hashedOtp } = await this._otpService.generateOtp();
        console.log("otp ", otp);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const updated = verification.issueOtp(hashedOtp, expiresAt);
        const newDoc = await this._phoneVerificationRepo.save(updated);
        //await this._otpService.sendOtp(phoneNumber, otp);
        const incrementCount = newDoc.recordFailedAttempt();
        await this._phoneVerificationRepo.save(incrementCount);
    }
};
ResendOtpUseCase = __decorate([
    injectable(),
    __param(0, inject("IOtpService")),
    __param(1, inject("IPhoneVerificationRepository")),
    __metadata("design:paramtypes", [Function, Object])
], ResendOtpUseCase);
export { ResendOtpUseCase };
//# sourceMappingURL=resend.otp.use-case.js.map