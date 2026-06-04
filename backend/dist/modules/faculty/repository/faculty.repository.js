import { Types } from "mongoose";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import { Faculty } from "../entities/faculty.entity.js";
import { FacultyModel } from "../infrastructure/faculty.schema.js";
import { FacultyMapper } from "../mapper/faculty.mapper.js";
const { ObjectId } = Types;
export class FacultyRepository {
    async create(facultyEntity) {
        const persistenceData = FacultyMapper.toPersistence(facultyEntity);
        const created = await FacultyModel.create(persistenceData);
        const domainFaculty = FacultyMapper.toDomain(created);
        if (!domainFaculty) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainFaculty;
    }
    async findById(id) {
        const foundDocument = await FacultyModel.findOne({ _id: id }).lean();
        return FacultyMapper.toDomain(foundDocument);
    }
    async findFacultyByQuery(query) {
        const foundDocument = await FacultyModel.findOne(query).lean();
        return FacultyMapper.toDomain(foundDocument);
    }
    async findByName(name) {
        const foundDocument = await FacultyModel.findOne({ name }).lean();
        return FacultyMapper.toDomain(foundDocument);
    }
    async save(facultyEntity) {
        if (!facultyEntity.id) {
            throw new CustomError(ResponseMessages.ID_MISSING, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const persistenceData = FacultyMapper.toPersistence(facultyEntity);
        const updatedDocument = await FacultyModel.findByIdAndUpdate(facultyEntity.id, { $set: persistenceData }, { new: true }).lean();
        if (!updatedDocument) {
            throw new CustomError(ResponseMessages.FACULTY_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
        const domainFaculty = FacultyMapper.toDomain(updatedDocument);
        if (!domainFaculty) {
            throw new CustomError(ResponseMessages.FAILED_TO_MAP, HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        return domainFaculty;
    }
    async addSlots(facultyId, slots) {
        await FacultyModel.updateOne({ _id: facultyId }, {
            $push: {
                slots: {
                    $each: slots.map((s) => ({
                        time: s.time,
                        isAvailable: true,
                        pool: [],
                        poolLimit: 5,
                    })),
                },
            },
        });
    }
    async addChapterSlots(facultyId, slots) {
        const { chapterSlots } = slots;
        await FacultyModel.updateOne({ _id: facultyId }, {
            $push: {
                chapterSlots: {
                    $each: chapterSlots.map((s) => ({
                        chapter: s.chapter,
                        isAvailable: true,
                        pool: [],
                        poolLimit: 5,
                    })),
                },
            },
        });
    }
    async findAllFacultyForAdmin(allDoc) {
        const { page, limit, classId, syllabusId, subjectId, search, sort, isDeleted, } = allDoc;
        const skip = (page - 1) * limit;
        const documents = await FacultyModel.aggregate([
            {
                $match: {
                    isDeleted: isDeleted,
                    ...(search && {
                        name: { $regex: search, $options: "i" },
                    }),
                },
            },
            { $unwind: "$subjectOffering" },
            {
                $lookup: {
                    from: "subjectvariants",
                    localField: "subjectOffering.variantId",
                    foreignField: "_id",
                    as: "sv",
                },
            },
            { $unwind: "$sv" },
            {
                $match: {
                    ...(classId && { "sv.class": new ObjectId(classId) }),
                    ...(syllabusId && { "sv.syllabus": new ObjectId(syllabusId) }),
                    ...(subjectId && { "sv.subject": new ObjectId(subjectId) }),
                },
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    image: { $first: "$image" },
                    qualifications: { $first: "$qualifications" },
                    demoClass: { $first: "$demoClass" },
                    description: { $first: "$description" },
                    createdAt: { $first: "$createdAt" },
                    isDeleted: { $first: "$isDeleted" },
                },
            },
            {
                $facet: {
                    data: [
                        { $sort: sort },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                name: 1,
                                image: 1,
                                qualifications: 1,
                                demoClass: 1,
                                description: 1,
                                createdAt: 1,
                                isDeleted: 1,
                            },
                        },
                    ],
                    totalCount: [{ $count: "count" }],
                },
            },
        ]);
        const data = documents[0]?.data ?? [];
        const total = documents[0]?.totalCount[0]?.count ?? 0;
        const faculties = data.map(FacultyMapper.toView);
        return { data: faculties, total };
    }
    async findFacultyFullByIdForAdmin(id) {
        if (!Types.ObjectId.isValid(id))
            return null;
        const doc = await FacultyModel.findOne({
            _id: new Types.ObjectId(id),
            isDeleted: false,
        })
            .populate({
            path: "subjectOffering.variantId",
            populate: [
                { path: "class", select: "name" },
                { path: "syllabus", select: "name" },
                { path: "subject", select: "name" },
            ],
        })
            .populate({
            path: "chapterSlots.chapter",
            select: "name",
        })
            .populate({
            path: "slots.pool",
            select: "_id",
        })
            .populate({
            path: "chapterSlots.pool",
            select: "_id",
        })
            .lean();
        if (!doc)
            return null;
        return {
            id: doc._id.toString(),
            name: doc.name,
            qualifications: doc.qualifications,
            description: doc.description,
            demoClass: doc.demoClass,
            image: doc.image,
            isDeleted: doc.isDeleted,
            slots: doc.slots.map((s) => ({
                id: s._id.toString(),
                time: s.time.toISOString().slice(11, 16),
                isAvailable: s.isAvailable,
                pool: s.pool.map((u) => ({ id: u._id.toString() })),
                poolLimit: s.poolLimit,
            })),
            chapterSlots: doc.chapterSlots.map((c) => ({
                id: c._id.toString(),
                isAvailable: c.isAvailable,
                chapter: {
                    id: c.chapter._id.toString(),
                    name: c.chapter.name,
                },
                pool: c.pool.map((u) => ({ id: u._id.toString() })),
                poolLimit: c.poolLimit,
            })),
            subjectOffering: doc.subjectOffering.map((so) => ({
                id: so.variantId._id.toString(),
                price: so.price,
                class: {
                    id: so.variantId.class._id.toString(),
                    name: so.variantId.class.name,
                },
                syllabus: {
                    id: so.variantId.syllabus._id.toString(),
                    name: so.variantId.syllabus.name,
                },
                subject: {
                    id: so.variantId.subject._id.toString(),
                    name: so.variantId.subject.name,
                },
            })),
        };
    }
    async findFacultyByChapter(dto) {
        const { chapterId, page, limit, search, sort } = dto;
        const skip = (page - 1) * limit;
        const filter = {
            isDeleted: false,
        };
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        if (chapterId) {
            filter["chapterSlots.chapter"] = chapterId;
        }
        const documents = await FacultyModel.find(filter)
            .sort(sort)
            .collation({ locale: "en", strength: 1 })
            .skip(skip)
            .limit(limit)
            .lean();
        return documents.map(FacultyMapper.toFacultyUserView);
    }
    async findFacultyByClassAndSyllabus(dto) {
        const { subjectVariantIds, page, limit, search, sort, subjectId } = dto;
        const skip = (page - 1) * limit;
        const variantObjectIds = subjectVariantIds.map((id) => new Types.ObjectId(id));
        const documents = await FacultyModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    ...(search && {
                        name: { $regex: search, $options: "i" },
                    }),
                    "subjectOffering.variantId": { $in: variantObjectIds },
                },
            },
            { $unwind: "$subjectOffering" },
            {
                $match: {
                    "subjectOffering.variantId": { $in: variantObjectIds },
                },
            },
            {
                $lookup: {
                    from: "subjectvariants",
                    localField: "subjectOffering.variantId",
                    foreignField: "_id",
                    as: "sv",
                },
            },
            { $unwind: "$sv" },
            {
                $match: {
                    ...(subjectId && { "sv.subject": new ObjectId(subjectId) }),
                },
            },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    name: 1,
                    price: "$subjectOffering.price",
                    image: 1,
                    qualifications: 1,
                    description: 1,
                    createdAt: 1,
                },
            },
        ]);
        return documents.map(FacultyMapper.toFacultyUserView);
    }
    async findFacultyFullByIdAndChapter(facultyId, chapterId) {
        const documents = await FacultyModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    _id: new ObjectId(facultyId),
                },
            },
            { $unwind: "$chapterSlots" },
            {
                $match: {
                    "chapterSlots.chapter": new ObjectId(chapterId),
                },
            },
            {
                $lookup: {
                    from: "chapters",
                    localField: "chapterSlots.chapter",
                    foreignField: "_id",
                    as: "chapter",
                },
            },
            { $unwind: "$chapter" },
            {
                $project: {
                    name: 1,
                    image: 1,
                    qualifications: 1,
                    demoClass: 1,
                    description: 1,
                    createdAt: 1,
                    chapterSlots: 1,
                    "chapter.name": 1,
                    "chapter.price": 1,
                },
            },
        ]);
        const doc = documents?.[0];
        if (!doc)
            return null;
        return {
            id: doc._id.toString(),
            name: doc.name,
            qualifications: doc.qualifications,
            description: doc.description,
            demoClass: doc.demoClass,
            image: doc.image.url,
            price: doc.chapter.price,
            slot: {
                id: doc.chapterSlots._id.toString(),
                isAvailable: doc.chapterSlots.isAvailable,
                chapter: { id: doc.chapterSlots.chapter, name: doc.chapter.name },
                pool: doc.chapterSlots.pool,
                poolLimit: doc.chapterSlots.poolLimit,
            },
        };
    }
    async findFacultyFullByIdAndSlot(facultyId, slotId, variantId) {
        const priceExpr = variantId
            ? {
                $let: {
                    vars: {
                        matched: {
                            $filter: {
                                input: "$subjectOffering",
                                as: "so",
                                cond: {
                                    $eq: ["$$so.variantId", new ObjectId(variantId)],
                                },
                            },
                        },
                    },
                    in: {
                        $ifNull: [{ $arrayElemAt: ["$$matched.price", 0] }, 0],
                    },
                },
            }
            : { $ifNull: [{ $arrayElemAt: ["$subjectOffering.price", 0] }, 0] };
        const documents = await FacultyModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    _id: new ObjectId(facultyId),
                },
            },
            { $unwind: "$slots" },
            {
                $match: {
                    "slots._id": new ObjectId(slotId),
                },
            },
            {
                $project: {
                    name: 1,
                    price: priceExpr,
                    image: 1,
                    qualifications: 1,
                    demoClass: 1,
                    description: 1,
                    createdAt: 1,
                    slots: 1,
                },
            },
        ]);
        const doc = documents?.[0];
        if (!doc)
            return null;
        return FacultyMapper.toFacultyWithSlotToUserView(doc);
    }
    async findFacultyByIdWithFirstSlot(facultyId, variantId) {
        const priceExpr = variantId
            ? {
                $let: {
                    vars: {
                        matched: {
                            $filter: {
                                input: "$subjectOffering",
                                as: "so",
                                cond: {
                                    $eq: ["$$so.variantId", new ObjectId(variantId)],
                                },
                            },
                        },
                    },
                    in: {
                        $ifNull: [{ $arrayElemAt: ["$$matched.price", 0] }, 0],
                    },
                },
            }
            : { $ifNull: [{ $arrayElemAt: ["$subjectOffering.price", 0] }, 0] };
        const documents = await FacultyModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    _id: new ObjectId(facultyId),
                },
            },
            { $unwind: "$slots" },
            {
                $project: {
                    name: 1,
                    price: priceExpr,
                    image: 1,
                    qualifications: 1,
                    demoClass: 1,
                    description: 1,
                    createdAt: 1,
                    slots: 1,
                },
            },
            { $limit: 1 },
        ]);
        const doc = documents?.[0];
        if (!doc)
            return null;
        return FacultyMapper.toFacultyWithSlotToUserView(doc);
    }
    async getSlot(facultyId, slotId) {
        const faculty = await FacultyModel.findOne({ _id: facultyId, isDeleted: false }, { slots: { $elemMatch: { _id: new Types.ObjectId(slotId) } } }).lean();
        if (!faculty || !faculty.slots || faculty.slots.length === 0) {
            return null;
        }
        const slot = faculty.slots[0];
        return {
            id: slot._id.toString(),
            time: slot.time,
            isAvailable: slot.isAvailable,
            pool: slot.pool.map((u) => u.toString()),
            poolLimit: slot.poolLimit,
        };
    }
    async getChapterSlot(facultyId, chapterId) {
        const faculty = await FacultyModel.findOne({ _id: facultyId, isDeleted: false }, {
            chapterSlots: {
                $elemMatch: {
                    chapter: new Types.ObjectId(chapterId),
                    isAvailable: true,
                },
            },
        }).lean();
        if (!faculty ||
            !faculty.chapterSlots ||
            faculty.chapterSlots.length === 0) {
            return null;
        }
        const slot = faculty.chapterSlots[0];
        return {
            id: slot._id.toString(),
            chapterId: slot.chapter,
            isAvailable: slot.isAvailable,
            pool: slot.pool.map((u) => u.toString()),
            poolLimit: slot.poolLimit,
        };
    }
    async addToSlotPool(facultyId, slotId, studentId) {
        const result = await FacultyModel.updateOne({
            _id: facultyId,
            isDeleted: false,
            "slots._id": new Types.ObjectId(slotId),
            "slots.isAvailable": true,
        }, [
            {
                $set: {
                    slots: {
                        $map: {
                            input: "$slots",
                            as: "slot",
                            in: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: ["$$slot._id", new Types.ObjectId(slotId)],
                                            },
                                            {
                                                $lt: [{ $size: "$$slot.pool" }, "$$slot.poolLimit"],
                                            },
                                        ],
                                    },
                                    {
                                        $mergeObjects: [
                                            "$$slot",
                                            {
                                                pool: {
                                                    $setUnion: [
                                                        "$$slot.pool",
                                                        [new Types.ObjectId(studentId)],
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                    "$$slot",
                                ],
                            },
                        },
                    },
                },
            },
        ], {
            updatePipeline: true,
        });
        if (result.matchedCount === 0) {
            throw new CustomError(ResponseMessages.SLOT_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
        }
    }
    async addToChapterSlotPool(facultyId, chapterSlotId, studentId) {
        const result = await FacultyModel.updateOne({
            _id: facultyId,
            isDeleted: false,
            "chapterSlots._id": chapterSlotId,
            "chapterSlots.isAvailable": true,
        }, [
            {
                $set: {
                    chapterSlots: {
                        $map: {
                            input: "$chapterSlots",
                            as: "slot",
                            in: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$$slot._id",
                                                    new Types.ObjectId(chapterSlotId),
                                                ],
                                            },
                                            { $lt: [{ $size: "$$slot.pool" }, "$$slot.poolLimit"] },
                                        ],
                                    },
                                    {
                                        $mergeObjects: [
                                            "$$slot",
                                            {
                                                pool: {
                                                    $setUnion: [
                                                        "$$slot.pool",
                                                        [new Types.ObjectId(studentId)],
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                    "$$slot",
                                ],
                            },
                        },
                    },
                },
            },
        ], {
            updatePipeline: true,
        });
        if (result.matchedCount === 0) {
            throw new CustomError(ResponseMessages.SLOT_NOT_FOUND, HttpStatusCode.BAD_REQUEST);
        }
    }
    async consumeSlot(facultyId, slotId, session) {
        const result = await FacultyModel.updateOne({
            _id: new ObjectId(facultyId),
            slots: {
                $elemMatch: {
                    _id: new ObjectId(slotId),
                    isAvailable: true,
                },
            },
        }, {
            $set: {
                "slots.$.isAvailable": false,
                "slots.$.pool": [],
            },
        }, session ? { session } : undefined);
        if (result.modifiedCount === 0) {
            throw new Error("not matched document");
        }
    }
    async consumeSlots(facultyId, slotIds, session) {
        const result = await FacultyModel.updateOne({
            _id: facultyId,
            "slots._id": { $in: slotIds },
            "slots.isAvailable": true,
        }, {
            $set: {
                "slots.$[s].isAvailable": false,
                "slots.$[s].pool": [],
            },
        }, {
            arrayFilters: [
                {
                    "s._id": { $in: slotIds },
                    "s.isAvailable": true,
                },
            ],
            ...(session ? { session } : {}),
        });
        if (result.modifiedCount === 0) {
            throw new Error("not matched document");
        }
    }
    async getAllSlots(facultyId) {
        const faculty = await FacultyModel.findOne({ _id: facultyId, isDeleted: false }, { slots: 1 }).lean();
        if (!faculty || !faculty.slots || faculty.slots.length === 0) {
            return [];
        }
        return faculty.slots.map((slot) => ({
            id: slot._id.toString(),
            time: slot.time,
            isAvailable: slot.isAvailable,
            pool: slot.pool.map((u) => u.toString()),
            poolLimit: slot.poolLimit,
        }));
    }
    async consumeChapterSlot(facultyId, chapterId, session) {
        const result = await FacultyModel.updateOne({
            _id: new ObjectId(facultyId),
            chapterSlots: {
                $elemMatch: {
                    chapter: new ObjectId(chapterId),
                },
            },
        }, {
            $set: {
                "chapterSlots.$[s].pool": [],
            },
        }, {
            arrayFilters: [
                {
                    "s.chapter": new ObjectId(chapterId),
                    "s.isAvailable": true,
                },
            ],
            session,
        });
        if (result.modifiedCount === 0) {
            throw new CustomError(ResponseMessages.CHAPTER_SLOT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }
    }
    async removeUserFromPool(params, session) {
        const { facultyId, userId, mode } = params;
        let updateQuery;
        let arrayFilters = [];
        if (mode === "chapter") {
            updateQuery = {
                $pull: {
                    "chapterSlots.$[c].pool": userId,
                },
            };
            arrayFilters = [{ "c.chapter": new Types.ObjectId(params.chapterId) }];
        }
        if (mode === "slot") {
            updateQuery = {
                $pull: {
                    "slots.$[s].pool": userId,
                },
            };
            arrayFilters = [{ "s._id": new Types.ObjectId(params.slotId) }];
        }
        const result = await FacultyModel.updateOne({ _id: facultyId }, updateQuery, {
            arrayFilters,
            session,
        });
        if (result.matchedCount === 0) {
            throw new Error("Faculty not found");
        }
    }
    async setSlotAvailability(params) {
        const { facultyId, mode, isAvailable } = params;
        let updateQuery;
        let arrayFilters = [];
        if (mode === "slot") {
            if (!params.slotId) {
                throw new Error("slotId is required for slot mode");
            }
            updateQuery = {
                $set: {
                    "slots.$[s].isAvailable": isAvailable,
                },
            };
            arrayFilters = [{ "s._id": new Types.ObjectId(params.slotId) }];
        }
        if (mode === "chapter") {
            if (!params.chapterId) {
                throw new Error("chapterId is required for chapter mode");
            }
            updateQuery = {
                $set: {
                    "chapterSlots.$[c].isAvailable": isAvailable,
                },
            };
            arrayFilters = [{ "c.chapter": new Types.ObjectId(params.chapterId) }];
        }
        const result = await FacultyModel.updateOne({ _id: facultyId }, updateQuery, { arrayFilters });
        if (result.matchedCount === 0) {
            throw new Error("Faculty not found");
        }
    }
    async getAllAvailableSlots(facultyId) {
        const faculty = await FacultyModel.findOne({ _id: facultyId, isDeleted: false }, { slots: 1 }).lean();
        if (!faculty || !faculty.slots || faculty.slots.length === 0) {
            return [];
        }
        return faculty.slots.map((slot) => ({
            id: slot._id.toString(),
            time: slot.time,
        }));
    }
    async getFacultyCountInRange(startDate, endDate) {
        return FacultyModel.countDocuments({
            isDeleted: false,
            createdAt: { $gte: startDate, $lte: endDate },
        });
    }
    async getDailyFacultyKpiStats(startDate, endDate) {
        return FacultyModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
    }
}
//# sourceMappingURL=faculty.repository.js.map