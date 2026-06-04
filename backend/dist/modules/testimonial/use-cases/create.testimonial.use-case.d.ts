import type { ICreateTestimonialUseCase } from "./interfaces/create.testimonial.use-case.interface.js";
import type { CreateTestimonialRequestDto } from "../dto/create.testimonial.dto.js";
import type { ITestimonialRepository } from "../repository/testimonial.repository.interface.js";
export declare class CreateTestimonialUseCase implements ICreateTestimonialUseCase {
    private readonly _testimonialRepository;
    constructor(_testimonialRepository: ITestimonialRepository);
    execute(dto: CreateTestimonialRequestDto): Promise<void>;
}
//# sourceMappingURL=create.testimonial.use-case.d.ts.map