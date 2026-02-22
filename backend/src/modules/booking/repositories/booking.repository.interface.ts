import type { ClientSession } from "mongoose";
import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import type { GetAllOneToOneBookingDto } from "../dto/get.all.one.to.one.dto.js";
import type { GetAdminPoolingStudentsDto } from "../dto/get.pooling.students.dto.js";
import { Booking } from "../entities/booking.entity.js";
import type {
  AdminBookingView,
  AdminPoolingStudentRaw,
  AdminPoolingView,
  ExistingBookingProps,
  ExpireOtherBookingsForSlotParams,
  GetBookingsFromSlotParams,
} from "../type/booking.type.js";

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
     dto: GetAdminPoolingStudentsDto
    ): Promise<AdminPoolingStudentRaw[]>
  confirmPoolingBookings(ids: string[], session: ClientSession): Promise<number>;
  expireOtherBookingsForSlots(params: ExpireOtherBookingsForSlotParams, session?: ClientSession): Promise<void>
  getBookingIds(prams: GetBookingsFromSlotParams): Promise<string []>
  addSlotsToBookings(bookingIds: string[], slotIds: string[], session: ClientSession): Promise<void>
  findByQuery(query: Record<string, any>): Promise<Booking | null>;
  cancelBookingsByIds(bookingIds: string[], session: ClientSession): Promise<void>;
}
