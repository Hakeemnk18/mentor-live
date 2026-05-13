import { Types, type ClientSession } from "mongoose";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { AcademicListFiltersBase } from "../../../core/shared/type/find.all.with.filters.js";
import { Faculty } from "../entities/faculty.entity.js";
import { FacultyModel } from "../infrastructure/faculty.schema.js";
import { FacultyMapper } from "../mapper/faculty.mapper.js";
import type { IFacultyRepository } from "./faculty.repository.interface.js";
import type {
  AvailableSlots,
  ChapterSlotProps,
  FacultyChapterSearchFilters,
  FacultyClassAndSyllabusSearchFilters,
  FacultyDetailsViewForUser,
  FacultyFullAdminView,
  FacultyPopulatedLean,
  FacultyView,
  FacultyViewForUser,
  SetSlotAvailabilityDto,
  SlotProps,
} from "../types/faculty.type.js";
import { _null } from "zod/v4/core";
import type { AddChapterSlotRequestDto } from "../dtos/add.chapter.dto.js";
import type { RemoveUserFromPoolDto } from "../../booking/dto/remove.student.from.pooling.dto.js";

const { ObjectId } = Types;

export class FacultyRepository implements IFacultyRepository {
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

  async addSlots(facultyId: string, slots: { time: Date }[]): Promise<void> {
    await FacultyModel.updateOne(
      { _id: facultyId },
      {
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
      },
    );
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
          localField: "subjectOffering",
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
          price: { $first: "$price" },
          image: { $first: "$image" },
          qualifications: { $first: "$qualifications" },
          demoClass: { $first: "$demoClass" },
          description: { $first: "$description" },
          createdAt: { $first: "$createdAt" },
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
                price: 1,
                image: 1,
                qualifications: 1,
                demoClass: 1,
                description: 1,
                createdAt: 1,
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

    return {
      data: faculties,
      total,
    };
  }

  async findFacultyFullByIdForAdmin(
    id: string,
  ): Promise<FacultyFullAdminView | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const doc = await FacultyModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: false,
    })
      .populate({
        path: "subjectOffering",
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
      .lean<FacultyPopulatedLean>();

    if (!doc) return null;

    return {
      id: doc._id.toString(),
      name: doc.name,
      qualifications: doc.qualifications,
      description: doc.description,
      demoClass: doc.demoClass,
      image: doc.image,
      price: doc.price,
      isDeleted: doc.isDeleted,

      slots: doc.slots.map((s) => ({
        id: s._id.toString(),
        time: s.time.toISOString().slice(11, 16),
        isAvailable: s.isAvailable,
        pool: s.pool.map((u: any) => ({ id: u._id.toString() })),
        poolLimit: s.poolLimit,
      })),

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
        id: so._id.toString(),
        class: {
          id: so.class._id.toString(),
          name: so.class.name,
        },
        syllabus: {
          id: so.syllabus._id.toString(),
          name: so.syllabus.name,
        },
        subject: {
          id: so.subject._id.toString(),
          name: so.subject.name,
        },
      })),
    };
  }

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
          subjectOffering: { $in: variantObjectIds },
        },
      },
      { $unwind: "$subjectOffering" },
      {
        $match: {
          subjectOffering: { $in: variantObjectIds },
        },
      },
      {
        $lookup: {
          from: "subjectvariants",
          localField: "subjectOffering",
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
          price: 1,
          image: 1,
          qualifications: 1,
          description: 1,
          createdAt: 1,
        },
      },
    ]);

    return documents.map(FacultyMapper.toFacultyUserView);
  }

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
          price: 1,
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

  async findFacultyFullByIdAndSlot(
    facultyId: string,
    slotId: string,
  ): Promise<FacultyDetailsViewForUser | null> {
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
          price: 1,
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
    if (!doc) return null;

    return FacultyMapper.toFacultyWithSlotToUserView(doc);
  }

  async findFacultyByIdWithFirstSlot(
    facultyId: string,
  ): Promise<FacultyDetailsViewForUser | null> {
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
          price: 1,
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
    if (!doc) return null;

    return FacultyMapper.toFacultyWithSlotToUserView(doc);
  }

  async getSlot(facultyId: string, slotId: string): Promise<SlotProps | null> {
    const faculty = await FacultyModel.findOne(
      { _id: facultyId, isDeleted: false },
      { slots: { $elemMatch: { _id: new Types.ObjectId(slotId) } } },
    ).lean();

    if (!faculty || !faculty.slots || faculty.slots.length === 0) {
      return null;
    }

    const slot = faculty.slots[0] as {
      _id: any;
      time: Date;
      isAvailable: boolean;
      pool: any[];
      poolLimit: number;
    };

    return {
      id: slot._id.toString(),
      time: slot.time,
      isAvailable: slot.isAvailable,
      pool: slot.pool.map((u) => u.toString()),
      poolLimit: slot.poolLimit,
    };
  }

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

  async addToSlotPool(
    facultyId: string,
    slotId: string,
    studentId: string,
  ): Promise<void> {
    const result = await FacultyModel.updateOne(
      {
        _id: facultyId,
        isDeleted: false,
        "slots._id": new Types.ObjectId(slotId),
        "slots.isAvailable": true,
      },
      [
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
      ],
      {
        updatePipeline: true,
      },
    );

    if (result.matchedCount === 0) {
      throw new CustomError(
        ResponseMessages.SLOT_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }
  }

  async addToChapterSlotPool(
    facultyId: string,
    chapterSlotId: string,
    studentId: string,
  ): Promise<void> {
    const result = await FacultyModel.updateOne(
      {
        _id: facultyId,
        isDeleted: false,
        "chapterSlots._id": chapterSlotId,
        "chapterSlots.isAvailable": true,
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
      {
        updatePipeline: true,
      },
    );

    if (result.matchedCount === 0) {
      throw new CustomError(
        ResponseMessages.SLOT_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }
  }

  async consumeSlot(
    facultyId: string,
    slotId: string,
    session?: ClientSession,
  ): Promise<void> {
    const result = await FacultyModel.updateOne(
      {
        _id: new ObjectId(facultyId),
        slots: {
          $elemMatch: {
            _id: new ObjectId(slotId),
            isAvailable: true,
          },
        },
      },
      {
        $set: {
          "slots.$.isAvailable": false,
          "slots.$.pool": [],
        },
      },
      session ? { session } : undefined,
    );

    if (result.modifiedCount === 0) {
      throw new Error("not matched document");
    }
  }

  async consumeSlots(
    facultyId: string,
    slotIds: string[],
    session?: ClientSession,
  ): Promise<void> {
    const result = await FacultyModel.updateOne(
      {
        _id: facultyId,
        "slots._id": { $in: slotIds },
        "slots.isAvailable": true,
      },
      {
        $set: {
          "slots.$[s].isAvailable": false,
          "slots.$[s].pool": [],
        },
      },
      {
        arrayFilters: [
          {
            "s._id": { $in: slotIds },
            "s.isAvailable": true,
          },
        ],
        ...(session ? { session } : {}),
      },
    );

    if (result.modifiedCount === 0) {
      throw new Error("not matched document");
    }
  }

  async getAllSlots(facultyId: string): Promise<SlotProps[]> {
    const faculty = await FacultyModel.findOne(
      { _id: facultyId, isDeleted: false },
      { slots: 1 },
    ).lean();

    if (!faculty || !faculty.slots || faculty.slots.length === 0) {
      return [];
    }

    return faculty.slots.map((slot: any) => ({
      id: slot._id.toString(),
      time: slot.time,
      isAvailable: slot.isAvailable,
      pool: slot.pool.map((u: any) => u.toString()),
      poolLimit: slot.poolLimit,
    }));
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
    const { facultyId, userId, mode } = params;

    let updateQuery: any;
    let arrayFilters: any[] = [];

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

    const result = await FacultyModel.updateOne(
      { _id: facultyId },
      updateQuery,
      {
        arrayFilters,
        session,
      },
    );

    if (result.matchedCount === 0) {
      throw new Error("Faculty not found");
    }
  }

  //block and unblock slots and chapter slots

  async setSlotAvailability(params: SetSlotAvailabilityDto): Promise<void> {
    const { facultyId, mode, isAvailable } = params;

    let updateQuery: any;
    let arrayFilters: any[] = [];

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

    const result = await FacultyModel.updateOne(
      { _id: facultyId },
      updateQuery,
      { arrayFilters },
    );

    if (result.matchedCount === 0) {
      throw new Error("Faculty not found");
    }
  }

  async getAllAvailableSlots(facultyId: string): Promise<AvailableSlots[]> {
    const faculty = await FacultyModel.findOne(
      { _id: facultyId, isDeleted: false },
      { slots: 1 },
    ).lean();

    if (!faculty || !faculty.slots || faculty.slots.length === 0) {
      return [];
    }

    return faculty.slots.map((slot: any) => ({
      id: slot._id.toString(),
      time: slot.time,
    }));
  }

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
