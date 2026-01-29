import { container } from "tsyringe";

import { TestimonialRepository } from "../modules/testimonial/repository/testimonial.repository.js";

import type { ICreateTestimonialUseCase } from "../modules/testimonial/use-cases/interfaces/create.testimonial.use-case.interface.js";
import { CreateTestimonialUseCase } from "../modules/testimonial/use-cases/create.testimonial.use-case.js";

import type { IEditTestimonialUseCase } from "../modules/testimonial/use-cases/interfaces/edit.testimonial.use-case.interface.js";
import { EditTestimonialUseCase } from "../modules/testimonial/use-cases/edit.testimonial.use-case.js";

import type { IDeleteTestimonialUseCase } from "../modules/testimonial/use-cases/interfaces/delete.testimonial.use-case.interface.js";
import { DeleteTestimonialUseCase } from "../modules/testimonial/use-cases/delete.testimonial.use-case.js";

import type { IGetAllTestimonialUseCase } from "../modules/testimonial/use-cases/interfaces/get.all.testimonial.use-case.interface.js";
import { GetAllTestimonialUseCase } from "../modules/testimonial/use-cases/get.all.testimonial.use-case.js";

import type { ITestimonialRepository } from "../modules/testimonial/repository/testimonial.repository.interface.js";

export const registerTestimonialDependencies = () => {
  container.register<ITestimonialRepository>("ITestimonialRepository", {
    useClass: TestimonialRepository,
  });

  container.register<ICreateTestimonialUseCase>(
    "ICreateTestimonialUseCase",
    {
      useClass: CreateTestimonialUseCase,
    }
  );

  container.register<IEditTestimonialUseCase>("IEditTestimonialUseCase", {
    useClass: EditTestimonialUseCase,
  });

  container.register<IDeleteTestimonialUseCase>(
    "IDeleteTestimonialUseCase",
    {
      useClass: DeleteTestimonialUseCase,
    }
  );

  container.register<IGetAllTestimonialUseCase>(
    "IGetAllTestimonialUseCase",
    {
      useClass: GetAllTestimonialUseCase,
    }
  );
};
