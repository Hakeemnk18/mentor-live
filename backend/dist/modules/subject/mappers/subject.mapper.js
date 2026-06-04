import { Subject } from "../entities/subject.entity.js";
export class SubjectMapper {
    static toDomain(subjectModelData) {
        if (!subjectModelData) {
            return null;
        }
        const idString = subjectModelData._id?.toString() || subjectModelData.id?.toString();
        if (!idString) {
            console.error("Subject data from DB is missing an ID:", subjectModelData);
            return null;
        }
        return new Subject({
            id: idString,
            name: subjectModelData.name,
            isDeleted: subjectModelData.isDeleted,
        });
    }
    static toPersistence(subjectEntity) {
        return {
            name: subjectEntity.name,
            isDeleted: subjectEntity.isDeleted,
        };
    }
}
//# sourceMappingURL=subject.mapper.js.map