import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { GetAllOneToOneBookingDto } from "../dto/get.all.one.to.one.dto.js";
import { Booking } from "../entities/booking.entity.js";
import { BookingModel } from "../infrastructure/booking.schema.js";
import { BookingMapper } from "../mapper/booking.mapper.js";
import { Types } from "mongoose";
import type {
  AdminBookingView,
  AdminPoolingStudentRaw,
  AdminPoolingView,
  BookingChartRaw,
  BookingStatus,
  BookingStudentView,
  ExistingBookingProps,
  ExpireOtherBookingsForSlotParams,
  GetBookingsFromSlotParams,
} from "../type/booking.type.js";
import type { IBookingRepository } from "./booking.repository.interface.js";
import type { GetOneToOneBookingUseCase } from "../use-cases/get.one.to.one.booking.use-case.js";
import type { GetAdminPoolingStudentsDto } from "../dto/get.pooling.students.dto.js";
import type { ClientSession } from "mongoose";
import type { GetSlotBookingDetailsDto } from "../dto/slot.booking.details.dto.js";
import type { GetChapterBookingDetailsDto } from "../dto/chapter.booking.details.dto.js";
import type { GetAllBookingDto } from "../dto/get.all.booking.dto.js";
import { FacultyModel } from "../../faculty/infrastructure/faculty.schema.js";
import { ChapterModel } from "../../chapter/infrastructure/chapter.schema.js";
import { getRangeStartDate } from "../../analysis/utils/get.start.range.start.date.js";
import type {
  BookingRange,
  LowFacultyBookingResponse,
  TopFacultyBookingResponse,
  ZeroBookingResponse,
} from "../../analysis/type/analysis.type.js";
const { ObjectId } = Types;

export class BookingRepository implements IBookingRepository {
  async create(bookingEntity: Booking, session?: ClientSession): Promise<Booking> {
    const persistenceData = BookingMapper.toPersistence(bookingEntity);
    const [created] = await BookingModel.create([persistenceData], { ...(session ? { session } : {}) });

    const domainBooking = BookingMapper.toDomain(created);
    if (!domainBooking) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domainBooking;
  }

  async findById(id: string): Promise<Booking | null> {
    const foundDocument = await BookingModel.findOne({ _id: id }).lean();
    return BookingMapper.toDomain(foundDocument);
  }

  async save(
    bookingEntity: Booking,
    session?: ClientSession,
  ): Promise<Booking> {
    if (!bookingEntity.id) {
      throw new CustomError(
        ResponseMessages.ID_MISSING,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const persistenceData = BookingMapper.toPersistence(bookingEntity);

    const updatedDocument = await BookingModel.findByIdAndUpdate(
      bookingEntity.id,
      { $set: persistenceData },
      { new: true, ...(session ? { session } : {}) },
    ).lean();

    if (!updatedDocument) {
      throw new CustomError(
        ResponseMessages.BOOKING_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const domainBooking = BookingMapper.toDomain(updatedDocument);
    if (!domainBooking) {
      throw new CustomError(
        ResponseMessages.FAILED_TO_MAP,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return domainBooking;
  }

  async findAllForAdmin(allDoc: IGetAllDocDB): Promise<Booking[]> {
    const { query, page, limit, sort } = allDoc;
    const skip = (page - 1) * limit;

    const documents = await BookingModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return documents
      .map(BookingMapper.toDomain)
      .filter((b): b is Booking => b !== null);
  }

  async findAllForUser(): Promise<{ id: string; status: string }[]> {
    const documents = await BookingModel.find({ isDeleted: false })
      .select({ _id: 1, status: 1 })
      .lean();

    return documents.map((doc) => ({
      id: doc._id.toString(),
      status: doc.status,
    }));
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await BookingModel.countDocuments(query);
  }

  async findExistingBooking(props: ExistingBookingProps): Promise<boolean> {
    const { studentId, facultyId, type, mode, chapterId, slotId, isDeleted } =
      props;

    const baseQuery: any = {
      userId: studentId,
      facultyId,
      type,
      mode,
      isDeleted,
      status: { $nin: ["cancelled", "expired"] },
    };

    if (mode === "chapter") {
      baseQuery.chapterId = chapterId;
    }

    if (mode === "slot") {
      if (!slotId) {
        return true;
      }
      baseQuery.slotId = slotId;
    }

    const existing = await BookingModel.exists(baseQuery);
    return Boolean(existing);
  }

  async deleteById(id: string, session?: ClientSession): Promise<void> {
    await BookingModel.updateOne(
      { _id: id },
      { $set: { isDeleted: true } },
      { ...(session ? { session } : {}) },
    );
  }

  async findAllOneToOneBooking(
    dto: GetAllOneToOneBookingDto,
  ): Promise<{ data: AdminBookingView[]; total: number }> {
    const {
      page,
      limit,
      search,
      mode,
      syllabusId,
      classId,
      chapterId,
      isContacted,
      status,
    } = dto;

    const skip = (page - 1) * limit;

    const pipeline: any[] = [];

    /**
     * 1️⃣ BASE MATCH (Booking-native fields ONLY)
     */
    const baseMatch: any = {
      isDeleted: false,
      type: "oneToOne",
    };

    if (mode) baseMatch.mode = mode;
    if (status) baseMatch.status = status;
    if (typeof isContacted === "boolean") {
      baseMatch.isContacted = isContacted;
    }
    if (chapterId) {
      baseMatch.chapterId = new ObjectId(chapterId);
    }
    if (classId) {
      baseMatch.class = new ObjectId(classId);
    }

    if (syllabusId) {
      baseMatch.syllabus = new ObjectId(syllabusId);
    }

    pipeline.push({ $match: baseMatch });

    /**
     * 2️⃣ LOOKUP USER (student)
     */
    pipeline.push(
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
    );
    // LOOKUP CLASS
    pipeline.push(
      {
        $lookup: {
          from: "classes",
          localField: "class",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: "$class" },
    );

    // LOOKUP Syllabus
    pipeline.push(
      {
        $lookup: {
          from: "syllabuses",
          localField: "syllabus",
          foreignField: "_id",
          as: "syllabus",
        },
      },
      { $unwind: "$syllabus" },
    );

    /**
     * 3️⃣ LOOKUP FACULTY
     */
    pipeline.push(
      {
        $lookup: {
          from: "faculties",
          localField: "facultyId",
          foreignField: "_id",
          as: "faculty",
        },
      },
      { $unwind: "$faculty" },
    );

    /**
     * 4️⃣ LOOKUP CHAPTER (optional)
     */
    pipeline.push(
      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "chapter",
        },
      },
      {
        $unwind: {
          path: "$chapter",
          preserveNullAndEmptyArrays: true,
        },
      },
    );

    /**
     * 4b️⃣ LOOKUP SLOT from FacultySlot collection (slots no longer embedded in Faculty)
     */
    pipeline.push(
      {
        $lookup: {
          from: "facultyslots",
          let: { slotIds: "$slotId" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$slotIds"] } } },
            { $limit: 1 },
            { $project: { _id: 1, time: 1 } },
          ],
          as: "slotDoc",
        },
      },
      { $addFields: { slotDoc: { $arrayElemAt: ["$slotDoc", 0] } } },
    );

    /**
     * 6️⃣ SEARCH (student name OR faculty name)
     */
    if (search.trim()) {
      pipeline.push({
        $match: {
          $or: [
            { "student.name": { $regex: search, $options: "i" } },
            { "faculty.name": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push({
      $project: {
        id: "$_id",

        student: {
          id: "$student._id",
          name: "$student.name",
          phone: "$student.phoneNumber",
        },

        faculty: {
          id: "$faculty._id",
          name: "$faculty.name",
        },
        isContacted: "$isContacted",
        class: {
          id: "$class._id",
          name: "$class.name",
        },

        syllabus: {
          id: "$syllabus._id",
          name: "$syllabus.name",
        },

        // slot comes from FacultySlot collection lookup above
        slot: {
          $cond: [
            { $eq: ["$mode", "slot"] },
            { id: "$slotDoc._id", time: "$slotDoc.time" },
            "$$REMOVE",
          ],
        },

        chapter: {
          $cond: [
            { $eq: ["$mode", "chapter"] },
            {
              id: "$chapter._id",
              name: "$chapter.name",
            },
            "$$REMOVE",
          ],
        },

        mode: 1,
        status: 1,
        createdAt: 1,
      },
    });

    /**
     * 8️⃣ SORT + PAGINATION
     */
    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        meta: [{ $count: "total" }],
      },
    });

    const [result] = await BookingModel.aggregate(pipeline);

    const data = result.data;

    const total = result.meta[0]?.total ?? 0;

    const bookings = data.map(BookingMapper.mapAdminBookingView);
    return { data: bookings, total: total };
  }

  async findAllPoolingBooking(
    dto: GetAllOneToOneBookingDto,
  ): Promise<{ data: AdminPoolingView[]; total: number }> {
    const {
      page,
      limit,
      search,
      mode,
      syllabusId,
      classId,
      chapterId,
      isContacted,
      status,
    } = dto;

    const skip = (page - 1) * limit;
    const pipeline: any[] = [];

    /**
     * 1️⃣ BASE MATCH (booking-only)
     */
    const baseMatch: any = {
      isDeleted: false,
      type: "pooling",
    };

    if (mode) baseMatch.mode = mode;
    if (status) baseMatch.status = status;
    if (typeof isContacted === "boolean") {
      baseMatch.isContacted = isContacted;
    }
    if (classId) {
      baseMatch.class = new ObjectId(classId);
    }

    if (syllabusId) {
      baseMatch.syllabus = new ObjectId(syllabusId);
    }
    if (chapterId) {
      baseMatch.chapterId = new ObjectId(chapterId);
    }

    pipeline.push({ $match: baseMatch });

    // LOOKUP CLASS
    pipeline.push(
      {
        $lookup: {
          from: "classes",
          localField: "class",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: "$class" },
    );

    // LOOKUP Syllabus
    pipeline.push(
      {
        $lookup: {
          from: "syllabuses",
          localField: "syllabus",
          foreignField: "_id",
          as: "syllabus",
        },
      },
      { $unwind: "$syllabus" },
    );

    /**
     * 4️⃣ LOOKUP FACULTY
     */
    pipeline.push(
      {
        $lookup: {
          from: "faculties",
          localField: "facultyId",
          foreignField: "_id",
          as: "faculty",
        },
      },
      { $unwind: "$faculty" },
    );

    /**
     * 5️⃣ LOOKUP CHAPTER (optional)
     */
    pipeline.push(
      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "chapter",
        },
      },
      {
        $unwind: {
          path: "$chapter",
          preserveNullAndEmptyArrays: true,
        },
      },
    );

    /**
     * 5b️⃣ LOOKUP SLOT from FacultySlot collection (slots no longer embedded in Faculty)
     * booking.slotId is ObjectId[] — look up the first one.
     */
    pipeline.push(
      {
        $lookup: {
          from: "facultyslots",
          let: { slotIds: "$slotId" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$slotIds"] } } },
            { $limit: 1 },
            { $project: { _id: 1, time: 1 } },
          ],
          as: "slotDoc",
        },
      },
      {
        $addFields: {
          slotDoc: { $arrayElemAt: ["$slotDoc", 0] },
        },
      },
    );

    /**
     * 5c️⃣ SUBJECT — resolve via chapter.subjectVariant (chapter mode)
     *     or booking.subjectVariantId (slot mode), then join Subject.
     */
    pipeline.push(
      // SubjectVariant for chapter-mode bookings
      {
        $lookup: {
          from: "subjectvariants",
          let: { svId: "$chapter.subjectVariant" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$svId"] } } },
            { $project: { _id: 1, subject: 1 } },
          ],
          as: "chapterSV",
        },
      },
      { $unwind: { path: "$chapterSV", preserveNullAndEmptyArrays: true } },
      // SubjectVariant for slot-mode bookings
      {
        $lookup: {
          from: "subjectvariants",
          let: { svId: "$subjectVariantId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$svId"] } } },
            { $project: { _id: 1, subject: 1 } },
          ],
          as: "slotSV",
        },
      },
      { $unwind: { path: "$slotSV", preserveNullAndEmptyArrays: true } },
      // Pick the relevant SubjectVariant's subject ObjectId
      {
        $addFields: {
          resolvedSubjectId: {
            $cond: [
              { $eq: ["$mode", "chapter"] },
              "$chapterSV.subject",
              "$slotSV.subject",
            ],
          },
        },
      },
      // Lookup the Subject document
      {
        $lookup: {
          from: "subjects",
          let: { subjectId: "$resolvedSubjectId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$subjectId"] } } },
            { $project: { _id: 1, name: 1 } },
          ],
          as: "subjectDoc",
        },
      },
      { $unwind: { path: "$subjectDoc", preserveNullAndEmptyArrays: true } },
    );

    /**
     * 6️⃣ SEARCH
     */
    if (search.trim()) {
      pipeline.push({
        $match: { "faculty.name": { $regex: search, $options: "i" } },
      });
    }

    /**
     * 7️⃣ GROUP
     */
    pipeline.push({
      $group: {
        _id: {
          facultyId: "$faculty._id",
          mode: "$mode",
          slotId: { $arrayElemAt: ["$slotId", 0] },
          chapterId: "$chapterId",
        },

        faculty: { $first: "$faculty" },
        chapter: { $first: "$chapter" },
        subject: { $first: "$subjectDoc" },
        // slotDoc is the FacultySlot document looked up above
        slot: {
          $first: {
            $cond: [
              { $eq: ["$mode", "slot"] },
              {
                id: "$slotDoc._id",
                time: "$slotDoc.time",
              },
              null,
            ],
          },
        },
        syllabus: { $first: "$syllabus" },
        class: { $first: "$class" },
        mode: { $first: "$mode" },
        createdAt: { $min: "$createdAt" },
        totalStudents: { $sum: 1 },

        pendingContactCount: {
          $sum: {
            $cond: [{ $eq: ["$isContacted", false] }, 1, 0],
          },
        },
      },
    });

    /**
     * 8️⃣ PROJECT (admin-friendly pool row)
     */
    pipeline.push({
      $project: {
        id: "$_id",
        faculty: {
          id: "$faculty._id",
          name: "$faculty.name",
        },
        mode: 1,
        subject: {
          $cond: [
            { $ifNull: ["$subject._id", false] },
            { id: "$subject._id", name: "$subject.name" },
            "$$REMOVE",
          ],
        },
        chapter: {
          $cond: [
            { $eq: ["$mode", "chapter"] },
            {
              id: "$chapter._id",
              name: "$chapter.name",
            },
            "$$REMOVE",
          ],
        },
        slot: {
          $cond: [{ $eq: ["$mode", "slot"] }, "$slot", "$$REMOVE"],
        },
        class: {
          id: "$class._id",
          name: "$class.name",
        },
        syllabus: {
          id: "$syllabus._id",
          name: "$syllabus.name",
        },
        totalStudents: 1,
        pendingContactCount: 1,
        hasPendingContact: {
          $gt: ["$pendingContactCount", 0],
        },
        students: 1,
        createdAt: 1,
      },
    });

    /**
     * 9️⃣ SORT + PAGINATION
     */
    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        meta: [{ $count: "total" }],
      },
    });

    const [result] = await BookingModel.aggregate(pipeline);

    return {
      data: result.data.map(BookingMapper.mapAdminPoolingView),
      total: result.meta[0]?.total ?? 0,
    };
  }

  async findAdminPoolingStudents(
    dto: GetAdminPoolingStudentsDto,
  ): Promise<AdminPoolingStudentRaw[]> {
    const pipeline: any[] = [];
    const { facultyId, slotId, chapterId, mode } = dto;

    /* 1️⃣ Base match */
    pipeline.push({
      $match: {
        facultyId: new Types.ObjectId(facultyId),
        type: "pooling",
        mode,
        isDeleted: false,
      },
    });

    /* 2️⃣ Mode-specific match */
    if (mode === "slot") {
      pipeline.push({
        $match: {
          // slotId is ObjectId[] in the booking document
          slotId: { $in: [new Types.ObjectId(slotId)] },
        },
      });
    }

    if (mode === "chapter") {
      pipeline.push({
        $match: {
          chapterId: new Types.ObjectId(chapterId),
        },
      });
    }

    /* 3️⃣ Lookups */
    pipeline.push(
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      {
        $lookup: {
          from: "faculties",
          localField: "facultyId",
          foreignField: "_id",
          as: "faculty",
        },
      },
      { $unwind: "$faculty" },

      {
        $lookup: {
          from: "classes",
          localField: "class",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: "$class" },

      {
        $lookup: {
          from: "syllabuses",
          localField: "syllabus",
          foreignField: "_id",
          as: "syllabus",
        },
      },
      { $unwind: "$syllabus" },

      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "chapter",
        },
      },
      {
        $unwind: {
          path: "$chapter",
          preserveNullAndEmptyArrays: true,
        },
      },
    );

    /* 4️⃣ Slot resolution — lookup from FacultySlot collection (slots no longer embedded) */
    pipeline.push(
      {
        $lookup: {
          from: "facultyslots",
          let: { slotIds: "$slotId" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$slotIds"] } } },
            { $limit: 1 },
            { $project: { _id: 1, time: 1 } },
          ],
          as: "slotDoc",
        },
      },
      {
        $addFields: {
          slot: {
            $cond: [
              { $eq: ["$mode", "slot"] },
              {
                $let: {
                  vars: { s: { $arrayElemAt: ["$slotDoc", 0] } },
                  in: { id: "$$s._id", time: "$$s.time" },
                },
              },
              null,
            ],
          },
        },
      },
    );

    /* 4b️⃣ Subject resolution — chapter.subjectVariant → Subject (chapter mode)
     *       or booking.subjectVariantId → Subject (slot mode) */
    pipeline.push(
      {
        $lookup: {
          from: "subjectvariants",
          let: { svId: "$chapter.subjectVariant" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$svId"] } } },
            { $project: { _id: 1, subject: 1 } },
          ],
          as: "chapterSV",
        },
      },
      { $unwind: { path: "$chapterSV", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "subjectvariants",
          let: { svId: "$subjectVariantId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$svId"] } } },
            { $project: { _id: 1, subject: 1 } },
          ],
          as: "slotSV",
        },
      },
      { $unwind: { path: "$slotSV", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          resolvedSubjectId: {
            $cond: [
              { $eq: ["$mode", "chapter"] },
              "$chapterSV.subject",
              "$slotSV.subject",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "subjects",
          let: { subjectId: "$resolvedSubjectId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$subjectId"] } } },
            { $project: { _id: 1, name: 1 } },
          ],
          as: "subjectDoc",
        },
      },
      { $unwind: { path: "$subjectDoc", preserveNullAndEmptyArrays: true } },
    );

    //group faculty
    pipeline.push({
      $group: {
        _id: {
          faculty: "$faculty._id",
          mode: "$mode",
          class: "$class._id",
          syllabus: "$syllabus._id",
          slot: "$slot.id",
          chapter: "$chapter._id",
        },

        faculty: { $first: "$faculty" },
        mode: { $first: "$mode" },
        class: { $first: "$class" },
        syllabus: { $first: "$syllabus" },
        slot: { $first: "$slot" },
        chapter: { $first: "$chapter" },
        subject: { $first: "$subjectDoc" },

        students: {
          $push: {
            id: "$student._id",
            name: "$student.name",
            phone: "$student.phoneNumber",   // Student schema uses phoneNumber
            isContacted: "$isContacted",
          },
        },
      },
    });

    /* 5️⃣ Final projection */
    pipeline.push({
      $project: {
        _id: 0,

        faculty: {
          id: "$faculty._id",
          name: "$faculty.name",
        },

        mode: 1,

        class: {
          id: "$class._id",
          name: "$class.name",
        },

        syllabus: {
          id: "$syllabus._id",
          name: "$syllabus.name",
        },

        subject: {
          $cond: [
            { $ifNull: ["$subject._id", false] },
            { id: "$subject._id", name: "$subject.name" },
            "$$REMOVE",
          ],
        },

        slot: {
          $cond: [{ $eq: ["$mode", "slot"] }, "$slot", "$$REMOVE"],
        },

        chapter: {
          $cond: [
            { $eq: ["$mode", "chapter"] },
            {
              id: "$chapter._id",
              name: "$chapter.name",
            },
            "$$REMOVE",
          ],
        },

        students: 1,
      },
    });

    const documents =
      await BookingModel.aggregate<AdminPoolingStudentRaw>(pipeline);
    return documents.map(BookingMapper.mapAdminPoolingStudentView);
  }

  async expireOtherBookingsForSlots(
    params: ExpireOtherBookingsForSlotParams,
    session?: ClientSession,
  ): Promise<void> {
    const { facultyId, slotIds, excludeBookingIds } = params;

    /* slotId is now an ObjectId[] in the schema — cast for the query */
    const slotObjectIds = slotIds.map((id) => new ObjectId(id));
    const excludeObjectIds = excludeBookingIds.map((id) => new ObjectId(id));

    await BookingModel.updateMany(
      {
        facultyId: new ObjectId(facultyId),
        slotId: { $elemMatch: { $in: slotObjectIds } },
        mode: "slot",
        status: "interested",
        isDeleted: false,
        _id: { $nin: excludeObjectIds },
      },
      {
        $set: { status: "expired" },
      },
      session ? { session } : undefined,
    );
  }

  async getBookingIds(params: GetBookingsFromSlotParams): Promise<string[]> {
    const { facultyId, userIds, mode } = params;

    const query: Record<string, any> = {
      facultyId,
      mode,
      status: "interested",
      type: "pooling",
      isDeleted: false,
      userId: { $in: userIds },
    };

    if (mode === "slot") {
      query.slotId = { $in: params.slotIds };
    }

    if (mode === "chapter") {
      query.chapterId = params.chapterId;
    }

    const docs = await BookingModel.find(query, { _id: 1 });

    return docs.map((d) => d._id.toString());
  }

  async confirmPoolingBookings(
    ids: string[],
    session: ClientSession,
  ): Promise<number> {
    const result = await BookingModel.updateMany(
      {
        _id: { $in: ids },
        status: "interested",
        isDeleted: false,
      },
      {
        $set: {
          status: "confirmed",
        },
      },
      { session },
    );

    return result.modifiedCount;
  }

  async addSlotsToBookings(
    bookingIds: string[],
    slotIds: string[],
    session: ClientSession,
  ): Promise<void> {
    const result = await BookingModel.updateMany(
      {
        _id: { $in: bookingIds },
        status: "confirmed",
        isDeleted: false,
      },
      {
        $set: {
          slotId: slotIds,
        },
      },
      { session },
    );

    if (result.matchedCount === 0) {
      throw new Error("No bookings matched for adding slots");
    }
  }

  async findByQuery(query: Record<string, any>): Promise<Booking | null> {
    const foundDocument = await BookingModel.findOne(query).lean();
    return BookingMapper.toDomain(foundDocument);
  }

  async cancelBookingsByIds(
    bookingIds: string[],
    session: ClientSession,
  ): Promise<void> {
    const result = await BookingModel.updateMany(
      {
        _id: { $in: bookingIds },
        status: { $ne: "cancelled" },
        isDeleted: false,
      },
      {
        $set: {
          status: "cancelled",
        },
      },
      { session },
    );

    if (result.matchedCount === 0) {
      throw new Error("No bookings matched for  cancellation");
    }
  }

  async getSlotBookingDetails(
    params: GetSlotBookingDetailsDto,
  ): Promise<BookingStudentView[]> {
    const { facultyId, slotId, bookingType } = params;

    const query: Record<string, any> = {
      facultyId,
      slotId,
      mode: "slot",
      type: bookingType,
      status: "interested",
      isDeleted: false,
    };

    const docs = await BookingModel.find(query)
      .populate({
        path: "userId",
        select: "name phoneNumber",
      })
      .lean();
    return docs.map(BookingMapper.mapSlotBookingDetailsView);
  }

  async getChapterBookingDetails(
    params: GetChapterBookingDetailsDto,
  ): Promise<BookingStudentView[]> {
    const { facultyId, chapterId, bookingType } = params;

    const query: Record<string, any> = {
      facultyId,
      chapterId,
      mode: "chapter",
      type: bookingType,
      status: "interested",
      isDeleted: false,
    };

    const docs = await BookingModel.find(query)
      .populate({
        path: "userId",
        select: "name phoneNumber",
      })
      .lean();
    return docs.map(BookingMapper.mapSlotBookingDetailsView);
  }

  async findAllBookings(dto: GetAllBookingDto): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search = "",
      type,
      mode,
      status,
      isContacted,
      syllabusId,
      classId,
      chapterId,
    } = dto;

    const skip = (page - 1) * limit;
    const pipeline: any[] = [];

    // ─── 1. BASE MATCH ────────────────────────────────────────────────
    const baseMatch: any = { isDeleted: false };

    if (type) baseMatch.type = type;
    if (mode) baseMatch.mode = mode;
    if (status) baseMatch.status = status;
    if (typeof isContacted === "boolean") baseMatch.isContacted = isContacted;
    if (classId) baseMatch.class = new Types.ObjectId(classId);
    if (syllabusId) baseMatch.syllabus = new Types.ObjectId(syllabusId);
    if (chapterId) baseMatch.chapterId = new Types.ObjectId(chapterId);

    pipeline.push({ $match: baseMatch });

    // ─── 2. LOOKUPS ───────────────────────────────────────────────────
    pipeline.push(
      // Student
      {
        $lookup: {
          from: "students",
          localField: "userId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },

      // Faculty
      {
        $lookup: {
          from: "faculties",
          localField: "facultyId",
          foreignField: "_id",
          as: "faculty",
        },
      },
      { $unwind: { path: "$faculty", preserveNullAndEmptyArrays: true } },

      // Class
      {
        $lookup: {
          from: "classes",
          localField: "class",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: { path: "$class", preserveNullAndEmptyArrays: true } },

      // Syllabus
      {
        $lookup: {
          from: "syllabuses",
          localField: "syllabus",
          foreignField: "_id",
          as: "syllabus",
        },
      },
      { $unwind: { path: "$syllabus", preserveNullAndEmptyArrays: true } },

      // Chapter (optional)
      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "chapter",
        },
      },
      { $unwind: { path: "$chapter", preserveNullAndEmptyArrays: true } },
    );

    // ─── 3. SEARCH ────────────────────────────────────────────────────
    if (search.trim()) {
      pipeline.push({
        $match: {
          $or: [
            { "student.name": { $regex: search.trim(), $options: "i" } },
            { "faculty.name": { $regex: search.trim(), $options: "i" } },
          ],
        },
      });
    }

    // ─── 4. PROJECT ───────────────────────────────────────────────────
    pipeline.push({
      $project: {
        id: "$_id",
        type: 1,
        mode: 1,
        status: 1,
        isContacted: 1,
        createdAt: 1,

        student: {
          id: "$student._id",
          name: "$student.name",
          phone: "$student.phoneNumber",
        },

        faculty: {
          id: "$faculty._id",
          name: "$faculty.name",
        },

        class: {
          id: "$class._id",
          name: "$class.name",
        },

        syllabus: {
          id: "$syllabus._id",
          name: "$syllabus.name",
        },

        // Only present when mode === "chapter"
        chapter: {
          $cond: [
            { $eq: ["$mode", "chapter"] },
            { id: "$chapter._id", name: "$chapter.name" },
            "$$REMOVE",
          ],
        },

        // Only present when mode === "slot"
        slot: {
          $cond: [
            { $eq: ["$mode", "slot"] },
            {
              $let: {
                vars: {
                  matchedSlot: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: { $ifNull: ["$faculty.slots", []] },
                          as: "s",
                          cond: {
                            $in: [
                              "$$s._id",
                              {
                                $map: {
                                  input: { $ifNull: ["$slotId", []] },
                                  as: "id",
                                  in: { $toObjectId: "$$id" },
                                },
                              },
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  id: "$$matchedSlot._id",
                  time: "$$matchedSlot.time",
                },
              },
            },
            "$$REMOVE",
          ],
        },
      },
    });

    // ─── 5. SORT + PAGINATE ───────────────────────────────────────────
    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        meta: [{ $count: "total" }],
      },
    });

    // ─── 6. EXECUTE ───────────────────────────────────────────────────
    const [result] = await BookingModel.aggregate(pipeline);

    const total = result.meta[0]?.total ?? 0;

    return {
      data: result.data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTopBookingFaculties(
    range: BookingRange,
  ): Promise<TopFacultyBookingResponse> {
    const since = getRangeStartDate(range);

    const pipeline: any[] = [
      // Only active, non-deleted bookings within the range
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: since },
          status: { $nin: ["cancelled", "expired"] },
        },
      },

      // Group by faculty
      {
        $group: {
          _id: "$facultyId",
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
          },
        },
      },

      // Sort descending — highest bookings first
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },

      // Join faculty name
      {
        $lookup: {
          from: "faculties",
          localField: "_id",
          foreignField: "_id",
          as: "faculty",
        },
      },
      { $unwind: "$faculty" },

      {
        $project: {
          _id: 0,
          facultyId: { $toString: "$_id" },
          name: "$faculty.name",
          totalBookings: 1,
          confirmedBookings: 1,
        },
      },
    ];

    const results = await BookingModel.aggregate(pipeline);

    return {
      range,
      faculties: results,
    };
  }

  // ─── 2. Low Booking Faculties ─────────────────────────────────────────────────

  async getLowBookingFaculties(
    range: BookingRange,
  ): Promise<LowFacultyBookingResponse> {
    const since = getRangeStartDate(range);

    const pipeline: any[] = [
      // Start from all active faculties so even 1-booking ones appear
      { $match: { isDeleted: false } },

      {
        $lookup: {
          from: "bookings",
          let: { facultyId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$facultyId", "$$facultyId"] },
                isDeleted: false,
                createdAt: { $gte: since },
                status: { $nin: ["cancelled", "expired"] },
              },
            },
          ],
          as: "bookings",
        },
      },

      // Exclude completely zero ones — those belong to getZeroBooking()
      { $match: { "bookings.0": { $exists: true } } },

      {
        $project: {
          _id: 0,
          facultyId: { $toString: "$_id" },
          name: "$name",
          totalBookings: { $size: "$bookings" },
          confirmedBookings: {
            $size: {
              $filter: {
                input: "$bookings",
                as: "b",
                cond: { $eq: ["$$b.status", "confirmed"] },
              },
            },
          },
        },
      },

      // Sort ascending — lowest bookings first
      { $sort: { totalBookings: 1 } },
      { $limit: 5 },
    ];

    const results = await FacultyModel.aggregate(pipeline);

    return {
      range,
      faculties: results,
    };
  }

  // ─── 3. Zero Booking Faculties & Chapters ────────────────────────────────────

  async getZeroBookingItems(range: BookingRange): Promise<ZeroBookingResponse> {
    const since = getRangeStartDate(range);

    // ── Faculties with 0 bookings in range ──
    const facultyPipeline: any[] = [
      { $match: { isDeleted: false } },

      {
        $lookup: {
          from: "bookings",
          let: { facultyId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$facultyId", "$$facultyId"] },
                isDeleted: false,
                createdAt: { $gte: since },
                status: { $nin: ["cancelled", "expired"] },
              },
            },
          ],
          as: "bookings",
        },
      },

      // Keep only faculties with NO bookings in range
      { $match: { "bookings.0": { $exists: false } } },

      { $sort: { createdAt: -1 } },
      { $limit: 5 },

      {
        $project: {
          _id: 0,
          facultyId: { $toString: "$_id" },
          name: "$name",
        },
      },
    ];

    // ── Chapters with 0 bookings in range ──
    const chapterPipeline: any[] = [
      { $match: { isDeleted: false } },

      {
        $lookup: {
          from: "bookings",
          let: { chapterId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$chapterId", "$$chapterId"] },
                isDeleted: false,
                createdAt: { $gte: since },
                status: { $nin: ["cancelled", "expired"] },
              },
            },
          ],
          as: "bookings",
        },
      },

      { $match: { "bookings.0": { $exists: false } } },

      { $sort: { createdAt: -1 } },
      { $limit: 5 },

      {
        $project: {
          _id: 0,
          chapterId: { $toString: "$_id" },
          name: "$name",
          iconUrl: "$icon.url",
        },
      },
    ];

    const [faculties, chapters] = await Promise.all([
      FacultyModel.aggregate(facultyPipeline),
      ChapterModel.aggregate(chapterPipeline),
    ]);

    return {
      range,
      faculties,
      chapters,
    };
  }

  async getAggregateBookingKpiStats(
    startDate: Date,
    endDate: Date,
  ): Promise<{ totalBookings: number }> {
    const result = await BookingModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $nin: ["cancelled", "expired"] },
        },
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
        },
      },
    ]);
    return result[0] ?? { totalBookings: 0 };
  }

  async getDailyBookingKpiStats(
    startDate: Date,
    endDate: Date,
  ): Promise<{ _id: string; bookings: number }[]> {
    return BookingModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $nin: ["cancelled", "expired"] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  // Snapshot — not range-bound, like your pendingOrdersCount
  async getUncontactedBookingsCount(): Promise<number> {
    return BookingModel.countDocuments({
      isDeleted: false,
      isContacted: false,
      status: { $nin: ["cancelled", "expired"] },
    });
  }

  async getConfirmedBookingsCount(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return BookingModel.countDocuments({
      isDeleted: false,
      status: "confirmed",
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }

  async getBookingsForChart(
    startDate: Date,
    endDate: Date,
  ): Promise<BookingChartRaw[]> {
    const booking = await BookingModel.find({
      isDeleted: false,
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $nin: ["cancelled", "expired"] },
    })
      .select({ createdAt: 1, type: 1, _id: 0 })
      .lean();

    return booking.map((b) => BookingMapper.mapBookingChartItem(b));
  }

  async getBookingStatusCounts(): Promise<
    { _id: BookingStatus; count: number }[]
  > {
    return BookingModel.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
  }
}
