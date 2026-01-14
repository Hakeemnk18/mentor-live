import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { SubjectVariant } from "../entities/subject.variant.entity.js";

export interface ISubjectVariantRepository {
  create(subjectVariant: SubjectVariant): Promise<SubjectVariant>;
  findById(id: string): Promise<SubjectVariant | null>;
  findByCombination(
    subjectId: string,
    classId: string,
    syllabusId: string
  ): Promise<SubjectVariant | null>;
  save(subjectVariant: SubjectVariant): Promise<SubjectVariant>;
  findAllForAdmin(allDoc: IGetAllDocDB): Promise<SubjectVariant[]>;
  countDocument(query: Record<string, any>): Promise<number>;
}
