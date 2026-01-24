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
  AdminPoolingView,
  ExistingBookingProps,
} from "../type/booking.type.js";
import type { IBookingRepository } from "./booking.repository.interface.js";
import type { GetOneToOneBookingUseCase } from "../use-cases/get.one.to.one.booking.use-case.js";
const { ObjectId } = Types;

export class BookingRepository implements IBookingRepository {
  async create(bookingEntity: Booking): Promise<Booking> {
    const persistenceData = BookingMapper.toPersistence(bookingEntity);
    const created = await BookingModel.create(persistenceData);

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

  async save(bookingEntity: Booking): Promise<Booking> {
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
      { new: true },
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
      status: { $ne: "cancelled" },
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

  async deleteById(id: string): Promise<void> {
    await BookingModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
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
     * 5️⃣ ACADEMIC FILTERS (AFTER LOOKUPS)
     */

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

    // /**
    //  * 7️⃣ PROJECT (normalize for admin table)
    //  */
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
                          input: "$faculty.slots",
                          as: "slot",
                          cond: {
                            $in: [
                              "$$slot._id",
                              {
                                $map: {
                                  input: "$slotId",
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
     * 6️⃣ SEARCH
     */
    if (search.trim()) {
      pipeline.push({
        $match: { "faculty.name": { $regex: search, $options: "i" } },
      });
    }

    /**
     * 7️⃣ GROUP → THIS IS THE CORE CHANGE
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
        slot: {
          $first: {
            $cond: [
              { $eq: ["$mode", "slot"] },
              {
                $let: {
                  vars: {
                    matchedSlot: {
                      $arrayElemAt: [
                        {
                        $filter: {
                          input: "$faculty.slots",
                          as: "slot",
                          cond: {
                            $in: [
                              "$$slot._id",
                              {
                                $map: {
                                  input: "$slotId",
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
}
