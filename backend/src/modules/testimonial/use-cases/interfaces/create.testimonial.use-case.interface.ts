import type { CreateTestimonialRequestDto } from "../../dto/create.testimonial.dto.js";

export interface ICreateTestimonialUseCase {
  execute(dto: CreateTestimonialRequestDto): Promise<void>;
}