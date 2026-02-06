import type { CreateTestimonialRequestDto } from "../../dto/create.testimonial.dto.js";

export interface IEditTestimonialUseCase {
  execute(id: string, dto: CreateTestimonialRequestDto): Promise<void>;
}