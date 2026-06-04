import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { Banner } from "../entities/banner.entity.js";
import { BannerModel } from "../infrastructure/banner.schema.js";
import { BannerMapper } from "../mapper/banner.mapper.js";
export class BannerRepository {
    async create(bannerEntity) {
        const persistenceData = BannerMapper.toPersistence(bannerEntity);
        const created = await BannerModel.create(persistenceData);
        const domainBanner = BannerMapper.toDomain(created);
        if (!domainBanner) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainBanner;
    }
    async findById(id) {
        const foundDocument = await BannerModel.findOne({ _id: id }).lean();
        return BannerMapper.toDomain(foundDocument);
    }
    async save(bannerEntity) {
        if (!bannerEntity.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = BannerMapper.toPersistence(bannerEntity);
        const updatedDocument = await BannerModel.findByIdAndUpdate(bannerEntity.id, { $set: persistenceData }, { new: true }).lean();
        if (!updatedDocument) {
            throw new CustomError(ResponseMessages.BANNER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domainBanner = BannerMapper.toDomain(updatedDocument);
        if (!domainBanner) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainBanner;
    }
    async findAllForAdmin(allDoc) {
        const { query, page, limit, sort } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await BannerModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
        return documents
            .map(BannerMapper.toDomain)
            .filter((b) => b !== null);
    }
    /* Only isShow=true banners, sorted by priority, max 5 for user display */
    async findAllForUser() {
        const documents = await BannerModel.find({ isShow: true })
            .sort({ priority: 1 })
            .limit(5)
            .lean();
        return documents
            .map(BannerMapper.toDomain)
            .filter((b) => b !== null);
    }
    async countDocument(query) {
        return BannerModel.countDocuments(query);
    }
    async deleteById(id) {
        const deleted = await BannerModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new CustomError(ResponseMessages.BANNER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
    }
    /* Only priorities already taken by isShow=true banners */
    async getActivePriorities(excludeId) {
        const query = { isShow: true, priority: { $ne: null } };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        const documents = await BannerModel.find(query)
            .select({ priority: 1, _id: 0 })
            .lean();
        return documents
            .map((doc) => doc.priority)
            .filter((p) => p !== null);
    }
}
//# sourceMappingURL=banner.repository.js.map