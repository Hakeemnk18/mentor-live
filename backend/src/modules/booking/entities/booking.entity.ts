import type {
  BookingMode,
  BookingStatus,
  BookingType,
} from "../type/booking.type.js";

export interface BookingProps {
  id: string | null;
  userId: string;
  facultyId: string;
  type: BookingType;
  mode: BookingMode;
  slotId?: string[];
  subjectVariantId?: string;
  chapterId?: string;
  class: string;
  syllabus: string;
  isContacted?: boolean;
  status?: BookingStatus;
  isDeleted?: boolean;
}

export class Booking {
  public readonly id: string | null;
  public readonly userId: string;
  public readonly facultyId: string;
  public readonly type: BookingType;
  public readonly mode: BookingMode;
  public readonly slotId?: string[];
  public readonly subjectVariantId?: string;
  public readonly chapterId?: string;
  public readonly class: string;
  public readonly syllabus: string;
  public readonly isContacted: boolean;
  public readonly status: BookingStatus;
  public readonly isDeleted: boolean;

  constructor(props: BookingProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.facultyId = props.facultyId;
    this.type = props.type;
    this.mode = props.mode;
    this.class = props.class;
    this.syllabus = props.syllabus;

    if (props.slotId !== undefined) this.slotId = props.slotId;
    if (props.subjectVariantId !== undefined) this.subjectVariantId = props.subjectVariantId;
    if (props.chapterId !== undefined) this.chapterId = props.chapterId;

    this.isContacted = props.isContacted ?? false;
    this.status = props.status ?? "interested";
    this.isDeleted = props.isDeleted ?? false;
  }

  delete(): Booking {
    if (this.isDeleted) throw new Error("Booking already deleted");
    return new Booking({ ...this, isDeleted: true });
  }

  restore(): Booking {
    if (!this.isDeleted) throw new Error("Booking is not deleted");
    return new Booking({ ...this, isDeleted: false });
  }

  confirm(): Booking {
    if (this.status !== "interested") {
      throw new Error("Invalid booking state transition");
    }
    return new Booking({ ...this, isContacted: true, status: "confirmed" });
  }

  confirmWithSlots(slotId: string[]): Booking {
    if (this.status !== "interested") {
      throw new Error("Invalid booking state transition");
    }
    return new Booking({ ...this, slotId, status: "confirmed", isContacted: true });
  }
}
