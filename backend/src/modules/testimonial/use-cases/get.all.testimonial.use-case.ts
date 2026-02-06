import { inject, injectable } from "tsyringe";
import type { ITestimonialRepository } from "../repository/testimonial.repository.interface.js";
import type { Testimonial } from "../entities/testimonial.entity.js";
import type { IGetAllTestimonialUseCase } from "./interfaces/get.all.testimonial.use-case.interface.js";

@injectable()
export class GetAllTestimonialUseCase
  implements IGetAllTestimonialUseCase
{
  constructor(
    @inject("ITestimonialRepository")
    private readonly _testimonialRepository: ITestimonialRepository
  ) {}

  async execute(): Promise<Testimonial[]> {
    return await this._testimonialRepository.findAllForUser();
  }
}
