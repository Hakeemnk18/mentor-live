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

export class PhoneVerification {
  public readonly id: string | null;
  public readonly phoneNumber: string;
  public readonly isVerified: boolean;
  public readonly otpHash: string | null;
  public readonly otpExpiresAt: Date | null;
  public readonly attempts: number;
  public readonly verifiedAt: Date | null;
  public readonly isDeleted: boolean;

  constructor(props: PhoneVerificationProps) {
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
  issueOtp(hash: string, expiresAt: Date): PhoneVerification {
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
  recordFailedAttempt(): PhoneVerification {
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
  verify(): PhoneVerification {
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
  delete(): PhoneVerification {
    if (this.isDeleted) {
      throw new Error("Phone verification already deleted");
    }

    return new PhoneVerification({
      ...this,
      isDeleted: true,
    });
  }

  restore(): PhoneVerification {
    if (!this.isDeleted) {
      throw new Error("Phone verification is not deleted");
    }

    return new PhoneVerification({
      ...this,
      isDeleted: false,
    });
  }
}
