import type { IdNameView, slotIdView } from "../../../core/shared/type/id.type.js";

export type BookingType = "oneToOne" | "pooling";
export type BookingMode = "slot" | "chapter";
export type BookingStatus = "interested" | "confirmed" | "cancelled";

export type ExistingBookingProps = {
    studentId: string,
    facultyId: string,
    type: BookingType,
    mode: BookingMode,
    isDeleted: boolean,
    chapterId: string | null,
    slotId: string | null
}

export type AdminBookingRaw = {
  id: any; // ObjectId or string
  student: {
    id: any;
    name: string;
    phone: string;
  };
  faculty: {
    id: any;
    name: string;
  };
  class: string;
  isContacted: boolean,
  syllabus: string;
  slot?: slotIdView | undefined;
  chapter?: {
    id: any;
    name: string;
  } | undefined ;
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
  faculty: IdNameView
  class: string;  
  isContacted: boolean      
  syllabus: string;     
  slot?: slotIdView | undefined,
  chapter?: IdNameView | undefined; 
  mode: BookingMode
  status: BookingStatus
  createdAt: string; 
}