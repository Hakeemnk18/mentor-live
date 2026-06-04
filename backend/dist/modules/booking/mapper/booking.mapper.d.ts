import { Booking } from "../entities/booking.entity.js";
import type { AdminBookingRaw, AdminBookingView, AdminPoolingRaw, AdminPoolingStudentRaw, AdminPoolingView, BookingChartRaw, BookingStudentView } from "../type/booking.type.js";
export declare class BookingMapper {
    static toDomain(bookingModelData: any): Booking | null;
    static toPersistence(bookingEntity: Booking): any;
    static mapAdminBookingView(raw: AdminBookingRaw): AdminBookingView;
    static mapAdminPoolingView(raw: AdminPoolingRaw): AdminPoolingView;
    static mapAdminPoolingStudentView(raw: AdminPoolingStudentRaw): AdminPoolingStudentRaw;
    static mapSlotBookingDetailsView(raw: any): BookingStudentView;
    static mapBookingChartItem(raw: any): BookingChartRaw;
}
//# sourceMappingURL=booking.mapper.d.ts.map