import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { Booking } from "../entities/booking.entity.js";
import type { ExistingBookingProps } from "../type/booking.type.js";

export interface IBookingRepository {
  create(bookingEntity: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  save(bookingEntity: Booking): Promise<Booking>;
  findAllForAdmin(allDoc: IGetAllDocDB): Promise<Booking[]>;
  findAllForUser(): Promise<
    { id: string; status: string }[]
  >;
  countDocument(query: Record<string, any>): Promise<number>;
  findExistingBooking(
    props: ExistingBookingProps
  ): Promise<boolean>;
 deleteById(id: string): Promise<void>
}