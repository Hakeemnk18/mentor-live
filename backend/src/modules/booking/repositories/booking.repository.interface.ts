import type { ClientSession } from "mongoose";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { GetAllOneToOneBookingDto } from "../dto/get.all.one.to.one.dto.js";
import type { GetAdminPoolingStudentsDto } from "../dto/get.pooling.students.dto.js";
import { Booking } from "../entities/booking.entity.js";
import type {
  AdminBookingView,
  AdminPoolingStudentRaw,
  AdminPoolingView,
  BookingStudentView,
  ExistingBookingProps,
  ExpireOtherBookingsForSlotParams,
  GetBookingsFromSlotParams,
} from "../type/booking.type.js";
import type { GetSlotBookingDetailsDto } from "../dto/slot.booking.details.dto.js";
import type { GetChapterBookingDetailsDto } from "../dto/chapter.booking.details.dto.js";
import type { GetAllBookingDto } from "../dto/get.all.booking.dto.js";
import type {
  BookingRange,
  LowFacultyBookingResponse,
  TopFacultyBookingResponse,
  ZeroBookingResponse,
} from "../../analysis/type/analysis.type.js";

export interface IBookingRepository {
  create(bookingEntity: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  save(bookingEntity: Booking, session?: ClientSession): Promise<Booking>;
  findAllForUser(): Promise<{ id: string; status: string }[]>;
  countDocument(query: Record<string, any>): Promise<number>;
  findExistingBooking(props: ExistingBookingProps): Promise<boolean>;
  deleteById(id: string): Promise<void>;
  findAllOneToOneBooking(
    dto: GetAllOneToOneBookingDto,
  ): Promise<{ data: AdminBookingView[]; total: number }>;
  findAllPoolingBooking(
    dto: GetAllOneToOneBookingDto,
  ): Promise<{ data: AdminPoolingView[]; total: number }>;
  findAdminPoolingStudents(
    dto: GetAdminPoolingStudentsDto,
  ): Promise<AdminPoolingStudentRaw[]>;
  confirmPoolingBookings(
    ids: string[],
    session: ClientSession,
  ): Promise<number>;
  expireOtherBookingsForSlots(
    params: ExpireOtherBookingsForSlotParams,
    session?: ClientSession,
  ): Promise<void>;
  getBookingIds(prams: GetBookingsFromSlotParams): Promise<string[]>;
  addSlotsToBookings(
    bookingIds: string[],
    slotIds: string[],
    session: ClientSession,
  ): Promise<void>;
  findByQuery(query: Record<string, any>): Promise<Booking | null>;
  cancelBookingsByIds(
    bookingIds: string[],
    session: ClientSession,
  ): Promise<void>;
  getSlotBookingDetails(
    params: GetSlotBookingDetailsDto,
  ): Promise<BookingStudentView[]>;
  getChapterBookingDetails(
    params: GetChapterBookingDetailsDto,
  ): Promise<BookingStudentView[]>;
  findAllBookings(dto: GetAllBookingDto): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getTopBookingFaculties(
    range: BookingRange,
  ): Promise<TopFacultyBookingResponse>;
  getLowBookingFaculties(
    range: BookingRange,
  ): Promise<LowFacultyBookingResponse>;
  getZeroBookingItems(range: BookingRange): Promise<ZeroBookingResponse>;
}
