import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { PhoneVerification } from "../entities/phone.verification.entity.js";
import { PhoneVerificationModel } from "../infrastructure/phone.verification.schema.js";
import { PhoneVerificationMapper } from "../mapper/phone.verification.mapper.js";
export class PhoneVerificationRepository {
    async create(phoneVerification) {
        const persistenceData = PhoneVerificationMapper.toPersistence(phoneVerification);
        const created = await PhoneVerificationModel.create(persistenceData);
        const domain = PhoneVerificationMapper.toDomain(created);
        if (!domain) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domain;
    }
    async findByPhoneNumber(phoneNumber) {
        const document = await PhoneVerificationModel.findOne({
            phoneNumber,
            isDeleted: false,
        }).lean();
        return PhoneVerificationMapper.toDomain(document);
    }
    async save(phoneVerification) {
        if (!phoneVerification.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = PhoneVerificationMapper.toPersistence(phoneVerification);
        const updatedDocument = await PhoneVerificationModel.findByIdAndUpdate(phoneVerification.id, { $set: persistenceData }, { new: true }).lean();
        if (!updatedDocument) {
            throw new CustomError(ResponseMessages.PHONE_VERIFICATION_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domain = PhoneVerificationMapper.toDomain(updatedDocument);
        if (!domain) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domain;
    }
}
//# sourceMappingURL=phone.verification.repository.js.map