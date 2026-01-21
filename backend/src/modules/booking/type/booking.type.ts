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