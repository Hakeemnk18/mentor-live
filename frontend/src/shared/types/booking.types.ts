export interface CreateBookingUserPayload {
  name: string;
  phoneNumber: string;
  class: string;
  place: string;
  school: string;
  syllabus: string;
}

export interface CreateBookingPayload {
  /** Existing registered user */
  userId?: string;
  /** Guest user details (legacy key) */
  newUser?: CreateBookingUserPayload;
  /** Guest user details (used by BookingModal) */
  user?: CreateBookingUserPayload;
  facultyId?: string;
  bookingType?: "one-on-one" | "pool";
  mode?: "slot" | "chapter";
  slotId?: string;
  chapterId?: string;
  time?: string;
  price?: number;
  status?: "pending" | "confirmed" | "cancelled";
  /** Booking details wrapper used by BookingModal */
  booking?: {
    facultyId: string;
    type: string;
    mode: "slot" | "chapter";
    slotId?: string[];
    /**
     * Required for slot-mode bookings.
     * Identifies which subject variant the student is booking.
     */
    subjectVariantId?: string;
    chapterId?: string;
  };
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  type?: "one-on-one" | "pool";
  search?: string;
  mode?: "chapter" | "slot";
  chapterId?: string;
  slotId?: string;
  faculty?: string;
  classId?: string;
  syllabusId?: string;
  isContacted?: boolean;
}

/** Shape exactly matching what the backend AdminBookingView mapper returns */
export interface OneOnOneBooking {
  id: string;
  student: {
    id: string;
    name: string;
    phone: string;
  };
  faculty: { id: string; name: string };
  class: { id: string; name: string };
  syllabus: { id: string; name: string };
  isContacted: boolean;
  mode: "slot" | "chapter";
  /** Backend statuses: "interested" | "confirmed" | "cancelled" | "expired" */
  status: string;
  createdAt: string;
  slot?: { id: string; time: string };
  chapter?: { id: string; name: string };
}

export interface PoolBooking {
  _id?: string;
  /** Convenience shape used by PoolBookingModal */
  faculty: { id: string; name: string };
  facultyId?: string;
  facultyName?: string;
  mode: "slot" | "chapter";
  subject?: { id: string; name: string };
  slot?: { id: string; time: string };
  chapter?: { id: string; name: string };
  class: { id: string; name: string };
  syllabus: { id: string; name: string };
  totalStudents: number;
  createdAt: string;
  hasPendingContact: boolean;
}

/** Matches AdminPoolingStudentRaw.students[] returned by the backend */
export interface PoolStudent {
  id: string;
  name: string;
  phone: string;
  isContacted: boolean;
}

export interface PoolStudentsResponse {
  /** Backend statuses: "interested" | "confirmed" | "cancelled" | "expired" */
  status: string;
  students: PoolStudent[];
}

export interface AvailableSlot {
  id: string;
  time: string;
}

export type BookingType = "one-on-one" | "pool";
