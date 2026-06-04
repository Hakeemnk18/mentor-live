import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { SubjectVariant } from "../entities/subject.variant.entity.js";
import { SubjectVariantModel } from "../infrastructure/subject.variant.schema.js";
import { SubjectVariantMapper } from "../mappers/subject.variant.mapper.js";
export class SubjectVariantRepository {
    async create(entity) {
        const persistenceData = SubjectVariantMapper.toPersistence(entity);
        const created = await SubjectVariantModel.create(persistenceData);
        const domain = SubjectVariantMapper.toDomain(created);
        if (!domain) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domain;
    }
    async findById(id) {
        const found = await SubjectVariantModel.findOne({ _id: id }).lean();
        return SubjectVariantMapper.toDomain(found);
    }
    async findByCombination(subjectId, classId, syllabusId) {
        const found = await SubjectVariantModel.findOne({
            subject: subjectId,
            class: classId,
            syllabus: syllabusId,
        }).lean();
        return SubjectVariantMapper.toDomain(found);
    }
    async save(entity) {
        if (!entity.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = SubjectVariantMapper.toPersistence(entity);
        const updated = await SubjectVariantModel.findByIdAndUpdate(entity.id, { $set: persistenceData }, { new: true }).lean();
        if (!updated) {
            throw new CustomError(ResponseMessages.SUBJECT_VARIANT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domain = SubjectVariantMapper.toDomain(updated);
        if (!domain) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domain;
    }
    async findAllForAdmin(allDoc) {
        const { query, page, limit, sort } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await SubjectVariantModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
        return documents
            .map(SubjectVariantMapper.toDomain)
            .filter((v) => v !== null);
    }
    async findAllWithPopulated(query) {
        const documents = await SubjectVariantModel.find(query)
            .populate("class", "_id name")
            .populate("syllabus", "_id name")
            .lean();
        return documents.map((item) => ({
            id: item._id.toString(),
            class: { id: item.class._id, name: item.class.name },
            syllabus: { id: item.syllabus._id, name: item.syllabus.name },
        }));
    }
    async countDocument(query) {
        return await SubjectVariantModel.countDocuments(query);
    }
    async delete(subjectId, variantId) {
        const result = await SubjectVariantModel.findOneAndDelete({
            _id: variantId,
            subject: subjectId,
        });
        if (!result) {
            throw new CustomError(ResponseMessages.SUBJECT_VARIANT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
    }
    async findOne(query) {
        const found = await SubjectVariantModel.findOne(query).lean();
        return SubjectVariantMapper.toDomain(found);
    }
    async findAllWithPopulatedSUbject(query) {
        const documents = await SubjectVariantModel.find(query)
            .populate("class", "_id name")
            .populate("syllabus", "_id name")
            .populate("subject", "_id name")
            .lean();
        return documents.map((item) => ({
            id: item._id.toString(),
            class: { id: item.class._id, name: item.class.name },
            syllabus: { id: item.syllabus._id, name: item.syllabus.name },
            subject: { id: item.subject._id, name: item.subject.name },
        }));
    }
    async findAllWithSubject(query) {
        const documents = await SubjectVariantModel.find(query)
            .populate("subject", "_id name")
            .lean();
        return documents.map((item) => ({
            id: item._id.toString(),
            subject: { id: item.subject._id, name: item.subject.name },
        }));
    }
    async findAllIds(query) {
        const document = await SubjectVariantModel.find(query, { _id: 1 });
        return document.map((item) => item._id.toString());
    }
}
//# sourceMappingURL=subject.variant.repository.js.map