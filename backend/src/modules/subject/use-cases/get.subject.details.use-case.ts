import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../core/errors/custom.error.js";
import { ResponseMessages } from "../../../core/constants/response.message.js";
import { HttpStatusCode } from "../../../core/constants/http.status.codes.js";

import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import type { ISubjectVariantRepository } from "../../../modules/subject-variant/repositories/subject.variant.repository.interface.js";
import type { IGetSubjectDetailsUseCase } from "./interfaces/get.subject.details.use-case.interface.js";
import type { SubjectDetailsView } from "../type/subject.type.js";
import type { SubjectVariantView } from "../../subject-variant/type/subject.variant.type.js";

@injectable()
export class GetSubjectDetailsUseCase
  implements IGetSubjectDetailsUseCase
{
  constructor(
    @inject("ISubjectRepository")
    private readonly _subjectRepository: ISubjectRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(subjectId: string): Promise<SubjectDetailsView> {
    // 1️⃣ Load Subject
    const subject = await this._subjectRepository.findById(subjectId);

    if (!subject || subject.isDeleted) {
      throw new CustomError(
        ResponseMessages.SUBJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    
    const data: SubjectVariantView[] = await this._subjectVariantRepository.findAllWithPopulated({ subject: subjectId })
    
    return {
        subject: {id: subject.id!, name: subject.name},
        variants: data
    };
  }
}
