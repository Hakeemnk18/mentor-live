import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import { Testimonial } from "../entities/testimonial.entity.js";
import type { IEditTestimonialUseCase } from "./interfaces/edit.testimonial.use-case.interface.js";
import type { CreateTestimonialRequestDto } from "../dto/create.testimonial.dto.js";
import type { ITestimonialRepository } from "../repository/testimonial.repository.interface.js";

@injectable()
export class EditTestimonialUseCase implements IEditTestimonialUseCase {
  constructor(
    @inject("ITestimonialRepository")
    private readonly _testimonialRepository: ITestimonialRepository
  ) {}

  async execute(
    id: string,
    dto: CreateTestimonialRequestDto
  ): Promise<void> {
    //  Fetch existing testimonial
    const existing = await this._testimonialRepository.findById(id);

    if (!existing) {
      throw new CustomError(
        ResponseMessages.TESTIMONIAL_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    //  Author uniqueness check (exclude self)
    if (existing.author !== dto.author) {
      const authorExists =
        await this._testimonialRepository.findByAuthor(dto.author);

      if (authorExists) {
        throw new CustomError(
          ResponseMessages.TESTIMONIAL_AUTHOR_ALREADY_EXISTS,
          HttpStatusCode.BAD_REQUEST
        );
      }
    }

    //  Rebuild domain entity (immutable update)
    const updated = new Testimonial({
      id: existing.id,
      author: dto.author,
      designation: dto.designation,
      comment: dto.comment,
      isDeleted: existing.isDeleted,
    });

    //  Persist
    await this._testimonialRepository.save(updated);
  }
}
