import type { Testimonial } from "../../entities/testimonial.entity.js";

export interface IGetAllTestimonialUseCase {
  execute(): Promise<Testimonial[]>;
}