import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { Class } from "../entities/class.entity.js";
import { ClassModel } from "../infrastructure/class.schema.js";
import { ClassMapper } from "../mappers/class.mapper.js";
export class ClassRepository {
    async create(classEntity) {
        const persistenceData = ClassMapper.toPersistence(classEntity);
        const created = await ClassModel.create(persistenceData);
        const domainClass = ClassMapper.toDomain(created);
        if (!domainClass) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainClass;
    }
    async findById(id) {
        const foundDocument = await ClassModel.findOne({ _id: id }).lean();
        return ClassMapper.toDomain(foundDocument);
    }
    async findByName(name) {
        const foundDocument = await ClassModel.findOne({ name }).lean();
        return ClassMapper.toDomain(foundDocument);
    }
    async save(classEntity) {
        if (!classEntity.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = ClassMapper.toPersistence(classEntity);
        const updatedDocument = await ClassModel.findByIdAndUpdate(classEntity.id, { $set: persistenceData }, { new: true }).lean();
        if (!updatedDocument) {
            throw new CustomError(ResponseMessages.CLASS_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domainClass = ClassMapper.toDomain(updatedDocument);
        if (!domainClass) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainClass;
    }
    async findAllForAdmin(allDoc) {
        const { query, page, limit, sort } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await ClassModel.find(query)
            .sort(sort)
            .collation({ locale: "en", strength: 1 })
            .skip(skip)
            .limit(limit)
            .lean();
        return documents
            .map(ClassMapper.toDomain)
            .filter((c) => c !== null);
    }
    async findAllForUser() {
        const documents = await ClassModel.find({ isDeleted: false })
            .select({ _id: 1, name: 1 })
            .lean();
        return documents.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name,
        }));
    }
    async countDocument(query) {
        return await ClassModel.countDocuments(query);
    }
}
//# sourceMappingURL=class.repository.js.map