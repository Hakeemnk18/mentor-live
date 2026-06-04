export class PhoneVerification {
    id;
    phoneNumber;
    isVerified;
    otpHash;
    otpExpiresAt;
    attempts;
    verifiedAt;
    isDeleted;
    constructor(props) {
        this.id = props.id;
        this.phoneNumber = props.phoneNumber.trim();
        this.isVerified = props.isVerified ?? false;
        this.otpHash = props.otpHash ?? null;
        this.otpExpiresAt = props.otpExpiresAt ?? null;
        this.attempts = props.attempts ?? 0;
        this.verifiedAt = props.verifiedAt ?? null;
        this.isDeleted = props.isDeleted ?? false;
        if (!this.phoneNumber) {
            throw new Error("Phone number cannot be empty");
        }
    }
    /**
     * Attach / replace OTP
     */
    issueOtp(hash, expiresAt) {
        if (this.isVerified) {
            throw new Error("Phone number already verified");
        }
        return new PhoneVerification({
            ...this,
            otpHash: hash,
            otpExpiresAt: expiresAt,
            attempts: 0,
        });
    }
    /**
     * Increase failed attempt count
     */
    recordFailedAttempt() {
        if (this.isVerified) {
            throw new Error("Phone number already verified");
        }
        return new PhoneVerification({
            ...this,
            attempts: this.attempts + 1,
        });
    }
    /**
     * Mark phone as verified
     */
    verify() {
        if (this.isVerified) {
            throw new Error("Phone number already verified");
        }
        return new PhoneVerification({
            ...this,
            isVerified: true,
            verifiedAt: new Date(),
            otpHash: null,
            otpExpiresAt: null,
        });
    }
    /**
     * Soft delete (optional, but consistent with your system)
     */
    delete() {
        if (this.isDeleted) {
            throw new Error("Phone verification already deleted");
        }
        return new PhoneVerification({
            ...this,
            isDeleted: true,
        });
    }
    restore() {
        if (!this.isDeleted) {
            throw new Error("Phone verification is not deleted");
        }
        return new PhoneVerification({
            ...this,
            isDeleted: false,
        });
    }
}
//# sourceMappingURL=phone.verification.entity.js.map