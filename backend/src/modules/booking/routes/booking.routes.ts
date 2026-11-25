import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { BookingController } from "../controller/booking.controller.js";
import { bookingLimiter } from "../../../config/rate.limit.js";

const router = Router({ mergeParams: true });

const authenticate = container.resolve(Authenticate);
const bookingController = container.resolve(BookingController);

// create booking (rate limited — protects the public form now that OTP is off)
router.post("/", bookingLimiter, (req, res) => bookingController.createBooking(req, res));

// get all one to one booking for admin
router.get("/one-to-one",
  authenticate.authenticate,
  authorizeRoles("admin", "salesPerson"),
  (req, res) =>
    bookingController.getAllOneToOneBooking(req, res),
);

// export one to one bookings (respects current filters)
router.get("/one-to-one/export",
  authenticate.authenticate,
  authorizeRoles("admin", "salesPerson"),
  (req, res) =>
    bookingController.exportOneToOneBookings(req, res),
);

// get all booking
router.get("/",
  authenticate.authenticate,
  authorizeRoles("admin", "salesPerson"),
  (req, res) => bookingController.getAllBookings(req, res)
);

// export all bookings (respects current filters)
router.get("/export",
  authenticate.authenticate,
  authorizeRoles("admin", "salesPerson"),
  (req, res) => bookingController.exportAllBookings(req, res)
);

// get all pooling booking
router.get("/pooling",
  authenticate.authenticate,
  authorizeRoles("admin", "salesPerson"),
  (req, res) =>
    bookingController.getAllPoolingBooking(req, res),
);

// export pooling bookings (respects current filters)
router.get("/pooling/export",
  authenticate.authenticate,
  authorizeRoles("admin", "salesPerson"),
  (req, res) =>
    bookingController.exportPoolingBookings(req, res),
);

// get pooling students
router.get("/pooling/students", 
  authenticate.authenticate,
  authorizeRoles("admin", "salesPerson"),
  (req, res) =>
    bookingController.getPoolingStudents(req, res),
);

// confirm one to one booking
router.patch("/one-to-one/slot/:bookingId/confirm",
  authenticate.authenticate,
  authorizeRoles("admin"),
   (req, res) =>
  bookingController.confirmOneToOneBooking(req, res),
);

// confirm chapter one to one booking
router.patch("/one-to-one/chapter/:bookingId/confirm",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) =>
  bookingController.confirmChapterOneToOneBooking(req, res),
);

// mark a booking as contacted
router.patch("/one-to-one/:bookingId/contact",
  authenticate.authenticate,
  authorizeRoles("admin", "salesPerson"),
  (req, res) =>
  bookingController.markBookingContacted(req, res),
);

// confirm pooling booking
router.patch("/pooling/slot/confirm", 
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) =>
  bookingController.confirmPoolingBookings(req, res),
);

// confirm chapter pooling booking
router.patch("/pooling/chapter/confirm", 
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) =>
  bookingController.confirmChapterPoolingBooking(req, res),
);

// remove student from pooling
router.patch("/pooling/remove-student", 
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) =>
  bookingController.removeStudentFromPooling(req, res),
);

/* ─────────────────────────────────────────────────────────────────────────────
 * [DISABLED – security, Nov 2026] Public booking-details endpoints
 *
 * Why: these two routes had NO login check, but returned the name + phone number
 * of every pending student for a slot / chapter (slot & faculty ids are public),
 * so anyone could collect students' phone numbers.
 *
 * Not used anywhere: the website and admin never call them. Admin gets the same
 * details through protected routes:
 *   - Pool details (slot + chapter)  → GET /bookings/pooling/students
 *   - One-on-one (incl. chapter)     → GET /bookings/one-to-one
 *
 * To re-enable: uncomment below AND keep the login guard, e.g.
 *   router.get("/slot/details", authenticate.authenticate, authorizeRoles("admin", "salesPerson"), …)
 * Controller, use-cases and repository methods are untouched.
 * ───────────────────────────────────────────────────────────────────────────── */
// router.get("/slot/details", (req, res) =>
//   bookingController.getSlotBookingDetails(req, res),
// );
//
// router.get("/chapter/details", (req, res) =>
//   bookingController.getChapterBookingDetails(req, res),
// );

export default router;
