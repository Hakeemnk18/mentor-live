import { PhoneVerification } from "../entities/phone.verification.entity.js";

export class PhoneVerificationMapper {
  static toDomain(phoneVerificationModelData: any): PhoneVerification | null {
    if (!phoneVerificationModelData) {
      return null;
    }

    const idString =
      phoneVerificationModelData._id?.toString() ||
      phoneVerificationModelData.id?.toString();

    if (!idString) {
      console.error(
        "PhoneVerification data from DB is missing an ID:",
        phoneVerificationModelData
      );
      return null;
    }

    return new PhoneVerification({
      id: idString,
      phoneNumber: phoneVerificationModelData.phoneNumber,
      isVerified: phoneVerificationModelData.isVerified,
      otpHash: phoneVerificationModelData.otpHash ?? null,
      otpExpiresAt: phoneVerificationModelData.otpExpiresAt ?? null,
      attempts: phoneVerificationModelData.attempts,
      verifiedAt: phoneVerificationModelData.verifiedAt ?? null,
      isDeleted: phoneVerificationModelData.isDeleted,
    });
  }

  static toPersistence(phoneVerificationEntity: PhoneVerification): any {
    return {
      phoneNumber: phoneVerificationEntity.phoneNumber,
      isVerified: phoneVerificationEntity.isVerified,
      otpHash: phoneVerificationEntity.otpHash,
      otpExpiresAt: phoneVerificationEntity.otpExpiresAt,
      attempts: phoneVerificationEntity.attempts,
      verifiedAt: phoneVerificationEntity.verifiedAt,
      isDeleted: phoneVerificationEntity.isDeleted,
    };
  }
}
