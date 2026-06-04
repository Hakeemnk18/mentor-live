import { Class } from "../entities/class.entity.js";
export class ClassMapper {
    static toDomain(classModelData) {
        if (!classModelData) {
            return null;
        }
        const idString = classModelData._id?.toString() || classModelData.id?.toString();
        if (!idString) {
            console.error("Class data from DB is missing an ID:", classModelData);
            return null;
        }
        return new Class({
            id: idString,
            name: classModelData.name,
            isDeleted: classModelData.isDeleted,
        });
    }
    static toPersistence(classEntity) {
        return {
            name: classEntity.name,
            isDeleted: classEntity.isDeleted,
        };
    }
}
//# sourceMappingURL=class.mapper.js.map