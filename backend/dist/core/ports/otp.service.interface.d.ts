export declare abstract class IOtpService {
    abstract generateOtp(): Promise<{
        otp: string;
        hashedOtp: string;
    }>;
    abstract sendOtp(phone: string, otp: string): Promise<void>;
}
//# sourceMappingURL=otp.service.interface.d.ts.map