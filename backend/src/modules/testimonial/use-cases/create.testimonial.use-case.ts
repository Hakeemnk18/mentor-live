import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Testimonial } from "../entities/testimonial.entity.js";
import type { ICreateTestimonialUseCase } from "./interfaces/create.testimonial.use-case.interface.js";
import type { CreateTestimonialRequestDto } from "../dto/create.testimonial.dto.js";
import type { ITestimonialRepository } from "../repository/testimonial.repository.interface.js";

@injectable()
export class CreateTestimonialUseCase
  implements ICreateTestimonialUseCase
{
  constructor(
    @inject("ITestimonialRepository")
    private readonly _testimonialRepository: ITestimonialRepository
  ) {}

  async execute(dto: CreateTestimonialRequestDto): Promise<void> {
    /* ---------- duplicate author check ---------- */
    const authorExists =
      await this._testimonialRepository.findByAuthor(dto.author);

    if (authorExists) {
      throw new CustomError(
        ResponseMessages.TESTIMONIAL_AUTHOR_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    /* ---------- create testimonial entity ---------- */
    const testimonialEntity = new Testimonial({
      id: null,
      author: dto.author,
      designation: dto.designation,
      comment: dto.comment,
      isDeleted: false,
    });

    const testimonial =
      await this._testimonialRepository.create(testimonialEntity);

    if (!testimonial) {
      throw new CustomError(
        ResponseMessages.TESTIMONIAL_CREATION_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
