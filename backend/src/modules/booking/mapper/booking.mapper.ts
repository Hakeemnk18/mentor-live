import { Booking } from "../entities/booking.entity.js";

export class BookingMapper {
  static toDomain(bookingModelData: any): Booking | null {
    if (!bookingModelData) {
      return null;
    }

    const idString =
      bookingModelData._id?.toString() || bookingModelData.id?.toString();

    if (!idString) {
      console.error(
        "Booking data from DB is missing an ID:",
        bookingModelData
      );
      return null;
    }

    const props: any = {
      id: idString,
      userId: bookingModelData.userId,
      facultyId: bookingModelData.facultyId,
      type: bookingModelData.type,
      mode: bookingModelData.mode,
      isContacted: bookingModelData.isContacted,
      status: bookingModelData.status,
      isDeleted: bookingModelData.isDeleted,
    };

    // exactOptionalPropertyTypes-safe assignments
    if (bookingModelData.slotId !== undefined) {
      props.slotId = bookingModelData.slotId;
    }

    if (bookingModelData.chapterId !== undefined) {
      props.chapterId = bookingModelData.chapterId;
    }

    return new Booking(props);
  }

  static toPersistence(bookingEntity: Booking): any {
    const persistenceData: any = {
      userId: bookingEntity.userId,
      facultyId: bookingEntity.facultyId,
      type: bookingEntity.type,
      mode: bookingEntity.mode,
      isContacted: bookingEntity.isContacted,
      status: bookingEntity.status,
      isDeleted: bookingEntity.isDeleted,
    };

    // exactOptionalPropertyTypes-safe assignments
    if (bookingEntity.slotId !== undefined) {
      persistenceData.slotId = bookingEntity.slotId;
    }

    if (bookingEntity.chapterId !== undefined) {
      persistenceData.chapterId = bookingEntity.chapterId;
    }

    return persistenceData;
  }
}
