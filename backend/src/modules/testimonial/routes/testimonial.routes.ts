import { Router } from "express";
import { container } from "tsyringe";


import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { TestimonialController } from "../controller/testimonial.controller.js";

const router = Router();

const authenticate = container.resolve(Authenticate);
const testimonialController = container.resolve(TestimonialController);

/* ---------- CREATE ---------- */
router.post(
  "/",
  (req, res) => testimonialController.createTestimonial(req, res)
);

/* ---------- EDIT ---------- */
router.put(
  "/:id",
  (req, res) => testimonialController.editTestimonial(req, res)
);

/* ---------- DELETE (hard delete) ---------- */
router.delete(
  "/:id",
  (req, res) => testimonialController.deleteTestimonial(req, res)
);

/* ---------- USER: get all Testimonials ---------- */
router.get(
  "/list",
  (req, res) => testimonialController.getAllTestimonialForUser(req, res)
);

/* ---------- ADMIN: get all Testimonials ---------- */
router.get(
  "/",
  (req, res) => testimonialController.getAllTestimonialForAdmin(req, res)
);

export default router;