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
  search?: string;
  mode?: "chapter" | "slot";
  chapterId?: string;
  slotId?: string;
  faculty?: string;
  classId?: string;
  syllabusId?: string;
  isContacted?: boolean;
  /** "All Bookings" tab only — filter by booking type */
  type?: "oneToOne" | "pooling";
  /** "All Bookings" tab only — filter by booking status */
  status?: "interested" | "confirmed" | "cancelled" | "expired";
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
  subject?: { id: string; name: string };
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
  /** Omitted for "live" pool views where the backend should use the current cycle */
  poolCycle?: number;
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

/** Row shape returned by GET /bookings — every booking, regardless of type */
export interface AllBooking {
  id: string;
  type: "oneToOne" | "pooling";
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
  subject?: { id: string; name: string };
  slot?: { id: string; time: string };
  chapter?: { id: string; name: string };
}

export type BookingType = "one-on-one" | "pool" | "all";
