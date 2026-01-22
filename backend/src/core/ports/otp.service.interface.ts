export abstract class IOtpService {
  abstract generateOtp(): Promise<{ otp: string; hashedOtp: string }>;
  abstract sendOtp(phone: string, otp: string): Promise<void>;
}