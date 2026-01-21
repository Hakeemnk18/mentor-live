import bookingRouter from "./routes/booking.routes.js"
import type { Application } from 'express';

export default function registerBookingModule(app:Application){
    app.use("/api/v1/bookings", bookingRouter);
}
