import type { ITestimonialRepository } from "../repository/testimonial.repository.interface.js";
import type { Testimonial } from "../entities/testimonial.entity.js";
import type { IGetAllTestimonialUseCase } from "./interfaces/get.all.testimonial.use-case.interface.js";
export declare class GetAllTestimonialUseCase implements IGetAllTestimonialUseCase {
    private readonly _testimonialRepository;
    constructor(_testimonialRepository: ITestimonialRepository);
    execute(): Promise<Testimonial[]>;
}
//# sourceMappingURL=get.all.testimonial.use-case.d.ts.map