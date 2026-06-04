import testimonialRouter from "./routes/testimonial.routes.js";
export default function registerTestimonialModule(app) {
    app.use("/api/v1/testimonials", testimonialRouter);
}
//# sourceMappingURL=testimonial.module.js.map