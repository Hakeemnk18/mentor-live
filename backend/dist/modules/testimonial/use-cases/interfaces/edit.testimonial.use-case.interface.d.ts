import type { CreateTestimonialRequestDto } from "../../dto/create.testimonial.dto.js";
export interface IEditTestimonialUseCase {
    execute(id: string, dto: CreateTestimonialRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.testimonial.use-case.interface.d.ts.map