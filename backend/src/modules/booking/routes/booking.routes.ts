import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { BookingController } from "../controller/booking.controller.js";




const router = Router({ mergeParams: true });

const authenticate = container.resolve(Authenticate);
const bookingController = container.resolve(BookingController)



router.post('/',
  (req,res) => bookingController.createBooking(req, res)
)

export default router;