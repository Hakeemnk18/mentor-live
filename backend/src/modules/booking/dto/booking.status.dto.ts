import { z } from "zod";

export const BookingStatusEnum = z.enum([
  "interested",
  "confirmed",
  "cancelled",
  "expired",
]);

export const BookingModeEnum = z.enum([
  "slot" ,
  "chapter"
])