import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { Blog } from "../entities/blog.entity.js";
import { BlogModel } from "../infrastructure/blog.schema.js";
import { BlogMapper } from "../mapper/blog.mapper.js";
export class BlogRepository {
    async create(blogEntity) {
        const persistenceData = BlogMapper.toPersistence(blogEntity);
        const created = await BlogModel.create(persistenceData);
        const domainBlog = BlogMapper.toDomain(created);
        if (!domainBlog) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainBlog;
    }
    async findById(id) {
        const foundDocument = await BlogModel.findOne({ _id: id }).lean();
        return BlogMapper.toDomain(foundDocument);
    }
    async findBySlug(slug) {
        const foundDocument = await BlogModel.findOne({ slug }).lean();
        return BlogMapper.toDomain(foundDocument);
    }
    async save(blogEntity) {
        if (!blogEntity.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = BlogMapper.toPersistence(blogEntity);
        const updatedDocument = await BlogModel.findByIdAndUpdate(blogEntity.id, { $set: persistenceData }, { new: true }).lean();
        if (!updatedDocument) {
            throw new CustomError(ResponseMessages.BLOG_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domainBlog = BlogMapper.toDomain(updatedDocument);
        if (!domainBlog) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainBlog;
    }
    async findAllForAdmin(allDoc) {
        const { query, page, limit, sort } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await BlogModel.find(query, {
            slug: 1,
            heading: 1,
            description: 1,
            author: 1,
            image: 1,
            priority: 1,
            topic: 1,
            isFeatured: 1,
            isDeleted: 1,
        })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
        return documents
            .map(BlogMapper.toListItem)
            .filter((b) => b !== null);
    }
    async findAllForUser() {
        const documents = await BlogModel.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .lean();
        return documents
            .map(BlogMapper.toDomain)
            .filter((b) => b !== null);
    }
    async countDocument(query) {
        return BlogModel.countDocuments(query);
    }
    async getActivePriorities(excludeId) {
        const query = { priority: { $ne: null } };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        const documents = await BlogModel.find(query)
            .select({ priority: 1, _id: 0 })
            .lean();
        return documents
            .map((doc) => doc.priority)
            .filter((p) => p !== null && p !== undefined);
    }
}
//# sourceMappingURL=blog.repository.js.map