import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { Lead } from "../entities/lead.entity.js";
import { LeadModel } from "../infrastructure/lead.schema.js";
import { LeadMapper } from "../mapper/lead.mapper.js";
export class LeadRepository {
    async create(lead) {
        const persistenceData = LeadMapper.toPersistence(lead);
        const created = await LeadModel.create(persistenceData);
        const domain = LeadMapper.toDomain(created);
        if (!domain) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domain;
    }
    async findById(id) {
        const doc = await LeadModel.findOne({ _id: id }).lean();
        return LeadMapper.toDomain(doc);
    }
    async save(lead) {
        if (!lead.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = LeadMapper.toPersistence(lead);
        const updated = await LeadModel.findByIdAndUpdate(lead.id, { $set: persistenceData }, { new: true }).lean();
        if (!updated) {
            throw new CustomError("Lead not found", HttpStatusCode.NOT_FOUND);
        }
        const domain = LeadMapper.toDomain(updated);
        if (!domain) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domain;
    }
    async findAllForAdmin(allDoc) {
        const { query, page, limit, sort } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await LeadModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
        return documents
            .map(LeadMapper.toListItem)
            .filter((l) => l !== null);
    }
    async countDocument(query) {
        return LeadModel.countDocuments(query);
    }
}
//# sourceMappingURL=lead.repository.js.map