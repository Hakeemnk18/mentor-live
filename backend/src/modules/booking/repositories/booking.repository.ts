import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { CustomError } from "../../../core/errors/custom.error.js";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Booking } from "../entities/booking.entity.js";
import { BookingModel } from "../infrastructure/booking.schema.js";
import { BookingMapper } from "../mapper/booking.mapper.js";
import type { ExistingBookingProps } from "../type/booking.type.js";
import type { IBookingRepository } from "./booking.repository.interface.js";

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
    const { studentId, facultyId, type, mode, chapterId, slotId, isDeleted } = props;

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
}
