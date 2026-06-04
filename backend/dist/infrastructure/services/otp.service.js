var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// infrastructure/services/otp.service.ts
import bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { IOtpService } from "../../core/ports/otp.service.interface.js";
import { twilioClient } from "../../config/twilio.js";
let OtpService = class OtpService {
    async generateOtp() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        return { otp, hashedOtp };
    }
    async sendOtp(phone, otp) {
        await twilioClient.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_SMS_NUMBER,
            to: phone,
        });
    }
};
OtpService = __decorate([
    injectable()
], OtpService);
export { OtpService };
//# sourceMappingURL=otp.service.js.map