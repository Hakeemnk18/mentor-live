import type { IGetAllDocDB } from "../../../core/shared/interfaces/get.all.doc.interface.js";
import { SubjectVariant } from "../entities/subject.variant.entity.js";
import type { SubjectVariantView, SubjectVariantViewOnlyWithSubject, SubjectVariantWithSubjectView } from "../type/subject.variant.type.js";
import type { ISubjectVariantRepository } from "./subject.variant.repository.interface.js";
export declare class SubjectVariantRepository implements ISubjectVariantRepository {
    create(entity: SubjectVariant): Promise<SubjectVariant>;
    findById(id: string): Promise<SubjectVariant | null>;
    findByCombination(subjectId: string, classId: string, syllabusId: string): Promise<SubjectVariant | null>;
    save(entity: SubjectVariant): Promise<SubjectVariant>;
    findAllForAdmin(allDoc: IGetAllDocDB): Promise<SubjectVariant[]>;
    findAllWithPopulated(query: Record<string, any>): Promise<SubjectVariantView[]>;
    countDocument(query: Record<string, any>): Promise<number>;
    delete(subjectId: string, variantId: string): Promise<void>;
    findOne(query: Record<string, any>): Promise<SubjectVariant | null>;
    findAllWithPopulatedSUbject(query: Record<string, any>): Promise<SubjectVariantWithSubjectView[]>;
    findAllWithSubject(query: Record<string, any>): Promise<SubjectVariantViewOnlyWithSubject[]>;
    findAllIds(query: Record<string, any>): Promise<string[]>;
}
//# sourceMappingURL=subject.variant.repository.d.ts.map