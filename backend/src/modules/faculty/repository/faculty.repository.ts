import { Types, type ClientSession } from "mongoose";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { AcademicListFiltersBase } from "../../../core/shared/type/find.all.with.filters.js";
import { Faculty } from "../entities/faculty.entity.js";
import { FacultyModel } from "../infrastructure/faculty.schema.js";
import { FacultySlotModel } from "../../faculty-slot/infrastructure/faculty.slot.schema.js";
import { FacultySlotMapper } from "../../faculty-slot/mapper/faculty.slot.mapper.js";
import { FacultyMapper } from "../mapper/faculty.mapper.js";
import type { IFacultyRepository } from "./faculty.repository.interface.js";
import type {
  ChapterSlotProps,
  FacultyChapterSearchFilters,
  FacultyClassAndSyllabusSearchFilters,
  FacultyDetailsViewForUser,
  FacultyFullAdminView,
  FacultyPopulatedLean,
  FacultyView,
  FacultyViewForUser,
  FeaturedFacultyView,
} from "../types/faculty.type.js";
import type { AddChapterSlotRequestDto } from "../dtos/add.chapter.dto.js";
import type { RemoveUserFromPoolDto } from "../../booking/dto/remove.student.from.pooling.dto.js";

const { ObjectId } = Types;

export class FacultyRepository implements IFacultyRepository {
  /* ─── CRUD ─────────────────────────────────────────────────────────── */

  async create(facultyEntity: Faculty): Promise<Faculty> {
    const persistenceData = FacultyMapper.toPersistence(facultyEntity);

    const created = await FacultyModel.create(persistenceData);

    const domainFaculty = FacultyMapper.toDomain(created);
    if (!domainFaculty) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domainFaculty;
  }

  async findById(id: string): Promise<Faculty | null> {
    const foundDocument = await FacultyModel.findOne({ _id: id }).lean();
    return FacultyMapper.toDomain(foundDocument);
  }

  async findFacultyByQuery(
    query: Record<string, any>,
  ): Promise<Faculty | null> {
    const foundDocument = await FacultyModel.findOne(query).lean();
    return FacultyMapper.toDomain(foundDocument);
  }

  async findByName(name: string): Promise<Faculty | null> {
    const foundDocument = await FacultyModel.findOne({ name }).lean();
    return FacultyMapper.toDomain(foundDocument);
  }

  async save(facultyEntity: Faculty): Promise<Faculty> {
    if (!facultyEntity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const persistenceData = FacultyMapper.toPersistence(facultyEntity);

    const updatedDocument = await FacultyModel.findByIdAndUpdate(
      facultyEntity.id,
      { $set: persistenceData },
      { new: true },
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.FACULTY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const domainFaculty = FacultyMapper.toDomain(updatedDocument);
    if (!domainFaculty) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domainFaculty;
  }

  /* ─── Admin listing ────────────────────────────────────────────────── */

  async findAllFacultyForAdmin(
    allDoc: AcademicListFiltersBase,
  ): Promise<{ data: FacultyView[]; total: number }> {
    const {
      page,
      limit,
      classId,
      syllabusId,
      subjectId,
      search,
      sort,
      isDeleted,
    } = allDoc;
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

  /* ─── Admin full detail (with slots from FacultySlot collection) ──── */

  async findFacultyFullByIdForAdmin(
    id: string,
  ): Promise<FacultyFullAdminView | null> {
    if (!Types.ObjectId.isValid(id)) return null;

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
        path: "chapterSlots.pool",
        select: "_id",
      })
      .lean<FacultyPopulatedLean>();

    if (!doc) return null;

    /* Fetch time-based slots from the separate collection */
    const slotDocs = await FacultySlotModel.find({
      facultyId: new Types.ObjectId(id),
    })
      .populate({ path: "pool", select: "_id" })
      .sort({ variantId: 1, time: 1 })
      .lean();

    return {
      id: doc._id.toString(),
      name: doc.name,
      qualifications: doc.qualifications,
      description: doc.description,
      demoClass: doc.demoClass,
      image: doc.image,
      isDeleted: doc.isDeleted,
      isFeatured: doc.isFeatured ?? false,

      /* slots from FacultySlot collection */
      slots: slotDocs.map(FacultySlotMapper.toAdminView),

      chapterSlots: doc.chapterSlots.map((c) => ({
        id: c._id.toString(),
        isAvailable: c.isAvailable,
        chapter: {
          id: c.chapter._id.toString(),
          name: c.chapter.name,
        },
        pool: c.pool.map((u: any) => ({ id: u._id.toString() })),
        poolLimit: c.poolLimit,
      })),

      subjectOffering: doc.subjectOffering.map((so: any) => ({
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

  /* ─── User-facing faculty searches ─────────────────────────────────── */

  async findFacultyByChapter(
    dto: FacultyChapterSearchFilters,
  ): Promise<FacultyViewForUser[]> {
    const { chapterId, page, limit, search, sort } = dto;

    const skip = (page - 1) * limit;
    const filter: Record<string, any> = {
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

  async findFacultyByClassAndSyllabus(
    dto: FacultyClassAndSyllabusSearchFilters,
  ): Promise<FacultyViewForUser[]> {
    const { subjectVariantIds, page, limit, search, sort, subjectId } = dto;
    const skip = (page - 1) * limit;

    const variantObjectIds = subjectVariantIds.map(
      (id) => new Types.ObjectId(id),
    );

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
          // subjectId here is the SubjectVariant _id sent by the listing page —
          // match against sv._id directly, NOT sv.subject
          ...(subjectId && { "sv._id": new ObjectId(subjectId) }),
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

  /* ─── Faculty detail + chapter slot (user-facing) ──────────────────── */

  async findFacultyFullByIdAndChapter(
    facultyId: string,
    chapterId: string,
  ): Promise<FacultyDetailsViewForUser | null> {
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
    if (!doc) return null;

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

  /* ─── Faculty detail + time-based slot (user-facing) ───────────────── */

  async findFacultyWithSlot(
    facultyId: string,
    slotId: string,
    variantId: string,
  ): Promise<FacultyDetailsViewForUser | null> {
    /* Two separate queries — Faculty for profile, FacultySlot for slot data */
    const [faculty, slot] = await Promise.all([
      FacultyModel.findOne({
        _id: new ObjectId(facultyId),
        isDeleted: false,
      }).lean(),
      FacultySlotModel.findById(slotId)
        .populate({ path: "pool", select: "_id" })
        .lean() as any,
    ]);

    if (!faculty || !slot) return null;

    const offering = (faculty.subjectOffering as any[]).find(
      (so: any) => so.variantId.toString() === variantId,
    );
    const price = offering?.price ?? 0;

    return FacultyMapper.toFacultyWithSlotToUserView({
      ...faculty,
      price,
      slot,
    });
  }

  async findFacultyWithFirstAvailableSlot(
    facultyId: string,
    variantId: string,
  ): Promise<FacultyDetailsViewForUser | null> {
    const [faculty, slot] = await Promise.all([
      FacultyModel.findOne({
        _id: new ObjectId(facultyId),
        isDeleted: false,
      }).lean(),
      FacultySlotModel.findOne({
        facultyId: new ObjectId(facultyId),
        variantId: new ObjectId(variantId),
        isAvailable: true,
      })
        .sort({ time: 1 })
        .populate({ path: "pool", select: "_id" })
        .lean() as any,
    ]);

    if (!faculty || !slot) return null;

    const offering = (faculty.subjectOffering as any[]).find(
      (so: any) => so.variantId.toString() === variantId,
    );
    const price = offering?.price ?? 0;

    return FacultyMapper.toFacultyWithSlotToUserView({
      ...faculty,
      price,
      slot,
    });
  }

  /* ─── Public profile (user-facing, no slot context needed) ────────── */

  async findFacultyPublicProfile(
    id: string,
    classId?: string,
    syllabusId?: string,
  ): Promise<import("../types/faculty.type.js").FacultyPublicProfileView | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const pipeline: any[] = [
      { $match: { _id: new ObjectId(id), isDeleted: false } },
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
      // optional class+syllabus filter
      ...(classId || syllabusId
        ? [
            {
              $match: {
                ...(classId && { "sv.class": new ObjectId(classId) }),
                ...(syllabusId && { "sv.syllabus": new ObjectId(syllabusId) }),
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: "classes",
          localField: "sv.class",
          foreignField: "_id",
          as: "classDoc",
        },
      },
      { $unwind: "$classDoc" },
      {
        $lookup: {
          from: "syllabuses",
          localField: "sv.syllabus",
          foreignField: "_id",
          as: "syllabusDoc",
        },
      },
      { $unwind: "$syllabusDoc" },
      {
        $lookup: {
          from: "subjects",
          localField: "sv.subject",
          foreignField: "_id",
          as: "subjectDoc",
        },
      },
      { $unwind: "$subjectDoc" },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          qualifications: { $first: "$qualifications" },
          description: { $first: "$description" },
          demoClass: { $first: "$demoClass" },
          image: { $first: "$image" },
          subjectOffering: {
            $push: {
              variantId: { $toString: "$sv._id" },
              subjectName: "$subjectDoc.name",
              className: "$classDoc.name",
              syllabusName: "$syllabusDoc.name",
              price: "$subjectOffering.price",
            },
          },
        },
      },
    ];

    const result = await FacultyModel.aggregate(pipeline);
    const doc = result[0];
    if (!doc) return null;

    return {
      id: doc._id.toString(),
      name: doc.name,
      qualifications: doc.qualifications ?? [],
      description: doc.description ?? "",
      demoClass: doc.demoClass ?? "",
      image: (doc.image as any)?.url ?? "",
      subjectOffering: doc.subjectOffering ?? [],
    };
  }

  /* ─── Chapter slot helpers ──────────────────────────────────────────── */

  async getChapterSlot(
    facultyId: string,
    chapterId: string,
  ): Promise<ChapterSlotProps | null> {
    const faculty = await FacultyModel.findOne(
      { _id: facultyId, isDeleted: false },
      {
        chapterSlots: {
          $elemMatch: {
            chapter: new Types.ObjectId(chapterId),
            isAvailable: true,
          },
        },
      },
    ).lean();

    if (
      !faculty ||
      !faculty.chapterSlots ||
      faculty.chapterSlots.length === 0
    ) {
      return null;
    }

    const slot = faculty.chapterSlots[0] as {
      _id: any;
      chapter: any;
      isAvailable: boolean;
      pool: any[];
      poolLimit: number;
    };

    return {
      id: slot._id.toString(),
      chapterId: slot.chapter,
      isAvailable: slot.isAvailable,
      pool: slot.pool.map((u) => u.toString()),
      poolLimit: slot.poolLimit,
    };
  }

  async addToChapterSlotPool(
    facultyId: string,
    chapterSlotId: string,
    studentId: string,
    session?: ClientSession,
  ): Promise<void> {
    const result = await FacultyModel.updateOne(
      {
        _id: facultyId,
        isDeleted: false,
        /*
         * Atomic capacity check: only match if the target chapter slot exists,
         * is available, AND still has room in its pool. Doing this inside the
         * match filter (instead of only inside the $map below) guarantees
         * `matchedCount === 0` reliably signals "couldn't add" — including the
         * "pool is already full" case — closing a race condition where two
         * concurrent requests could both pass validation and create a booking,
         * but only the document update would silently no-op for the loser.
         */
        $expr: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: "$chapterSlots",
                  as: "slot",
                  cond: {
                    $and: [
                      { $eq: ["$$slot._id", new Types.ObjectId(chapterSlotId)] },
                      { $eq: ["$$slot.isAvailable", true] },
                      { $lt: [{ $size: "$$slot.pool" }, "$$slot.poolLimit"] },
                    ],
                  },
                },
              },
            },
            0,
          ],
        },
      },
      [
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
      ],
      { updatePipeline: true, ...(session ? { session } : {}) },
    );

    if (result.matchedCount === 0) {
      throw new CustomError(
        ResponseMessages.POOL_ALREADY_FULL,
        HttpStatusCode.BAD_REQUEST,
      );
    }
  }

  async addChapterSlots(
    facultyId: string,
    slots: AddChapterSlotRequestDto,
  ): Promise<void> {
    const { chapterSlots } = slots;
    await FacultyModel.updateOne(
      { _id: facultyId },
      {
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
      },
    );
  }

  async consumeChapterSlot(
    facultyId: string,
    chapterId: string,
    session: ClientSession,
  ): Promise<void> {
    const result = await FacultyModel.updateOne(
      {
        _id: new ObjectId(facultyId),
        chapterSlots: {
          $elemMatch: {
            chapter: new ObjectId(chapterId),
          },
        },
      },
      {
        $set: {
          "chapterSlots.$[s].pool": [],
        },
      },
      {
        arrayFilters: [
          {
            "s.chapter": new ObjectId(chapterId),
            "s.isAvailable": true,
          },
        ],
        session,
      },
    );

    if (result.modifiedCount === 0) {
      throw new CustomError(
        ResponseMessages.CHAPTER_SLOT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }
  }

  async removeUserFromPool(
    params: RemoveUserFromPoolDto,
    session: ClientSession,
  ): Promise<void> {
    /* Only chapter-mode pool removal stays in Faculty repo.
       Slot-mode pool removal is now handled by FacultySlotRepository. */
    if (params.mode !== "chapter") {
      throw new CustomError(
        "removeUserFromPool on FacultyRepository only supports chapter mode",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const result = await FacultyModel.updateOne(
      { _id: params.facultyId },
      {
        $pull: {
          "chapterSlots.$[c].pool": params.userId,
        },
      },
      {
        arrayFilters: [{ "c.chapter": new Types.ObjectId(params.chapterId) }],
        session,
      },
    );

    if (result.matchedCount === 0) {
      throw new Error("Faculty not found");
    }
  }

  async setChapterSlotAvailability(
    facultyId: string,
    chapterId: string,
    isAvailable: boolean,
  ): Promise<void> {
    const result = await FacultyModel.updateOne(
      { _id: facultyId },
      {
        $set: {
          "chapterSlots.$[c].isAvailable": isAvailable,
        },
      },
      {
        arrayFilters: [{ "c.chapter": new Types.ObjectId(chapterId) }],
      },
    );

    if (result.matchedCount === 0) {
      throw new Error("Faculty not found");
    }
  }

  /* ─── Featured faculty ──────────────────────────────────────────────── */

  async countFeatured(excludeId?: string): Promise<number> {
    const filter: Record<string, any> = {
      isFeatured: true,
      isDeleted: false,
    };

    if (excludeId) {
      filter._id = { $ne: new Types.ObjectId(excludeId) };
    }

    return FacultyModel.countDocuments(filter);
  }

  async findFeatured(limit: number): Promise<FeaturedFacultyView[]> {
    const documents = await FacultyModel.find({
      isFeatured: true,
      isDeleted: false,
    })
      .select("_id name qualifications description image")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    return documents.map(FacultyMapper.toFeaturedView);
  }

  /* ─── KPI / analytics ───────────────────────────────────────────────── */

  async getFacultyCountInRange(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return FacultyModel.countDocuments({
      isDeleted: false,
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }

  async getDailyFacultyKpiStats(
    startDate: Date,
    endDate: Date,
  ): Promise<{ _id: string; count: number }[]> {
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
