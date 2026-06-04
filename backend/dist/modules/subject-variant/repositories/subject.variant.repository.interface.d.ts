import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { SubjectVariant } from "../entities/subject.variant.entity.js";
import type { SubjectVariantView, SubjectVariantViewOnlyWithSubject, SubjectVariantWithSubjectView } from "../type/subject.variant.type.js";
export interface ISubjectVariantRepository {
    create(subjectVariant: SubjectVariant): Promise<SubjectVariant>;
    findById(id: string): Promise<SubjectVariant | null>;
    findOne(query: Record<string, any>): Promise<SubjectVariant | null>;
    findByCombination(subjectId: string, classId: string, syllabusId: string): Promise<SubjectVariant | null>;
    save(subjectVariant: SubjectVariant): Promise<SubjectVariant>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<SubjectVariant[]>;
    countDocument(query: Record<string, any>): Promise<number>;
    delete(subjectId: string, variantId: string): Promise<void>;
    findAllIds(query: Record<string, any>): Promise<string[]>;
    findAllWithPopulated(query: Record<string, any>): Promise<SubjectVariantView[]>;
    findAllWithSubject(query: Record<string, any>): Promise<SubjectVariantViewOnlyWithSubject[]>;
    findAllWithPopulatedSUbject(query: Record<string, any>): Promise<SubjectVariantWithSubjectView[]>;
}
//# sourceMappingURL=subject.variant.repository.interface.d.ts.map