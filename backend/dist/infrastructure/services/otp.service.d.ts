import { IOtpService } from "../../core/ports/otp.service.interface.js";
export declare class OtpService implements IOtpService {
    generateOtp(): Promise<{
        otp: string;
        hashedOtp: string;
    }>;
    sendOtp(phone: string, otp: string): Promise<void>;
}
//# sourceMappingURL=otp.service.d.ts.map