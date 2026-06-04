export interface PhoneVerificationProps {
    id: string | null;
    phoneNumber: string;
    isVerified?: boolean;
    otpHash?: string | null;
    otpExpiresAt?: Date | null;
    attempts?: number;
    verifiedAt?: Date | null;
    isDeleted?: boolean;
}
export declare class PhoneVerification {
    readonly id: string | null;
    readonly phoneNumber: string;
    readonly isVerified: boolean;
    readonly otpHash: string | null;
    readonly otpExpiresAt: Date | null;
    readonly attempts: number;
    readonly verifiedAt: Date | null;
    readonly isDeleted: boolean;
    constructor(props: PhoneVerificationProps);
    /**
     * Attach / replace OTP
     */
    issueOtp(hash: string, expiresAt: Date): PhoneVerification;
    /**
     * Increase failed attempt count
     */
    recordFailedAttempt(): PhoneVerification;
    /**
     * Mark phone as verified
     */
    verify(): PhoneVerification;
    /**
     * Soft delete (optional, but consistent with your system)
     */
    delete(): PhoneVerification;
    restore(): PhoneVerification;
}
//# sourceMappingURL=phone.verification.entity.d.ts.map