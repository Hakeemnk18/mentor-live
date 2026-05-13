import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { BookingController } from "../controller/booking.controller.js";

const router = Router({ mergeParams: true });

const authenticate = container.resolve(Authenticate);
const bookingController = container.resolve(BookingController);

// create booking
router.post("/", (req, res) => bookingController.createBooking(req, res));

// get all one to one booking
router.get("/one-to-one", (req, res) =>
  bookingController.getAllOneToOneBooking(req, res),
);

// get all booking
router.get("/", (req, res) => bookingController.getAllBookings(req, res));

// get all pooling booking
router.get("/pooling", (req, res) =>
  bookingController.getAllPoolingBooking(req, res),
);

// get pooling students
router.get("/pooling/students", (req, res) =>
  bookingController.getPoolingStudents(req, res),
);

router.patch("/one-to-one/slot/:bookingId/confirm", (req, res) =>
  bookingController.confirmOneToOneBooking(req, res),
);

router.patch("/one-to-one/chapter/:bookingId/confirm", (req, res) =>
  bookingController.confirmChapterOneToOneBooking(req, res),
);

router.patch("/pooling/slot/confirm", (req, res) =>
  bookingController.confirmPoolingBookings(req, res),
);

router.patch("/pooling/chapter/confirm", (req, res) =>
  bookingController.confirmChapterPoolingBooking(req, res),
);

router.patch("/pooling/remove-student", (req, res) =>
  bookingController.removeStudentFromPooling(req, res),
);

router.get("/slot/details", (req, res) =>
  bookingController.getSlotBookingDetails(req, res),
);

router.get("/chapter/details", (req, res) =>
  bookingController.getChapterBookingDetails(req, res),
);

export default router;
