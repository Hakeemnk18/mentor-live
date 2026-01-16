import { inject, injectable } from "tsyringe";
import type { ISubjectVariantRepository } from "../repositories/subject.variant.repository.interface.js";
import type { IFindSubjectVariantWithSubjectUseCase } from "./interfaces/find.subject.variant.with.subject.use-case.interface.js";
import type { SubjectVariantViewOnlyWithSubject } from "../type/subject.variant.type.js";
import type { GetSubjectVariantsByClassAndSyllabusQueryDto } from "../dtos/get.all.variant.with.subject.dto.js";


@injectable()
export class FindSubjectVariantWithSubjectUseCase implements IFindSubjectVariantWithSubjectUseCase {

    constructor(
        @inject("ISubjectVariantRepository")
        private readonly _subjectVariantRepository: ISubjectVariantRepository
    ){}

    async execute(
        dto: GetSubjectVariantsByClassAndSyllabusQueryDto
    ): Promise<SubjectVariantViewOnlyWithSubject[]> {

        const { classId, syllabusId} = dto
        
        const query:Record<string, any>  = {
            class: classId,
            syllabus: syllabusId
        }

        return await  this._subjectVariantRepository.findAllWithSubject(query);
    }
} 