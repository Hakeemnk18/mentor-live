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
import { PhoneVerification } from "../../phone-verification/entities/phone.verification.entity.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
const MAX_ATTEMPTS = Number(process.env.MAX_ATTEMPTS ?? 5);
let SendOtpUseCase = class SendOtpUseCase {
    _otpService;
    _phoneVerificationRepo;
    constructor(_otpService, _phoneVerificationRepo) {
        this._otpService = _otpService;
        this._phoneVerificationRepo = _phoneVerificationRepo;
    }
    async execute(dto) {
        const { phoneNumber } = dto;
        let verification = await this._phoneVerificationRepo.findByPhoneNumber(phoneNumber);
        // Already verified → idempotent success
        if (verification?.isVerified) {
            throw new CustomError(ResponseMessages.PHONE_ALREADY_VERIFIED, HttpStatusCode.BAD_REQUEST);
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
            throw new CustomError(ResponseMessages.OTP_MAX_ATTEMPTS_REACHED, HttpStatusCode.BAD_REQUEST);
        }
        const { otp, hashedOtp } = await this._otpService.generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        console.log("otp ", otp);
        const updated = verification.issueOtp(hashedOtp, expiresAt);
        const d = await this._phoneVerificationRepo.save(updated);
        //await this._otpService.sendOtp(phoneNumber, otp);
        const incrementCount = d.recordFailedAttempt();
        await this._phoneVerificationRepo.save(incrementCount);
    }
};
SendOtpUseCase = __decorate([
    injectable(),
    __param(0, inject("IOtpService")),
    __param(1, inject("IPhoneVerificationRepository")),
    __metadata("design:paramtypes", [Function, Object])
], SendOtpUseCase);
export { SendOtpUseCase };
//# sourceMappingURL=send.otp.use-case.js.map