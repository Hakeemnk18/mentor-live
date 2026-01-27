import type { IdNameView, slotIdView } from "../../../core/shared/type/id.type.js";

export type BookingType = "oneToOne" | "pooling";
export type BookingMode = "slot" | "chapter";
export type BookingStatus = "interested" | "confirmed" | "cancelled" | "expired";

export type ExistingBookingProps = {
    studentId: string,
    facultyId: string,
    type: BookingType,
    mode: BookingMode,
    isDeleted: boolean,
    chapterId: string | null,
    slotId: string | null
}
export type ExpireOtherBookingsForSlotParams = {
  facultyId: string;
  slotIds: string[];
  excludeBookingId: string;
};

export type AdminBookingRaw = {
  id: any; // ObjectId or string
  student: {
    id: any;
    name: string;
    phone: string;
  };
  faculty:IdNameView;
  class: IdNameView;
  isContacted: boolean,
  syllabus: IdNameView;
  slot?: slotIdView | undefined;
  chapter?: IdNameView | undefined ;
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
  class: IdNameView;  
  isContacted: boolean      
  syllabus: IdNameView;     
  slot?: slotIdView | undefined,
  chapter?: IdNameView | undefined; 
  mode: BookingMode
  status: BookingStatus
  createdAt: string; 
}

export type AdminPoolingRaw = {
  id: {
    facultyId: any;        
    mode: BookingMode;
    slotId?: string | null;
    chapterId?: any;       
  };
  faculty: IdNameView
  mode: BookingMode;
  class: IdNameView;  
  syllabus: IdNameView;
  chapter?: IdNameView | undefined,
  slot?: slotIdView | undefined,
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
  chapter?: IdNameView | undefined
  slot?: slotIdView | undefined,
  totalStudents: number;
  hasPendingContact: boolean;
  createdAt: string; // ISO
}

export type AdminPoolingStudentRaw = {
  faculty: IdNameView;
  mode: BookingMode;
  class: IdNameView;
  syllabus: IdNameView;
  slot?: slotIdView | undefined;          
  chapter?: IdNameView | undefined;       
  student: {
    id: string;
    name: string;
    phone: string;
    isContacted: boolean;
  } [];
};

