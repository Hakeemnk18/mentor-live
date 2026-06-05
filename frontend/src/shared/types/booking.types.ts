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

export interface OneOnOneBooking {
  _id: string;
  bookingType: "one-on-one";
  user: {
    _id: string;
    name: string;
    phoneNumber: string;
    class: { name: string };
    syllabus: { name: string };
  };
  faculty: {
    _id: string;
    name: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  price: number;
  contactStatus: "pending_contact" | "contacted" | "enrolled" | "not_interested";
  mode: "slot" | "chapter";
  slot?: { time: string };
  chapter?: { name: string };
}

export interface PoolBooking {
  _id?: string;
  /** Convenience shape used by PoolBookingModal */
  faculty: { id: string; name: string };
  facultyId?: string;
  facultyName?: string;
  mode: "slot" | "chapter";
  slot?: { id: string; time: string };
  chapter?: { id: string; name: string };
  class: { id: string; name: string };
  syllabus: { id: string; name: string };
  totalStudents: number;
  createdAt: string;
  hasPendingContact: boolean;
}

export interface PoolStudent {
  bookingId: string;
  studentId: string;
  name: string;
  phoneNumber: string;
  contactStatus: "pending_contact" | "contacted" | "enrolled" | "not_interested";
  poolStatus: "waiting" | "pooled" | "discarded";
}

export interface PoolStudentsResponse {
  students: PoolStudent[];
}

export interface AvailableSlot {
  id: string;
  time: string;
}

export type BookingType = "one-on-one" | "pool";
