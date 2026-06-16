// infrastructure/services/otp.service.ts
import bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { IOtpService } from "../../core/ports/otp.service.interface.js";
import { twilioClient } from "../../config/twilio.js"; 

@injectable()
export class OtpService implements IOtpService {
  async generateOtp() {
    // TODO: testing only — always returns a fixed OTP. Switch back to
    // Math.floor(100000 + Math.random() * 900000).toString() for production.
    const otp = "111111";
    const hashedOtp = await bcrypt.hash(otp, 10);

    return { otp, hashedOtp };
  }

  async sendOtp(phone: string, otp: string): Promise<void> {
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_SMS_NUMBER!,
      to: phone,
    });
  }
}
