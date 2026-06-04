import { SubjectVariant } from "../entities/subject.variant.entity.js";
export class SubjectVariantMapper {
    static toDomain(subjectVariantModelData) {
        if (!subjectVariantModelData) {
            return null;
        }
        const idString = subjectVariantModelData._id?.toString() ||
            subjectVariantModelData.id?.toString();
        if (!idString) {
            console.error("SubjectVariant data from DB is missing an ID:", subjectVariantModelData);
            return null;
        }
        return new SubjectVariant({
            id: idString,
            subjectId: subjectVariantModelData.subject?.toString() ||
                subjectVariantModelData.subjectId?.toString(),
            classId: subjectVariantModelData.class?.toString() ||
                subjectVariantModelData.classId?.toString(),
            syllabusId: subjectVariantModelData.syllabus?.toString() ||
                subjectVariantModelData.syllabusId?.toString(),
            isDeleted: subjectVariantModelData.isDeleted,
        });
    }
    static toPersistence(subjectVariantEntity) {
        return {
            subject: subjectVariantEntity.subjectId,
            class: subjectVariantEntity.classId,
            syllabus: subjectVariantEntity.syllabusId,
            isDeleted: subjectVariantEntity.isDeleted,
        };
    }
}
//# sourceMappingURL=subject.variant.mapper.js.map