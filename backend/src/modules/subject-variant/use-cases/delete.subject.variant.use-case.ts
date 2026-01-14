import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";
import type { IDeleteSubjectVariantUseCase } from "./interfaces/delete.subject.variant.use-case.interface.js";

@injectable()
export class DeleteSubjectVariantUseCase
  implements IDeleteSubjectVariantUseCase
{
  constructor(
    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(subjectId: string, variantId: string): Promise<void> {
    const variant = await this._subjectVariantRepository.findOne({
      _id: variantId,
      subject: subjectId,
      isDeleted: false,
    });

    if (!variant) {
      throw new CustomError(
        ResponseMessages.SUBJECT_VARIANT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    // 2️⃣ Count how many variants this subject has
    const count = await this._subjectVariantRepository.countDocument({
      subject: subjectId,
      isDeleted: false,
    });

    if (count <= 1) {
      throw new CustomError(
        ResponseMessages.SUBJECT_VARIANT_CANNOT_DELETE_LAST,
        HttpStatusCode.BAD_REQUEST
      );
    }

    // 3️⃣ Delete safely (now guaranteed ownership)
    await this._subjectVariantRepository.delete(subjectId, variantId);
  }
}
