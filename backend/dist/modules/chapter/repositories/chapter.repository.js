import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { Types } from "mongoose";
import { Chapter } from "../entities/chapter.entity.js";
import { ChapterModel } from "../infrastructure/chapter.schema.js";
import { ChapterMapper } from "../mapper/chapter.mapper.js";
const { ObjectId } = Types;
export class ChapterRepository {
    async create(chapterEntity) {
        const persistenceData = ChapterMapper.toPersistence(chapterEntity);
        const created = await ChapterModel.create(persistenceData);
        const domainChapter = ChapterMapper.toDomain(created);
        if (!domainChapter) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainChapter;
    }
    async findById(id) {
        const foundDocument = await ChapterModel.findOne({ _id: id }).lean();
        return ChapterMapper.toDomain(foundDocument);
    }
    async findByNameAndVariant(name, subjectVariant) {
        const foundDocument = await ChapterModel.findOne({
            name,
            subjectVariant,
        }).lean();
        return ChapterMapper.toDomain(foundDocument);
    }
    async save(chapterEntity) {
        if (!chapterEntity.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = ChapterMapper.toPersistence(chapterEntity);
        const updatedDocument = await ChapterModel.findByIdAndUpdate(chapterEntity.id, { $set: persistenceData }, { new: true }).lean();
        if (!updatedDocument) {
            throw new CustomError(ResponseMessages.CHAPTER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domainChapter = ChapterMapper.toDomain(updatedDocument);
        if (!domainChapter) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainChapter;
    }
    async findAllForAdmin(allDoc) {
        const { query, page, limit, sort } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await ChapterModel.find(query)
            .sort(sort)
            .collation({ locale: "en", strength: 1 })
            .skip(skip)
            .limit(limit)
            .lean();
        return documents
            .map(ChapterMapper.toDomain)
            .filter((c) => c !== null);
    }
    async findAllForUser(allDoc) {
        const { page, limit, classId, syllabusId, subjectId, search, sort } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await ChapterModel.aggregate([
            {
                $lookup: {
                    from: "subjectvariants",
                    localField: "subjectVariant",
                    foreignField: "_id",
                    as: "sv",
                },
            },
            { $unwind: "$sv" },
            {
                $match: {
                    "sv.class": new ObjectId(classId),
                    "sv.syllabus": new ObjectId(syllabusId),
                    ...(subjectId && { "sv.subject": new ObjectId(subjectId) }),
                    ...(search && { name: { $regex: `^${search}`, $options: "i" } }),
                    isDeleted: false,
                },
            },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    name: 1,
                    price: 1,
                    icon: 1,
                },
            },
        ]);
        return documents.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name,
            price: doc.price,
            icon: doc.icon,
        }));
    }
    async countDocument(query) {
        return await ChapterModel.countDocuments(query);
    }
    async findAllNames() {
        const documents = await ChapterModel.find({ isDeleted: false }).select({
            name: 1,
        }).lean();
        return documents.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name,
        }));
    }
}
//# sourceMappingURL=chapter.repository.js.map