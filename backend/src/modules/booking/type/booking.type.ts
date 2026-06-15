import type {
  IdNameView,
  slotIdView,
} from "../../../core/shared/type/id.type.js";
import type { SlotMode } from "../../faculty/types/faculty.type.js";

export type BookingType = "oneToOne" | "pooling";
export type BookingMode = "slot" | "chapter";
export type BookingStatus =
  | "interested"
  | "confirmed"
  | "cancelled"
  | "expired";

export type ExistingBookingProps = {
  studentId: string;
  facultyId: string;
  type: BookingType;
  mode: BookingMode;
  isDeleted: boolean;
  chapterId: string | null;
  slotId: string | null;
};
export type ExpireOtherBookingsForSlotParams = {
  facultyId: string;
  /** IDs of FacultySlot documents whose "interested" bookings should be expired */
  slotIds: string[];
  excludeBookingIds: string[];
};

export type GetBookingsFromSlotParams =
  | {
      mode: "slot";
      facultyId: string;
      slotIds: string[];
      userIds: string[];
      chapterIds?: never;
    }
  | {
      mode: "chapter";
      facultyId: string;
      chapterId: string;
      userIds: string[];
      slotIds?: never;
    };

export type AdminBookingRaw = {
  id: any; // ObjectId or string
  student: {
    id: any;
    name: string;
    phone: string;
  };
  faculty: IdNameView;
  class: IdNameView;
  isContacted: boolean;
  syllabus: IdNameView;
  slot?: slotIdView | undefined;
  chapter?: IdNameView | undefined;
  mode: BookingMode;
  status: BookingStatus;
  createdAt: Date;
};

export interface AdminBookingView {
  id: string;
  student: {
    id: string;
    name: string;
    phone: string;
  };
  faculty: IdNameView;
  class: IdNameView;
  isContacted: boolean;
  syllabus: IdNameView;
  slot?: slotIdView | undefined;
  chapter?: IdNameView | undefined;
  mode: BookingMode;
  status: BookingStatus;
  createdAt: string;
}

export type AdminPoolingRaw = {
  id: {
    facultyId: any;
    mode: BookingMode;
    slotId?: string | null;
    chapterId?: any;
  };
  faculty: IdNameView;
  mode: BookingMode;
  class: IdNameView;
  syllabus: IdNameView;
  subject?: IdNameView | undefined;
  chapter?: IdNameView | undefined;
  slot?: slotIdView | undefined;
  poolCycle: number;
  totalStudents: number;
  pendingContactCount: number;
  hasPendingContact: boolean;
  createdAt: Date;
};

export interface AdminPoolingView {
  faculty: IdNameView;
  mode: BookingMode;
  class: IdNameView;
  syllabus: IdNameView;
  subject?: IdNameView | undefined;
  chapter?: IdNameView | undefined;
  slot?: slotIdView | undefined;
  poolCycle: number;
  totalStudents: number;
  hasPendingContact: boolean;
  createdAt: string; // ISO
}

export type AdminPoolingStudentRaw = {
  faculty: IdNameView;
  mode: BookingMode;
  class: IdNameView;
  syllabus: IdNameView;
  subject?: IdNameView | undefined;
  slot?: slotIdView | undefined;
  chapter?: IdNameView | undefined;
  status: string;
  students: {
    id: string;
    name: string;
    phone: string;
    isContacted: boolean;
  }[];
};

export type BookingStudentView = {
  studentId: string;
  name: string;
  phone: string;
  isContacted: boolean;
  bookingDate: Date;
  bookingId: string;
};

export type BookingChartRaw = {
  createdAt: Date;
  type: BookingType;
};

/** Row shape returned by findAllBookings — every booking, regardless of type */
export interface AdminAllBookingView {
  id: string;
  type: BookingType;
  student: {
    id: string;
    name: string;
    phone: string;
  };
  faculty: IdNameView;
  class: IdNameView;
  syllabus: IdNameView;
  isContacted: boolean;
  mode: BookingMode;
  status: BookingStatus;
  slot?: slotIdView | undefined;
  chapter?: IdNameView | undefined;
  createdAt: string;
}
