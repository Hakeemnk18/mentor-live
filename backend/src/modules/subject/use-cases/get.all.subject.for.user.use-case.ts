import { inject, injectable } from "tsyringe";
import type {
  GetAllSubjectForUserFilters,
  IGetAllSubjectForUserUseCase,
} from "./interfaces/get.all.subject.for.user.use-case.interface.js";
import type { ISubjectRepository } from "../repositories/subject.repository.interface.js";
import type { ISubjectVariantRepository } from "../../subject-variant/repositories/subject.variant.repository.interface.js";

@injectable()
export class GetAllSubjectForUserUseCase
  implements IGetAllSubjectForUserUseCase
{
  constructor(
    @inject("ISubjectRepository")
    private readonly _subjectRepository: ISubjectRepository,

    @inject("ISubjectVariantRepository")
    private readonly _subjectVariantRepository: ISubjectVariantRepository
  ) {}

  async execute(
    filters?: GetAllSubjectForUserFilters
  ): Promise<{ id: string; name: string }[]> {
    const { syllabusId, classId } = filters ?? {};

    if (!syllabusId && !classId) {
      return this._subjectRepository.findAllForUser();
    }

    const query: Record<string, any> = { isDeleted: false };
    if (syllabusId) query.syllabus = syllabusId;
    if (classId) query.class = classId;

    const variants = await this._subjectVariantRepository.findAllWithSubject(query);

    const subjects = new Map<string, string>();
    for (const variant of variants) {
      if (!subjects.has(variant.subject.id)) {
        subjects.set(variant.subject.id, variant.subject.name);
      }
    }

    return Array.from(subjects, ([id, name]) => ({ id, name }));
  }
}
