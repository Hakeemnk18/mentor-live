import type { IEditTestimonialUseCase } from "./interfaces/edit.testimonial.use-case.interface.js";
import type { CreateTestimonialRequestDto } from "../dto/create.testimonial.dto.js";
import type { ITestimonialRepository } from "../repository/testimonial.repository.interface.js";
export declare class EditTestimonialUseCase implements IEditTestimonialUseCase {
    private readonly _testimonialRepository;
    constructor(_testimonialRepository: ITestimonialRepository);
    execute(id: string, dto: CreateTestimonialRequestDto): Promise<void>;
}
//# sourceMappingURL=edit.testimonial.use-case.d.ts.map