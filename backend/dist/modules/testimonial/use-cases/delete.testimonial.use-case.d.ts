import type { ITestimonialRepository } from "../repository/testimonial.repository.interface.js";
import type { IDeleteTestimonialUseCase } from "./interfaces/delete.testimonial.use-case.interface.js";
export declare class DeleteTestimonialUseCase implements IDeleteTestimonialUseCase {
    private readonly _testimonialRepository;
    constructor(_testimonialRepository: ITestimonialRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=delete.testimonial.use-case.d.ts.map