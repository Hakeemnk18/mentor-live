import bookingRouter from "./routes/booking.routes.js";
export default function registerBookingModule(app) {
    app.use("/api/v1/bookings", bookingRouter);
}
//# sourceMappingURL=booking.module.js.map