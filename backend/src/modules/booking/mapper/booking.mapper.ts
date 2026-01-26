import { Booking } from "../entities/booking.entity.js";
import type {
  AdminBookingRaw,
  AdminBookingView,
  AdminPoolingRaw,
  AdminPoolingStudentRaw,
  AdminPoolingView,
} from "../type/booking.type.js";

export class BookingMapper {
  static toDomain(bookingModelData: any): Booking | null {
    if (!bookingModelData) {
      return null;
    }

    const idString =
      bookingModelData._id?.toString() || bookingModelData.id?.toString();

    if (!idString) {
      console.error("Booking data from DB is missing an ID:", bookingModelData);
      return null;
    }

    const props: any = {
      id: idString,
      userId: bookingModelData.userId,
      facultyId: bookingModelData.facultyId,
      type: bookingModelData.type,
      mode: bookingModelData.mode,
      class: bookingModelData.class,
      syllabus: bookingModelData.syllabus,
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
      class: bookingEntity.class,
      syllabus: bookingEntity.syllabus
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

  static mapAdminBookingView(raw: AdminBookingRaw): AdminBookingView {
    return {
      id: String(raw.id),

      student: {
        id: String(raw.student.id),
        name: raw.student.name,
        phone: raw.student.phone,
      },

      faculty: {
        id: String(raw.faculty.id),
        name: raw.faculty.name,
      },

      class: raw.class,
      syllabus: raw.syllabus,
      isContacted: raw.isContacted,
      slot: raw.mode === "slot" ? raw.slot : undefined,

      chapter:
        raw.mode === "chapter" && raw.chapter
          ? {
              id: String(raw.chapter.id),
              name: raw.chapter.name,
            }
          : undefined,

      mode: raw.mode,
      status: raw.status,
      createdAt: raw.createdAt.toISOString(),
    };
  }

  static mapAdminPoolingView(raw: AdminPoolingRaw): AdminPoolingView {
    return {
      faculty: raw.faculty,
      mode: raw.mode,
      class: raw.class,  
      syllabus: raw.syllabus,
      slot: raw.mode === "slot" ? raw.slot : undefined,
      chapter: raw.mode === "chapter" && raw.chapter
          ? {
              id: String(raw.chapter.id),
              name: raw.chapter.name,
            }
          : undefined,
      totalStudents: raw.totalStudents,
      hasPendingContact: raw.hasPendingContact,
      createdAt: raw.createdAt.toISOString(),
    };
  }

  static mapAdminPoolingStudentView(raw: AdminPoolingStudentRaw): AdminPoolingStudentRaw {
    return {
      faculty: raw.faculty,
      mode: raw.mode,
      class: raw.class,  
      syllabus: raw.syllabus,
      slot: raw.mode === "slot" ? raw.slot : undefined,
      chapter: raw.mode === "chapter" && raw.chapter
          ? {
              id: String(raw.chapter.id),
              name: raw.chapter.name,
            }
          : undefined,
      student : raw.student
    }
  }
}
