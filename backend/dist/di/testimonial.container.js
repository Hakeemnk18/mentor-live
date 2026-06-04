import { container } from "tsyringe";
import { TestimonialRepository } from "../modules/testimonial/repository/testimonial.repository.js";
import { CreateTestimonialUseCase } from "../modules/testimonial/use-cases/create.testimonial.use-case.js";
import { EditTestimonialUseCase } from "../modules/testimonial/use-cases/edit.testimonial.use-case.js";
import { DeleteTestimonialUseCase } from "../modules/testimonial/use-cases/delete.testimonial.use-case.js";
import { GetAllTestimonialUseCase } from "../modules/testimonial/use-cases/get.all.testimonial.use-case.js";
export const registerTestimonialDependencies = () => {
    container.register("ITestimonialRepository", {
        useClass: TestimonialRepository,
    });
    container.register("ICreateTestimonialUseCase", {
        useClass: CreateTestimonialUseCase,
    });
    container.register("IEditTestimonialUseCase", {
        useClass: EditTestimonialUseCase,
    });
    container.register("IDeleteTestimonialUseCase", {
        useClass: DeleteTestimonialUseCase,
    });
    container.register("IGetAllTestimonialUseCase", {
        useClass: GetAllTestimonialUseCase,
    });
};
//# sourceMappingURL=testimonial.container.js.map