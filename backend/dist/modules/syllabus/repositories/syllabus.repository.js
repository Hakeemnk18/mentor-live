import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { Syllabus } from "../entities/syllabus.entity.js";
import { SyllabusModel } from "../infrastructure/syllabus.schema.js";
import { SyllabusMapper } from "../mappers/syllabus.mapper.js";
export class SyllabusRepository {
    async create(syllabusEntity) {
        const persistenceData = SyllabusMapper.toPersistence(syllabusEntity);
        const created = await SyllabusModel.create(persistenceData);
        const domainSyllabus = SyllabusMapper.toDomain(created);
        if (!domainSyllabus) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainSyllabus;
    }
    async findById(id) {
        const foundDocument = await SyllabusModel.findOne({ _id: id }).lean();
        return SyllabusMapper.toDomain(foundDocument);
    }
    async findByName(name) {
        const foundDocument = await SyllabusModel.findOne({ name }).lean();
        return SyllabusMapper.toDomain(foundDocument);
    }
    async save(syllabusEntity) {
        if (!syllabusEntity.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = SyllabusMapper.toPersistence(syllabusEntity);
        const updatedDocument = await SyllabusModel.findByIdAndUpdate(syllabusEntity.id, { $set: persistenceData }, { new: true }).lean();
        if (!updatedDocument) {
            throw new CustomError(ResponseMessages.SYLLABUS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domainSyllabus = SyllabusMapper.toDomain(updatedDocument);
        if (!domainSyllabus) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainSyllabus;
    }
    async findAllForAdmin(allDoc) {
        const { query, page, limit, sort } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await SyllabusModel.find(query)
            .sort(sort)
            .collation({ locale: "en", strength: 1 })
            .skip(skip)
            .limit(limit)
            .lean();
        return documents
            .map(SyllabusMapper.toDomain)
            .filter((s) => s !== null);
    }
    async findAllForUser() {
        const documents = await SyllabusModel.find({ isDeleted: false })
            .select({ _id: 1, name: 1 })
            .lean();
        return documents.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name,
        }));
    }
    async countDocument(query) {
        return await SyllabusModel.countDocuments(query);
    }
}
//# sourceMappingURL=syllabus.repository.js.map