import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { ITestimonialRepository } from "../repository/testimonial.repository.interface.js";
import type { IDeleteTestimonialUseCase } from "./interfaces/delete.testimonial.use-case.interface.js";

@injectable()
export class DeleteTestimonialUseCase implements IDeleteTestimonialUseCase {
  constructor(
    @inject("ITestimonialRepository")
    private readonly _testimonialRepository: ITestimonialRepository
  ) {}

  async execute(id: string): Promise<void> {
    //  Ensure testimonial exists
    const existing = await this._testimonialRepository.findById(id);

    if (!existing) {
      throw new CustomError(
        ResponseMessages.TESTIMONIAL_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    //  Hard delete
    await this._testimonialRepository.deleteById(id);
  }
}