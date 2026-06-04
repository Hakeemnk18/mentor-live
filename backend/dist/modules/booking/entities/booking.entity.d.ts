import type { BookingMode, BookingStatus, BookingType } from "../type/booking.type.js";
export interface BookingProps {
    id: string | null;
    userId: string;
    facultyId: string;
    type: BookingType;
    mode: BookingMode;
    slotId?: string[];
    chapterId?: string;
    class: string;
    syllabus: string;
    isContacted?: boolean;
    status?: BookingStatus;
    isDeleted?: boolean;
}
export declare class Booking {
    readonly id: string | null;
    readonly userId: string;
    readonly facultyId: string;
    readonly type: BookingType;
    readonly mode: BookingMode;
    readonly slotId?: string[];
    readonly chapterId?: string;
    readonly class: string;
    readonly syllabus: string;
    readonly isContacted: boolean;
    readonly status: BookingStatus;
    readonly isDeleted: boolean;
    constructor(props: BookingProps);
    delete(): Booking;
    restore(): Booking;
    confirm(): Booking;
    confirmWithSlots(slotId: string[]): Booking;
}
//# sourceMappingURL=booking.entity.d.ts.map