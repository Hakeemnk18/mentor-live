import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { GetAllOneToOneBookingDto } from "../dto/get.all.one.to.one.dto.js";
import { Booking } from "../entities/booking.entity.js";
import type { AdminBookingView, AdminPoolingStudentRaw, AdminPoolingView, BookingChartRaw, BookingStatus, BookingStudentView, ExistingBookingProps, ExpireOtherBookingsForSlotParams, GetBookingsFromSlotParams } from "../type/booking.type.js";
import type { IBookingRepository } from "./booking.repository.interface.js";
import type { GetAdminPoolingStudentsDto } from "../dto/get.pooling.students.dto.js";
import type { ClientSession } from "mongoose";
import type { GetSlotBookingDetailsDto } from "../dto/slot.booking.details.dto.js";
import type { GetChapterBookingDetailsDto } from "../dto/chapter.booking.details.dto.js";
import type { GetAllBookingDto } from "../dto/get.all.booking.dto.js";
import type { BookingRange, LowFacultyBookingResponse, TopFacultyBookingResponse, ZeroBookingResponse } from "../../analysis/type/analysis.type.js";
export declare class BookingRepository implements IBookingRepository {
    create(bookingEntity: Booking): Promise<Booking>;
    findById(id: string): Promise<Booking | null>;
    save(bookingEntity: Booking, session?: ClientSession): Promise<Booking>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<Booking[]>;
    findAllForUser(): Promise<{
        id: string;
        status: string;
    }[]>;
    countDocument(query: Record<string, any>): Promise<number>;
    findExistingBooking(props: ExistingBookingProps): Promise<boolean>;
    deleteById(id: string): Promise<void>;
    findAllOneToOneBooking(dto: GetAllOneToOneBookingDto): Promise<{
        data: AdminBookingView[];
        total: number;
    }>;
    findAllPoolingBooking(dto: GetAllOneToOneBookingDto): Promise<{
        data: AdminPoolingView[];
        total: number;
    }>;
    findAdminPoolingStudents(dto: GetAdminPoolingStudentsDto): Promise<AdminPoolingStudentRaw[]>;
    expireOtherBookingsForSlots(params: ExpireOtherBookingsForSlotParams, session: ClientSession): Promise<void>;
    getBookingIds(params: GetBookingsFromSlotParams): Promise<string[]>;
    confirmPoolingBookings(ids: string[], session: ClientSession): Promise<number>;
    addSlotsToBookings(bookingIds: string[], slotIds: string[], session: ClientSession): Promise<void>;
    findByQuery(query: Record<string, any>): Promise<Booking | null>;
    cancelBookingsByIds(bookingIds: string[], session: ClientSession): Promise<void>;
    getSlotBookingDetails(params: GetSlotBookingDetailsDto): Promise<BookingStudentView[]>;
    getChapterBookingDetails(params: GetChapterBookingDetailsDto): Promise<BookingStudentView[]>;
    findAllBookings(dto: GetAllBookingDto): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getTopBookingFaculties(range: BookingRange): Promise<TopFacultyBookingResponse>;
    getLowBookingFaculties(range: BookingRange): Promise<LowFacultyBookingResponse>;
    getZeroBookingItems(range: BookingRange): Promise<ZeroBookingResponse>;
    getAggregateBookingKpiStats(startDate: Date, endDate: Date): Promise<{
        totalBookings: number;
    }>;
    getDailyBookingKpiStats(startDate: Date, endDate: Date): Promise<{
        _id: string;
        bookings: number;
    }[]>;
    getUncontactedBookingsCount(): Promise<number>;
    getConfirmedBookingsCount(startDate: Date, endDate: Date): Promise<number>;
    getBookingsForChart(startDate: Date, endDate: Date): Promise<BookingChartRaw[]>;
    getBookingStatusCounts(): Promise<{
        _id: BookingStatus;
        count: number;
    }[]>;
}
//# sourceMappingURL=booking.repository.d.ts.map