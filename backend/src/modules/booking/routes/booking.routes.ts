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

router.get("/slot/details", (req, res) =>
  bookingController.getSlotBookingDetails(req, res),
);

router.get("/chapter/details", (req, res) =>
  bookingController.getChapterBookingDetails(req, res),
);

export default router;
